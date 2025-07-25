/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to select by data-testid
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

// Custom command to select by data-cy
Cypress.Commands.add('getByCy', (selector: string) => {
  return cy.get(`[data-cy="${selector}"]`)
})

// Custom command to fill form fields
Cypress.Commands.add('fillForm', (formData: Record<string, string>) => {
  Object.entries(formData).forEach(([field, value]) => {
    cy.getByTestId(`${field}-input`).clear().type(value)
  })
})

// Custom command to wait for loading to finish
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[data-testid="loading"]').should('not.exist')
  cy.get('[data-testid="spinner"]').should('not.exist')
})

// Custom command to check toast message
Cypress.Commands.add('checkToast', (message: string, type = 'success') => {
  cy.get(`[data-testid="toast-${type}"]`)
    .should('be.visible')
    .and('contain.text', message)
})

// Custom command to dismiss toast
Cypress.Commands.add('dismissToast', () => {
  cy.get('[data-testid="toast-close"]').click()
})

// Custom command to check table row count
Cypress.Commands.add('checkTableRowCount', (count: number) => {
  cy.get('[data-testid="table-row"]').should('have.length', count)
})

// Custom command to search in table
Cypress.Commands.add('searchTable', (searchTerm: string) => {
  cy.getByTestId('search-input').clear().type(searchTerm)
  cy.waitForLoading()
})

// Custom command to sort table
Cypress.Commands.add('sortTable', (column: string) => {
  cy.getByTestId(`sort-${column}`).click()
  cy.waitForLoading()
})

// Custom command to paginate table
Cypress.Commands.add('goToPage', (page: number) => {
  cy.getByTestId(`page-${page}`).click()
  cy.waitForLoading()
})

// Custom command to select table rows
Cypress.Commands.add('selectTableRows', (indices: number[]) => {
  indices.forEach(index => {
    cy.get(`[data-testid="row-checkbox-${index}"]`).check()
  })
})

// Custom command to open modal
Cypress.Commands.add('openModal', (modalTrigger: string) => {
  cy.getByTestId(modalTrigger).click()
  cy.get('[data-testid="modal"]').should('be.visible')
})

// Custom command to close modal
Cypress.Commands.add('closeModal', () => {
  cy.get('[data-testid="modal-close"]').click()
  cy.get('[data-testid="modal"]').should('not.exist')
})

// Custom command to confirm action
Cypress.Commands.add('confirmAction', () => {
  cy.get('[data-testid="confirm-button"]').click()
})

// Custom command to cancel action
Cypress.Commands.add('cancelAction', () => {
  cy.get('[data-testid="cancel-button"]').click()
})

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
      getByCy(selector: string): Chainable<JQuery<HTMLElement>>
      fillForm(formData: Record<string, string>): Chainable<void>
      waitForLoading(): Chainable<void>
      checkToast(message: string, type?: string): Chainable<void>
      dismissToast(): Chainable<void>
      checkTableRowCount(count: number): Chainable<void>
      searchTable(searchTerm: string): Chainable<void>
      sortTable(column: string): Chainable<void>
      goToPage(page: number): Chainable<void>
      selectTableRows(indices: number[]): Chainable<void>
      openModal(modalTrigger: string): Chainable<void>
      closeModal(): Chainable<void>
      confirmAction(): Chainable<void>
      cancelAction(): Chainable<void>
    }
  }
}
