// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
Cypress.on('window:before:load', (win) => {
  const originalFetch = win.fetch
  win.fetch = function (...args) {
    return originalFetch.apply(this, args)
  }
})

// Custom command to seed database
Cypress.Commands.add('seedDatabase', () => {
  cy.request('POST', `${Cypress.env('apiUrl')}/test/seed`)
})

// Custom command to clean database
Cypress.Commands.add('cleanDatabase', () => {
  cy.request('POST', `${Cypress.env('apiUrl')}/test/clean`)
})

// Custom command to login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type(email)
    cy.get('[data-testid="password-input"]').type(password)
    cy.get('[data-testid="login-button"]').click()
    cy.url().should('not.include', '/login')
    cy.window().its('localStorage.token').should('exist')
  })
})

// Custom command to create test user
Cypress.Commands.add('createTestUser', (userData = {}) => {
  const defaultUser = {
    email: 'test@example.com',
    password: 'password123',
    full_name: 'Test User',
    company: 'Test Company',
  }
  
  const user = { ...defaultUser, ...userData }
  
  return cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, user)
    .then((response) => {
      expect(response.status).to.eq(201)
      return response.body
    })
})

// Custom command to create test lead
Cypress.Commands.add('createTestLead', (leadData = {}) => {
  const defaultLead = {
    email: 'lead@example.com',
    first_name: 'John',
    last_name: 'Doe',
    company: 'Example Corp',
    title: 'CEO',
  }
  
  const lead = { ...defaultLead, ...leadData }
  
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/leads`,
    body: lead,
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
    },
  }).then((response) => {
    expect(response.status).to.eq(201)
    return response.body
  })
})

// Custom command to wait for API response
Cypress.Commands.add('waitForApi', (alias: string, timeout = 10000) => {
  cy.wait(alias, { timeout })
})

// Custom command to check accessibility
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe()
  cy.checkA11y()
})

declare global {
  namespace Cypress {
    interface Chainable {
      seedDatabase(): Chainable<void>
      cleanDatabase(): Chainable<void>
      login(email: string, password: string): Chainable<void>
      createTestUser(userData?: Record<string, any>): Chainable<any>
      createTestLead(leadData?: Record<string, any>): Chainable<any>
      waitForApi(alias: string, timeout?: number): Chainable<void>
      checkA11y(): Chainable<void>
    }
  }
}
