import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../src/contexts/AuthContext'

// Mock API service
export const mockApiService = {
  auth: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    refreshToken: vi.fn(),
  },
  leads: {
    getLeads: vi.fn(),
    createLead: vi.fn(),
    updateLead: vi.fn(),
    deleteLead: vi.fn(),
    getLead: vi.fn(),
  },
  campaigns: {
    getCampaigns: vi.fn(),
    createCampaign: vi.fn(),
    updateCampaign: vi.fn(),
    deleteCampaign: vi.fn(),
    getCampaign: vi.fn(),
  },
  templates: {
    getTemplates: vi.fn(),
    createTemplate: vi.fn(),
    updateTemplate: vi.fn(),
    deleteTemplate: vi.fn(),
    getTemplate: vi.fn(),
  },
}

// Mock user data
export const mockUser = {
  id: 1,
  email: 'test@example.com',
  full_name: 'Test User',
  company: 'Test Company',
  role: 'USER',
  subscription: 'FREE',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
}

// Mock lead data
export const mockLead = {
  id: 1,
  email: 'lead@example.com',
  first_name: 'John',
  last_name: 'Doe',
  company: 'Example Corp',
  title: 'CEO',
  phone: '+1234567890',
  linkedin_url: 'https://linkedin.com/in/johndoe',
  website: 'https://example.com',
  status: 'NEW',
  source: 'MANUAL',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

// Mock campaign data
export const mockCampaign = {
  id: 1,
  name: 'Test Campaign',
  description: 'A test campaign',
  type: 'EMAIL',
  status: 'DRAFT',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

// Mock template data
export const mockTemplate = {
  id: 1,
  name: 'Test Template',
  subject: 'Test Subject',
  content: 'Hello {{first_name}}, this is a test.',
  category: 'OUTREACH',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  user?: typeof mockUser | null
}

const AllTheProviders = ({ 
  children, 
  initialEntries = ['/'], 
  user = null 
}: { 
  children: React.ReactNode
  initialEntries?: string[]
  user?: typeof mockUser | null
}) => {
  return (
    <BrowserRouter>
      <AuthProvider initialUser={user}>
        {children}
      </AuthProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialEntries, user, ...renderOptions } = options
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders initialEntries={initialEntries} user={user}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Helper functions for common test scenarios
export const createMockResponse = <T>(data: T, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
})

export const createMockError = (message: string, status = 400) => ({
  response: {
    data: { detail: message },
    status,
    statusText: 'Bad Request',
  },
  message,
})

// Wait for async operations
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0))

// Mock localStorage
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Setup localStorage mock
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  })
})

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks()
})
