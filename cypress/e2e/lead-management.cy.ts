describe('Lead Management', () => {
  beforeEach(() => {
    cy.cleanDatabase()
    cy.createTestUser({
      email: 'testuser@example.com',
      password: 'password123',
    })
    cy.login('testuser@example.com', 'password123')
  })

  describe('Lead List View', () => {
    beforeEach(() => {
      // Create test leads
      cy.createTestLead({ email: 'lead1@example.com', first_name: 'John', last_name: 'Doe', company: 'Acme Corp' })
      cy.createTestLead({ email: 'lead2@example.com', first_name: 'Jane', last_name: 'Smith', company: 'Beta Inc' })
      cy.createTestLead({ email: 'lead3@example.com', first_name: 'Bob', last_name: 'Johnson', company: 'Gamma LLC' })
    })

    it('should display list of leads', () => {
      cy.visit('/leads')
      
      cy.checkTableRowCount(3)
      cy.contains('John Doe')
      cy.contains('Jane Smith')
      cy.contains('Bob Johnson')
      cy.contains('lead1@example.com')
      cy.contains('Acme Corp')
    })

    it('should search leads by name', () => {
      cy.visit('/leads')
      
      cy.searchTable('John')
      cy.checkTableRowCount(1)
      cy.contains('John Doe')
      cy.should('not.contain', 'Jane Smith')
    })

    it('should search leads by email', () => {
      cy.visit('/leads')
      
      cy.searchTable('lead2@example.com')
      cy.checkTableRowCount(1)
      cy.contains('Jane Smith')
      cy.should('not.contain', 'John Doe')
    })

    it('should search leads by company', () => {
      cy.visit('/leads')
      
      cy.searchTable('Acme')
      cy.checkTableRowCount(1)
      cy.contains('John Doe')
      cy.contains('Acme Corp')
    })

    it('should sort leads by name', () => {
      cy.visit('/leads')
      
      cy.sortTable('name')
      
      // Check that leads are sorted alphabetically
      cy.get('[data-testid="table-row"]').first().should('contain', 'Bob Johnson')
      cy.get('[data-testid="table-row"]').last().should('contain', 'John Doe')
    })

    it('should sort leads by email', () => {
      cy.visit('/leads')
      
      cy.sortTable('email')
      
      cy.get('[data-testid="table-row"]').first().should('contain', 'lead1@example.com')
    })

    it('should paginate leads', () => {
      // Create more leads to test pagination
      for (let i = 4; i <= 15; i++) {
        cy.createTestLead({ 
          email: `lead${i}@example.com`, 
          first_name: `Lead${i}`, 
          last_name: 'Test' 
        })
      }
      
      cy.visit('/leads')
      
      cy.checkTableRowCount(10) // Default page size
      cy.contains('Showing 1-10 of 15')
      
      cy.goToPage(2)
      cy.checkTableRowCount(5)
      cy.contains('Showing 11-15 of 15')
    })

    it('should select multiple leads', () => {
      cy.visit('/leads')
      
      cy.selectTableRows([0, 1])
      cy.contains('2 leads selected')
      cy.getByTestId('bulk-actions').should('be.visible')
    })

    it('should select all leads', () => {
      cy.visit('/leads')
      
      cy.getByTestId('select-all').check()
      cy.contains('3 leads selected')
      cy.getByTestId('bulk-actions').should('be.visible')
    })
  })

  describe('Lead Creation', () => {
    it('should create a new lead', () => {
      cy.visit('/leads')
      
      cy.getByTestId('add-lead-button').click()
      cy.get('[data-testid="modal"]').should('be.visible')
      
      cy.fillForm({
        email: 'newlead@example.com',
        'first-name': 'New',
        'last-name': 'Lead',
        company: 'New Company',
        title: 'CEO',
        phone: '+1234567890',
        'linkedin-url': 'https://linkedin.com/in/newlead',
        website: 'https://newcompany.com',
      })
      
      cy.getByTestId('save-button').click()
      
      cy.checkToast('Lead created successfully')
      cy.get('[data-testid="modal"]').should('not.exist')
      cy.contains('New Lead')
      cy.contains('newlead@example.com')
    })

    it('should show validation errors for required fields', () => {
      cy.visit('/leads')
      
      cy.getByTestId('add-lead-button').click()
      cy.getByTestId('save-button').click()
      
      cy.contains('Email is required')
      cy.contains('First name is required')
      cy.contains('Last name is required')
    })

    it('should validate email format', () => {
      cy.visit('/leads')
      
      cy.getByTestId('add-lead-button').click()
      
      cy.fillForm({
        email: 'invalid-email',
        'first-name': 'Test',
        'last-name': 'Lead',
      })
      
      cy.getByTestId('save-button').click()
      
      cy.contains('Please enter a valid email')
    })

    it('should prevent duplicate email addresses', () => {
      cy.visit('/leads')
      
      cy.getByTestId('add-lead-button').click()
      
      cy.fillForm({
        email: 'lead1@example.com', // Already exists
        'first-name': 'Duplicate',
        'last-name': 'Lead',
      })
      
      cy.getByTestId('save-button').click()
      
      cy.checkToast('Lead with this email already exists', 'error')
    })

    it('should cancel lead creation', () => {
      cy.visit('/leads')
      
      cy.getByTestId('add-lead-button').click()
      
      cy.fillForm({
        email: 'test@example.com',
        'first-name': 'Test',
        'last-name': 'Lead',
      })
      
      cy.getByTestId('cancel-button').click()
      
      cy.get('[data-testid="modal"]').should('not.exist')
      cy.should('not.contain', 'test@example.com')
    })
  })

  describe('Lead Editing', () => {
    beforeEach(() => {
      cy.createTestLead({ 
        email: 'editable@example.com', 
        first_name: 'Editable', 
        last_name: 'Lead',
        company: 'Original Company'
      })
    })

    it('should edit an existing lead', () => {
      cy.visit('/leads')
      
      cy.get('[data-testid="edit-button"]').first().click()
      cy.get('[data-testid="modal"]').should('be.visible')
      
      cy.getByTestId('first-name-input').should('have.value', 'Editable')
      
      cy.fillForm({
        'first-name': 'Updated',
        'last-name': 'Name',
        company: 'Updated Company',
      })
      
      cy.getByTestId('save-button').click()
      
      cy.checkToast('Lead updated successfully')
      cy.contains('Updated Name')
      cy.contains('Updated Company')
    })

    it('should preserve unchanged fields when editing', () => {
      cy.visit('/leads')
      
      cy.get('[data-testid="edit-button"]').first().click()
      
      cy.fillForm({
        'first-name': 'Updated',
      })
      
      cy.getByTestId('save-button').click()
      
      cy.checkToast('Lead updated successfully')
      cy.contains('Updated Lead') // First name changed, last name preserved
      cy.contains('editable@example.com') // Email preserved
    })

    it('should cancel lead editing', () => {
      cy.visit('/leads')
      
      cy.get('[data-testid="edit-button"]').first().click()
      
      cy.fillForm({
        'first-name': 'Changed',
      })
      
      cy.getByTestId('cancel-button').click()
      
      cy.get('[data-testid="modal"]').should('not.exist')
      cy.contains('Editable Lead') // Original name preserved
    })
  })

  describe('Lead Deletion', () => {
    beforeEach(() => {
      cy.createTestLead({ 
        email: 'deletable@example.com', 
        first_name: 'Deletable', 
        last_name: 'Lead' 
      })
    })

    it('should delete a single lead', () => {
      cy.visit('/leads')
      
      cy.get('[data-testid="delete-button"]').first().click()
      cy.get('[data-testid="confirm-dialog"]').should('be.visible')
      cy.contains('Are you sure you want to delete this lead?')
      
      cy.confirmAction()
      
      cy.checkToast('Lead deleted successfully')
      cy.should('not.contain', 'Deletable Lead')
    })

    it('should cancel lead deletion', () => {
      cy.visit('/leads')
      
      cy.get('[data-testid="delete-button"]').first().click()
      cy.cancelAction()
      
      cy.get('[data-testid="confirm-dialog"]').should('not.exist')
      cy.contains('Deletable Lead') // Lead still exists
    })

    it('should bulk delete multiple leads', () => {
      cy.visit('/leads')
      
      cy.selectTableRows([0, 1])
      cy.getByTestId('bulk-delete-button').click()
      cy.get('[data-testid="confirm-dialog"]').should('be.visible')
      cy.contains('Are you sure you want to delete 2 leads?')
      
      cy.confirmAction()
      
      cy.checkToast('2 leads deleted successfully')
      cy.checkTableRowCount(2) // Only 2 leads remaining
    })
  })

  describe('Lead Details View', () => {
    beforeEach(() => {
      cy.createTestLead({ 
        email: 'detailed@example.com', 
        first_name: 'Detailed', 
        last_name: 'Lead',
        company: 'Detail Company',
        title: 'Manager',
        phone: '+1234567890',
        linkedin_url: 'https://linkedin.com/in/detailed',
        website: 'https://detailcompany.com'
      })
    })

    it('should view lead details', () => {
      cy.visit('/leads')
      
      cy.get('[data-testid="view-button"]').first().click()
      cy.get('[data-testid="lead-details"]').should('be.visible')
      
      cy.contains('Detailed Lead')
      cy.contains('detailed@example.com')
      cy.contains('Detail Company')
      cy.contains('Manager')
      cy.contains('+1234567890')
      cy.contains('https://linkedin.com/in/detailed')
      cy.contains('https://detailcompany.com')
    })

    it('should navigate back to leads list from details', () => {
      cy.visit('/leads')
      
      cy.get('[data-testid="view-button"]').first().click()
      cy.getByTestId('back-button').click()
      
      cy.url().should('include', '/leads')
      cy.get('[data-testid="lead-details"]').should('not.exist')
    })
  })

  describe('Lead Import/Export', () => {
    it('should export leads to CSV', () => {
      cy.visit('/leads')
      
      cy.getByTestId('export-button').click()
      cy.getByTestId('export-csv').click()
      
      cy.checkToast('Leads exported successfully')
      
      // Verify download (this would need additional setup for file downloads)
      cy.readFile('cypress/downloads/leads.csv').should('exist')
    })

    it('should import leads from CSV', () => {
      cy.visit('/leads')
      
      cy.getByTestId('import-button').click()
      cy.get('[data-testid="file-input"]').selectFile('cypress/fixtures/leads.csv')
      cy.getByTestId('import-confirm').click()
      
      cy.checkToast('Leads imported successfully')
      cy.contains('3 leads imported')
    })
  })
})
