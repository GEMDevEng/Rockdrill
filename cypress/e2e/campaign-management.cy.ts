describe('Campaign Management', () => {
  beforeEach(() => {
    cy.cleanDatabase()
    cy.createTestUser({
      email: 'testuser@example.com',
      password: 'password123',
    })
    cy.login('testuser@example.com', 'password123')
  })

  describe('Campaign List View', () => {
    beforeEach(() => {
      // Create test campaigns
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/campaigns`,
        body: {
          name: 'Email Campaign 1',
          description: 'First email campaign',
          type: 'EMAIL',
          status: 'DRAFT'
        },
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
      })
      
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/campaigns`,
        body: {
          name: 'LinkedIn Campaign',
          description: 'LinkedIn outreach campaign',
          type: 'LINKEDIN',
          status: 'ACTIVE'
        },
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
      })
    })

    it('should display list of campaigns', () => {
      cy.visit('/campaigns')
      
      cy.checkTableRowCount(2)
      cy.contains('Email Campaign 1')
      cy.contains('LinkedIn Campaign')
      cy.contains('DRAFT')
      cy.contains('ACTIVE')
    })

    it('should filter campaigns by status', () => {
      cy.visit('/campaigns')
      
      cy.getByTestId('status-filter').select('DRAFT')
      cy.waitForLoading()
      
      cy.checkTableRowCount(1)
      cy.contains('Email Campaign 1')
      cy.should('not.contain', 'LinkedIn Campaign')
    })

    it('should filter campaigns by type', () => {
      cy.visit('/campaigns')
      
      cy.getByTestId('type-filter').select('EMAIL')
      cy.waitForLoading()
      
      cy.checkTableRowCount(1)
      cy.contains('Email Campaign 1')
      cy.should('not.contain', 'LinkedIn Campaign')
    })

    it('should search campaigns by name', () => {
      cy.visit('/campaigns')
      
      cy.searchTable('LinkedIn')
      cy.checkTableRowCount(1)
      cy.contains('LinkedIn Campaign')
      cy.should('not.contain', 'Email Campaign 1')
    })
  })

  describe('Campaign Creation', () => {
    it('should create a new email campaign', () => {
      cy.visit('/campaigns')
      
      cy.getByTestId('add-campaign-button').click()
      cy.get('[data-testid="modal"]').should('be.visible')
      
      cy.fillForm({
        name: 'New Email Campaign',
        description: 'A new email campaign for testing',
      })
      
      cy.getByTestId('type-select').select('EMAIL')
      cy.getByTestId('save-button').click()
      
      cy.checkToast('Campaign created successfully')
      cy.get('[data-testid="modal"]').should('not.exist')
      cy.contains('New Email Campaign')
    })

    it('should create a new LinkedIn campaign', () => {
      cy.visit('/campaigns')
      
      cy.getByTestId('add-campaign-button').click()
      
      cy.fillForm({
        name: 'New LinkedIn Campaign',
        description: 'A new LinkedIn campaign for testing',
      })
      
      cy.getByTestId('type-select').select('LINKEDIN')
      cy.getByTestId('save-button').click()
      
      cy.checkToast('Campaign created successfully')
      cy.contains('New LinkedIn Campaign')
    })

    it('should show validation errors for required fields', () => {
      cy.visit('/campaigns')
      
      cy.getByTestId('add-campaign-button').click()
      cy.getByTestId('save-button').click()
      
      cy.contains('Campaign name is required')
      cy.contains('Description is required')
      cy.contains('Campaign type is required')
    })

    it('should prevent duplicate campaign names', () => {
      cy.visit('/campaigns')
      
      cy.getByTestId('add-campaign-button').click()
      
      cy.fillForm({
        name: 'Email Campaign 1', // Already exists
        description: 'Duplicate campaign',
      })
      
      cy.getByTestId('type-select').select('EMAIL')
      cy.getByTestId('save-button').click()
      
      cy.checkToast('Campaign with this name already exists', 'error')
    })
  })

  describe('Campaign Editing', () => {
    it('should edit an existing campaign', () => {
      cy.visit('/campaigns')
      
      cy.get('[data-testid="edit-button"]').first().click()
      cy.get('[data-testid="modal"]').should('be.visible')
      
      cy.fillForm({
        name: 'Updated Campaign Name',
        description: 'Updated description',
      })
      
      cy.getByTestId('save-button').click()
      
      cy.checkToast('Campaign updated successfully')
      cy.contains('Updated Campaign Name')
    })

    it('should not allow editing active campaigns', () => {
      cy.visit('/campaigns')
      
      // Find the active campaign row and try to edit
      cy.contains('ACTIVE').parent().within(() => {
        cy.getByTestId('edit-button').should('be.disabled')
      })
    })
  })

  describe('Campaign Status Management', () => {
    it('should start a draft campaign', () => {
      cy.visit('/campaigns')
      
      cy.contains('DRAFT').parent().within(() => {
        cy.getByTestId('start-button').click()
      })
      
      cy.get('[data-testid="confirm-dialog"]').should('be.visible')
      cy.contains('Are you sure you want to start this campaign?')
      cy.confirmAction()
      
      cy.checkToast('Campaign started successfully')
      cy.contains('ACTIVE')
    })

    it('should pause an active campaign', () => {
      cy.visit('/campaigns')
      
      cy.contains('ACTIVE').parent().within(() => {
        cy.getByTestId('pause-button').click()
      })
      
      cy.get('[data-testid="confirm-dialog"]').should('be.visible')
      cy.confirmAction()
      
      cy.checkToast('Campaign paused successfully')
      cy.contains('PAUSED')
    })

    it('should resume a paused campaign', () => {
      // First pause the campaign
      cy.visit('/campaigns')
      cy.contains('ACTIVE').parent().within(() => {
        cy.getByTestId('pause-button').click()
      })
      cy.confirmAction()
      
      // Then resume it
      cy.contains('PAUSED').parent().within(() => {
        cy.getByTestId('resume-button').click()
      })
      cy.confirmAction()
      
      cy.checkToast('Campaign resumed successfully')
      cy.contains('ACTIVE')
    })

    it('should stop a campaign', () => {
      cy.visit('/campaigns')
      
      cy.contains('ACTIVE').parent().within(() => {
        cy.getByTestId('stop-button').click()
      })
      
      cy.get('[data-testid="confirm-dialog"]').should('be.visible')
      cy.contains('Are you sure you want to stop this campaign?')
      cy.confirmAction()
      
      cy.checkToast('Campaign stopped successfully')
      cy.contains('COMPLETED')
    })
  })

  describe('Campaign Lead Management', () => {
    beforeEach(() => {
      // Create test leads
      cy.createTestLead({ email: 'lead1@example.com', first_name: 'John', last_name: 'Doe' })
      cy.createTestLead({ email: 'lead2@example.com', first_name: 'Jane', last_name: 'Smith' })
      cy.createTestLead({ email: 'lead3@example.com', first_name: 'Bob', last_name: 'Johnson' })
    })

    it('should add leads to campaign', () => {
      cy.visit('/campaigns')
      
      cy.get('[data-testid="manage-leads-button"]').first().click()
      cy.get('[data-testid="add-leads-modal"]').should('be.visible')
      
      cy.selectTableRows([0, 1]) // Select first two leads
      cy.getByTestId('add-selected-button').click()
      
      cy.checkToast('2 leads added to campaign')
      cy.get('[data-testid="add-leads-modal"]').should('not.exist')
    })

    it('should remove leads from campaign', () => {
      // First add leads to campaign
      cy.visit('/campaigns')
      cy.get('[data-testid="manage-leads-button"]').first().click()
      cy.selectTableRows([0, 1])
      cy.getByTestId('add-selected-button').click()
      
      // Then remove them
      cy.get('[data-testid="view-campaign-leads"]').click()
      cy.selectTableRows([0])
      cy.getByTestId('remove-selected-button').click()
      cy.confirmAction()
      
      cy.checkToast('1 lead removed from campaign')
    })

    it('should view campaign leads', () => {
      cy.visit('/campaigns')
      
      cy.get('[data-testid="view-leads-button"]').first().click()
      cy.url().should('include', '/campaigns/')
      cy.url().should('include', '/leads')
      
      cy.contains('Campaign Leads')
      cy.getByTestId('back-to-campaigns').should('be.visible')
    })
  })

  describe('Campaign Analytics', () => {
    it('should view campaign analytics', () => {
      cy.visit('/campaigns')
      
      cy.get('[data-testid="analytics-button"]').first().click()
      cy.url().should('include', '/campaigns/')
      cy.url().should('include', '/analytics')
      
      cy.contains('Campaign Analytics')
      cy.getByTestId('sent-count').should('be.visible')
      cy.getByTestId('open-rate').should('be.visible')
      cy.getByTestId('click-rate').should('be.visible')
      cy.getByTestId('response-rate').should('be.visible')
    })

    it('should display campaign performance metrics', () => {
      cy.visit('/campaigns')
      
      cy.get('[data-testid="analytics-button"]').first().click()
      
      cy.getByTestId('performance-chart').should('be.visible')
      cy.getByTestId('engagement-metrics').should('be.visible')
      cy.getByTestId('conversion-funnel').should('be.visible')
    })

    it('should export campaign analytics', () => {
      cy.visit('/campaigns')
      
      cy.get('[data-testid="analytics-button"]').first().click()
      cy.getByTestId('export-analytics').click()
      
      cy.checkToast('Analytics exported successfully')
    })
  })

  describe('Campaign Deletion', () => {
    it('should delete a draft campaign', () => {
      cy.visit('/campaigns')
      
      cy.contains('DRAFT').parent().within(() => {
        cy.getByTestId('delete-button').click()
      })
      
      cy.get('[data-testid="confirm-dialog"]').should('be.visible')
      cy.contains('Are you sure you want to delete this campaign?')
      cy.confirmAction()
      
      cy.checkToast('Campaign deleted successfully')
      cy.should('not.contain', 'Email Campaign 1')
    })

    it('should not allow deleting active campaigns', () => {
      cy.visit('/campaigns')
      
      cy.contains('ACTIVE').parent().within(() => {
        cy.getByTestId('delete-button').should('be.disabled')
      })
    })

    it('should bulk delete multiple campaigns', () => {
      cy.visit('/campaigns')
      
      cy.selectTableRows([0]) // Select only draft campaign
      cy.getByTestId('bulk-delete-button').click()
      cy.confirmAction()
      
      cy.checkToast('1 campaign deleted successfully')
    })
  })

  describe('Campaign Templates', () => {
    it('should create campaign from template', () => {
      cy.visit('/campaigns')
      
      cy.getByTestId('create-from-template').click()
      cy.get('[data-testid="template-modal"]').should('be.visible')
      
      cy.getByTestId('email-template').click()
      cy.getByTestId('use-template').click()
      
      cy.fillForm({
        name: 'Campaign from Template',
        description: 'Created from email template',
      })
      
      cy.getByTestId('save-button').click()
      
      cy.checkToast('Campaign created from template')
      cy.contains('Campaign from Template')
    })
  })
})
