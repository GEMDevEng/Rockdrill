describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.cleanDatabase()
  })

  describe('User Registration', () => {
    it('should allow new user to register', () => {
      cy.visit('/register')
      
      cy.fillForm({
        email: 'newuser@example.com',
        password: 'password123',
        'confirm-password': 'password123',
        'full-name': 'New User',
        company: 'New Company',
      })
      
      cy.getByTestId('register-button').click()
      
      cy.checkToast('Registration successful')
      cy.url().should('include', '/dashboard')
      cy.window().its('localStorage.token').should('exist')
    })

    it('should show validation errors for invalid data', () => {
      cy.visit('/register')
      
      cy.getByTestId('register-button').click()
      
      cy.contains('Email is required')
      cy.contains('Password is required')
      cy.contains('Full name is required')
    })

    it('should show error for mismatched passwords', () => {
      cy.visit('/register')
      
      cy.fillForm({
        email: 'test@example.com',
        password: 'password123',
        'confirm-password': 'different',
        'full-name': 'Test User',
      })
      
      cy.getByTestId('register-button').click()
      
      cy.contains('Passwords do not match')
    })

    it('should show error for existing email', () => {
      cy.createTestUser({ email: 'existing@example.com' })
      
      cy.visit('/register')
      
      cy.fillForm({
        email: 'existing@example.com',
        password: 'password123',
        'confirm-password': 'password123',
        'full-name': 'Test User',
      })
      
      cy.getByTestId('register-button').click()
      
      cy.checkToast('Email already registered', 'error')
    })
  })

  describe('User Login', () => {
    beforeEach(() => {
      cy.createTestUser({
        email: 'testuser@example.com',
        password: 'password123',
      })
    })

    it('should allow user to login with valid credentials', () => {
      cy.visit('/login')
      
      cy.fillForm({
        email: 'testuser@example.com',
        password: 'password123',
      })
      
      cy.getByTestId('login-button').click()
      
      cy.url().should('include', '/dashboard')
      cy.window().its('localStorage.token').should('exist')
      cy.contains('Welcome back')
    })

    it('should show error for invalid credentials', () => {
      cy.visit('/login')
      
      cy.fillForm({
        email: 'testuser@example.com',
        password: 'wrongpassword',
      })
      
      cy.getByTestId('login-button').click()
      
      cy.checkToast('Invalid credentials', 'error')
      cy.url().should('include', '/login')
    })

    it('should show validation errors for empty fields', () => {
      cy.visit('/login')
      
      cy.getByTestId('login-button').click()
      
      cy.contains('Email is required')
      cy.contains('Password is required')
    })

    it('should remember user when "Remember me" is checked', () => {
      cy.visit('/login')
      
      cy.fillForm({
        email: 'testuser@example.com',
        password: 'password123',
      })
      
      cy.getByTestId('remember-me').check()
      cy.getByTestId('login-button').click()
      
      cy.url().should('include', '/dashboard')
      
      // Clear session storage but keep localStorage
      cy.window().then((win) => {
        win.sessionStorage.clear()
      })
      
      cy.reload()
      cy.url().should('include', '/dashboard')
    })

    it('should toggle password visibility', () => {
      cy.visit('/login')
      
      cy.getByTestId('password-input').should('have.attr', 'type', 'password')
      cy.getByTestId('toggle-password').click()
      cy.getByTestId('password-input').should('have.attr', 'type', 'text')
      cy.getByTestId('toggle-password').click()
      cy.getByTestId('password-input').should('have.attr', 'type', 'password')
    })
  })

  describe('User Logout', () => {
    beforeEach(() => {
      cy.createTestUser({
        email: 'testuser@example.com',
        password: 'password123',
      })
      cy.login('testuser@example.com', 'password123')
    })

    it('should allow user to logout', () => {
      cy.visit('/dashboard')
      
      cy.getByTestId('user-menu').click()
      cy.getByTestId('logout-button').click()
      
      cy.url().should('include', '/login')
      cy.window().its('localStorage.token').should('not.exist')
    })

    it('should redirect to login when accessing protected route after logout', () => {
      cy.visit('/dashboard')
      
      cy.getByTestId('user-menu').click()
      cy.getByTestId('logout-button').click()
      
      cy.visit('/leads')
      cy.url().should('include', '/login')
    })
  })

  describe('Password Reset', () => {
    beforeEach(() => {
      cy.createTestUser({
        email: 'testuser@example.com',
        password: 'password123',
      })
    })

    it('should allow user to request password reset', () => {
      cy.visit('/login')
      
      cy.contains('Forgot password?').click()
      cy.url().should('include', '/forgot-password')
      
      cy.getByTestId('email-input').type('testuser@example.com')
      cy.getByTestId('reset-button').click()
      
      cy.checkToast('Password reset email sent')
    })

    it('should show error for non-existent email', () => {
      cy.visit('/forgot-password')
      
      cy.getByTestId('email-input').type('nonexistent@example.com')
      cy.getByTestId('reset-button').click()
      
      cy.checkToast('Email not found', 'error')
    })
  })

  describe('Session Management', () => {
    beforeEach(() => {
      cy.createTestUser({
        email: 'testuser@example.com',
        password: 'password123',
      })
    })

    it('should redirect to login when token expires', () => {
      cy.login('testuser@example.com', 'password123')
      cy.visit('/dashboard')
      
      // Simulate expired token
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'expired-token')
      })
      
      cy.visit('/leads')
      cy.url().should('include', '/login')
      cy.checkToast('Session expired', 'warning')
    })

    it('should maintain session across page refreshes', () => {
      cy.login('testuser@example.com', 'password123')
      cy.visit('/dashboard')
      
      cy.reload()
      cy.url().should('include', '/dashboard')
      cy.contains('Welcome back')
    })
  })

  describe('Navigation Guards', () => {
    it('should redirect unauthenticated users to login', () => {
      const protectedRoutes = ['/dashboard', '/leads', '/campaigns', '/templates']
      
      protectedRoutes.forEach(route => {
        cy.visit(route)
        cy.url().should('include', '/login')
      })
    })

    it('should redirect authenticated users away from auth pages', () => {
      cy.createTestUser({
        email: 'testuser@example.com',
        password: 'password123',
      })
      cy.login('testuser@example.com', 'password123')
      
      const authRoutes = ['/login', '/register', '/forgot-password']
      
      authRoutes.forEach(route => {
        cy.visit(route)
        cy.url().should('include', '/dashboard')
      })
    })
  })
})
