import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { LoginForm } from '../../src/components/auth/LoginForm'
import { LeadManagement } from '../../src/components/pages/LeadManagement'
import { mockUser, mockLead } from '../utils/test-utils'

// Mock API server
const server = setupServer(
  // Auth endpoints
  rest.post('/api/v1/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        access_token: 'mock-token',
        token_type: 'bearer',
        user: mockUser,
      })
    )
  }),

  rest.get('/api/v1/auth/me', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.includes('mock-token')) {
      return res(ctx.status(401), ctx.json({ detail: 'Unauthorized' }))
    }
    return res(ctx.json(mockUser))
  }),

  // Leads endpoints
  rest.get('/api/v1/leads', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.includes('mock-token')) {
      return res(ctx.status(401), ctx.json({ detail: 'Unauthorized' }))
    }
    
    const page = req.url.searchParams.get('page') || '1'
    const size = req.url.searchParams.get('size') || '10'
    const search = req.url.searchParams.get('search')
    
    let leads = [
      { ...mockLead, id: 1, email: 'lead1@example.com', first_name: 'John' },
      { ...mockLead, id: 2, email: 'lead2@example.com', first_name: 'Jane' },
      { ...mockLead, id: 3, email: 'lead3@example.com', first_name: 'Bob' },
    ]
    
    if (search) {
      leads = leads.filter(lead => 
        lead.first_name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    return res(
      ctx.json({
        items: leads,
        total: leads.length,
        page: parseInt(page),
        size: parseInt(size),
      })
    )
  }),

  rest.post('/api/v1/leads', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.includes('mock-token')) {
      return res(ctx.status(401), ctx.json({ detail: 'Unauthorized' }))
    }
    
    return res(
      ctx.status(201),
      ctx.json({
        ...mockLead,
        id: 4,
        ...req.body,
      })
    )
  }),

  rest.put('/api/v1/leads/:id', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.includes('mock-token')) {
      return res(ctx.status(401), ctx.json({ detail: 'Unauthorized' }))
    }
    
    const { id } = req.params
    return res(
      ctx.json({
        ...mockLead,
        id: parseInt(id as string),
        ...req.body,
      })
    )
  }),

  rest.delete('/api/v1/leads/:id', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.includes('mock-token')) {
      return res(ctx.status(401), ctx.json({ detail: 'Unauthorized' }))
    }
    
    return res(ctx.status(204))
  }),
)

describe('API Integration Tests', () => {
  beforeEach(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
    vi.clearAllMocks()
  })

  afterAll(() => {
    server.close()
  })

  describe('Authentication Flow', () => {
    it('handles successful login and token storage', async () => {
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token')
      })
    })

    it('handles authentication errors', async () => {
      server.use(
        rest.post('/api/v1/auth/login', (req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({ detail: 'Invalid credentials' })
          )
        })
      )
      
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })

    it('includes auth token in subsequent requests', async () => {
      // Mock localStorage to return a token
      vi.mocked(localStorage.getItem).mockReturnValue('mock-token')
      
      render(<LeadManagement />, { user: mockUser })
      
      await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument()
      })
    })
  })

  describe('Lead Management Integration', () => {
    beforeEach(() => {
      vi.mocked(localStorage.getItem).mockReturnValue('mock-token')
    })

    it('loads and displays leads from API', async () => {
      render(<LeadManagement />, { user: mockUser })
      
      await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument()
        expect(screen.getByText('Jane')).toBeInTheDocument()
        expect(screen.getByText('Bob')).toBeInTheDocument()
      })
    })

    it('handles lead search functionality', async () => {
      render(<LeadManagement />, { user: mockUser })
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument()
      })
      
      const searchInput = screen.getByPlaceholderText(/search leads/i)
      fireEvent.change(searchInput, { target: { value: 'John' } })
      
      await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument()
        expect(screen.queryByText('Jane')).not.toBeInTheDocument()
        expect(screen.queryByText('Bob')).not.toBeInTheDocument()
      })
    })

    it('handles lead creation', async () => {
      render(<LeadManagement />, { user: mockUser })
      
      const addButton = screen.getByRole('button', { name: /add lead/i })
      fireEvent.click(addButton)
      
      // Fill out the form
      const emailInput = screen.getByLabelText(/email/i)
      const firstNameInput = screen.getByLabelText(/first name/i)
      const lastNameInput = screen.getByLabelText(/last name/i)
      
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } })
      fireEvent.change(firstNameInput, { target: { value: 'New' } })
      fireEvent.change(lastNameInput, { target: { value: 'Lead' } })
      
      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)
      
      await waitFor(() => {
        expect(screen.getByText(/lead created successfully/i)).toBeInTheDocument()
      })
    })

    it('handles lead editing', async () => {
      render(<LeadManagement />, { user: mockUser })
      
      await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument()
      })
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      fireEvent.click(editButtons[0])
      
      const firstNameInput = screen.getByDisplayValue('John')
      fireEvent.change(firstNameInput, { target: { value: 'Updated John' } })
      
      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)
      
      await waitFor(() => {
        expect(screen.getByText(/lead updated successfully/i)).toBeInTheDocument()
      })
    })

    it('handles lead deletion', async () => {
      render(<LeadManagement />, { user: mockUser })
      
      await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument()
      })
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      fireEvent.click(deleteButtons[0])
      
      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /confirm/i })
      fireEvent.click(confirmButton)
      
      await waitFor(() => {
        expect(screen.getByText(/lead deleted successfully/i)).toBeInTheDocument()
      })
    })

    it('handles API errors gracefully', async () => {
      server.use(
        rest.get('/api/v1/leads', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ detail: 'Internal server error' })
          )
        })
      )
      
      render(<LeadManagement />, { user: mockUser })
      
      await waitFor(() => {
        expect(screen.getByText(/error loading leads/i)).toBeInTheDocument()
      })
    })

    it('handles network errors', async () => {
      server.use(
        rest.get('/api/v1/leads', (req, res, ctx) => {
          return res.networkError('Network error')
        })
      )
      
      render(<LeadManagement />, { user: mockUser })
      
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument()
      })
    })

    it('handles pagination', async () => {
      render(<LeadManagement />, { user: mockUser })
      
      await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument()
      })
      
      const nextPageButton = screen.getByRole('button', { name: /next page/i })
      fireEvent.click(nextPageButton)
      
      // Should make a new API call with page=2
      await waitFor(() => {
        expect(screen.getByText(/page 2/i)).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('handles token expiration', async () => {
      server.use(
        rest.get('/api/v1/leads', (req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({ detail: 'Token expired' })
          )
        })
      )
      
      vi.mocked(localStorage.getItem).mockReturnValue('expired-token')
      
      render(<LeadManagement />, { user: mockUser })
      
      await waitFor(() => {
        expect(screen.getByText(/session expired/i)).toBeInTheDocument()
      })
    })

    it('retries failed requests', async () => {
      let callCount = 0
      server.use(
        rest.get('/api/v1/leads', (req, res, ctx) => {
          callCount++
          if (callCount === 1) {
            return res(ctx.status(500))
          }
          return res(
            ctx.json({
              items: [mockLead],
              total: 1,
              page: 1,
              size: 10,
            })
          )
        })
      )
      
      vi.mocked(localStorage.getItem).mockReturnValue('mock-token')
      
      render(<LeadManagement />, { user: mockUser })
      
      await waitFor(() => {
        expect(screen.getByText(mockLead.first_name)).toBeInTheDocument()
      })
      
      expect(callCount).toBe(2)
    })
  })
})
