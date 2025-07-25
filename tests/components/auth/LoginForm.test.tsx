import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils'
import { LoginForm } from '../../../src/components/auth/LoginForm'
import { mockApiService, createMockResponse, createMockError } from '../../utils/test-utils'

// Mock the API service
vi.mock('../../../src/services/api', () => ({
  default: mockApiService,
}))

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form with all fields', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockLoginResponse = createMockResponse({
      access_token: 'mock-token',
      token_type: 'bearer',
      user: {
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
      },
    })
    
    mockApiService.auth.login.mockResolvedValue(mockLoginResponse)
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockApiService.auth.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('shows loading state during submission', async () => {
    mockApiService.auth.login.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('displays error message on login failure', async () => {
    const mockError = createMockError('Invalid credentials', 401)
    mockApiService.auth.login.mockRejectedValue(mockError)
    
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

  it('toggles password visibility', () => {
    render(<LoginForm />)
    
    const passwordInput = screen.getByLabelText(/password/i)
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i })
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('remembers user preference with remember me checkbox', () => {
    render(<LoginForm />)
    
    const rememberCheckbox = screen.getByLabelText(/remember me/i)
    expect(rememberCheckbox).not.toBeChecked()
    
    fireEvent.click(rememberCheckbox)
    expect(rememberCheckbox).toBeChecked()
  })

  it('navigates to forgot password page', () => {
    render(<LoginForm />)
    
    const forgotPasswordLink = screen.getByText(/forgot password/i)
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
  })

  it('navigates to register page', () => {
    render(<LoginForm />)
    
    const registerLink = screen.getByText(/sign up/i)
    expect(registerLink).toHaveAttribute('href', '/register')
  })

  it('handles keyboard submission', async () => {
    const mockLoginResponse = createMockResponse({
      access_token: 'mock-token',
      token_type: 'bearer',
    })
    
    mockApiService.auth.login.mockResolvedValue(mockLoginResponse)
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.keyDown(passwordInput, { key: 'Enter' })
    
    await waitFor(() => {
      expect(mockApiService.auth.login).toHaveBeenCalled()
    })
  })

  it('clears error message when user starts typing', async () => {
    const mockError = createMockError('Invalid credentials', 401)
    mockApiService.auth.login.mockRejectedValue(mockError)
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    // Trigger error
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
    
    // Start typing to clear error
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } })
    
    await waitFor(() => {
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument()
    })
  })

  it('disables form during submission', async () => {
    mockApiService.auth.login.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    expect(emailInput).toBeDisabled()
    expect(passwordInput).toBeDisabled()
    expect(submitButton).toBeDisabled()
  })
})
