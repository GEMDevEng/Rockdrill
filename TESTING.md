# Testing Guide for Rockdrill

This document provides comprehensive information about the testing strategy, setup, and execution for the Rockdrill application.

## Table of Contents

1. [Testing Strategy](#testing-strategy)
2. [Test Types](#test-types)
3. [Backend Testing](#backend-testing)
4. [Frontend Testing](#frontend-testing)
5. [Integration Testing](#integration-testing)
6. [End-to-End Testing](#end-to-end-testing)
7. [Running Tests](#running-tests)
8. [Test Coverage](#test-coverage)
9. [CI/CD Integration](#cicd-integration)
10. [Best Practices](#best-practices)

## Testing Strategy

Our testing strategy follows the testing pyramid approach:

- **Unit Tests (70%)**: Fast, isolated tests for individual components and functions
- **Integration Tests (20%)**: Tests for API endpoints and component interactions
- **End-to-End Tests (10%)**: Full user workflow tests using Cypress

### Coverage Goals

- **Minimum Coverage**: 80% for all components
- **Critical Paths**: 95% coverage for authentication, lead management, and campaign workflows
- **New Features**: 90% coverage required before merge

## Test Types

### 1. Unit Tests
- **Backend**: Model validation, service logic, utility functions
- **Frontend**: Component rendering, user interactions, state management

### 2. Integration Tests
- **API Integration**: Full request/response cycles with database
- **Component Integration**: Frontend components with API services

### 3. End-to-End Tests
- **User Workflows**: Complete user journeys from login to task completion
- **Cross-browser**: Chrome, Firefox, Safari compatibility

## Backend Testing

### Setup

```bash
cd backend
pip install -r requirements.txt
```

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_models.py

# Run tests with verbose output
pytest -v

# Run tests in parallel
pytest -n auto
```

### Test Structure

```
backend/tests/
├── conftest.py              # Test configuration and fixtures
├── test_models.py           # Model unit tests
├── test_api_auth.py         # Authentication API tests
├── test_api_leads.py        # Lead management API tests
├── test_api_campaigns.py    # Campaign management API tests
├── test_services.py         # Service layer tests
└── test_integration_api.py  # Integration tests
```

### Key Test Files

#### conftest.py
- Database fixtures for isolated testing
- Test client setup with dependency overrides
- Sample data fixtures

#### test_models.py
- Model validation and constraints
- Relationship testing
- Database operations

#### test_api_*.py
- HTTP status code validation
- Request/response data validation
- Authentication and authorization
- Error handling

#### test_services.py
- Business logic testing
- Service layer isolation with mocking
- Complex workflow testing

## Frontend Testing

### Setup

```bash
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
tests/
├── setup.ts                 # Test setup and configuration
├── utils/
│   └── test-utils.tsx       # Custom render functions and utilities
├── components/
│   ├── ui/
│   │   ├── Button.test.tsx
│   │   ├── Input.test.tsx
│   │   └── LeadTable.test.tsx
│   └── auth/
│       └── LoginForm.test.tsx
└── integration/
    └── api-integration.test.tsx
```

### Testing Tools

- **Vitest**: Fast unit test runner
- **React Testing Library**: Component testing utilities
- **MSW**: API mocking for integration tests
- **Jest DOM**: Additional DOM matchers

### Key Test Patterns

#### Component Testing
```typescript
import { render, screen, fireEvent } from '../utils/test-utils'
import { Button } from '../../src/components/ui/Button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toHaveTextContent('Click me')
})
```

#### User Interaction Testing
```typescript
test('handles click events', () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Click me</Button>)
  
  fireEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

## Integration Testing

Integration tests verify the interaction between frontend and backend components.

### API Integration Tests

Located in `tests/integration/api-integration.test.tsx`, these tests:

- Mock API responses using MSW
- Test complete request/response cycles
- Verify error handling and loading states
- Test authentication flows

### Database Integration Tests

Located in `backend/tests/test_integration_api.py`, these tests:

- Use real database connections
- Test complete CRUD operations
- Verify data relationships and constraints
- Test transaction handling

## End-to-End Testing

### Setup

E2E tests use Cypress to test complete user workflows.

```bash
# Install Cypress (already included in package.json)
npm install

# Open Cypress Test Runner
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run
```

### Test Structure

```
cypress/
├── e2e/
│   ├── auth.cy.ts           # Authentication workflows
│   ├── lead-management.cy.ts # Lead CRUD operations
│   └── campaign-management.cy.ts # Campaign workflows
├── support/
│   ├── commands.ts          # Custom Cypress commands
│   └── e2e.ts              # Global configuration
└── fixtures/
    └── leads.csv           # Test data files
```

### Key E2E Test Scenarios

1. **Authentication Flow**
   - User registration
   - Login/logout
   - Password reset
   - Session management

2. **Lead Management**
   - Create, read, update, delete leads
   - Search and filtering
   - Bulk operations
   - Import/export

3. **Campaign Management**
   - Campaign creation and editing
   - Status transitions
   - Lead assignment
   - Analytics viewing

### Custom Cypress Commands

```typescript
// Login command
cy.login('user@example.com', 'password123')

// Create test data
cy.createTestUser({ email: 'test@example.com' })
cy.createTestLead({ email: 'lead@example.com' })

// UI interactions
cy.fillForm({ email: 'test@example.com', password: 'password' })
cy.checkToast('Success message')
cy.waitForLoading()
```

## Running Tests

### Development Workflow

1. **Before committing**: Run unit tests
   ```bash
   npm test
   cd backend && pytest
   ```

2. **Before pushing**: Run integration tests
   ```bash
   npm run test:coverage
   cd backend && pytest --cov=app
   ```

3. **Before deployment**: Run E2E tests
   ```bash
   npm run cypress:run
   ```

### Test Scripts

#### Frontend
```bash
npm test              # Run unit tests
npm run test:watch    # Watch mode
npm run test:ui       # Interactive UI
npm run test:coverage # With coverage report
```

#### Backend
```bash
pytest                    # Run all tests
pytest --cov=app         # With coverage
pytest -v                # Verbose output
pytest -n auto           # Parallel execution
```

#### E2E
```bash
npm run cypress:open     # Interactive mode
npm run cypress:run      # Headless mode
npm run test:e2e         # Alias for cypress:run
```

## Test Coverage

### Coverage Reports

- **Frontend**: Generated in `coverage/` directory
- **Backend**: Generated in `htmlcov/` directory
- **Combined**: Available in CI/CD pipeline

### Coverage Thresholds

```javascript
// vitest.config.ts
coverage: {
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

```ini
# backend/pytest.ini
[tool:pytest]
addopts = --cov=app --cov-fail-under=80
```

### Viewing Coverage

```bash
# Frontend
npm run test:coverage
open coverage/index.html

# Backend
pytest --cov=app --cov-report=html
open htmlcov/index.html
```

## CI/CD Integration

### GitHub Actions Workflow

Tests are automatically run on:
- Pull requests
- Pushes to main branch
- Scheduled nightly runs

### Pipeline Stages

1. **Lint and Format Check**
2. **Unit Tests** (Frontend & Backend)
3. **Integration Tests**
4. **E2E Tests** (on staging environment)
5. **Coverage Report**
6. **Deployment** (if all tests pass)

### Environment Setup

```yaml
# .github/workflows/test.yml
- name: Run Backend Tests
  run: |
    cd backend
    pip install -r requirements.txt
    pytest --cov=app --cov-report=xml

- name: Run Frontend Tests
  run: |
    npm ci
    npm run test:coverage

- name: Run E2E Tests
  run: |
    npm run cypress:run
```

## Best Practices

### Writing Tests

1. **Follow AAA Pattern**: Arrange, Act, Assert
2. **Use Descriptive Names**: Test names should explain what is being tested
3. **Test Behavior, Not Implementation**: Focus on what the code does, not how
4. **Keep Tests Independent**: Each test should be able to run in isolation
5. **Use Factories for Test Data**: Create reusable test data generators

### Test Organization

1. **Group Related Tests**: Use describe blocks to organize tests
2. **Use Setup and Teardown**: Properly clean up after tests
3. **Mock External Dependencies**: Isolate units under test
4. **Test Edge Cases**: Include boundary conditions and error scenarios

### Performance

1. **Parallel Execution**: Run tests in parallel when possible
2. **Selective Testing**: Run only affected tests during development
3. **Optimize Fixtures**: Reuse expensive setup operations
4. **Monitor Test Duration**: Keep test suites fast

### Maintenance

1. **Regular Review**: Periodically review and update tests
2. **Remove Obsolete Tests**: Clean up tests for removed features
3. **Update Test Data**: Keep test fixtures current
4. **Document Complex Tests**: Add comments for complex test logic

## Troubleshooting

### Common Issues

1. **Flaky Tests**: Use proper waits and assertions
2. **Slow Tests**: Profile and optimize test execution
3. **Test Isolation**: Ensure tests don't depend on each other
4. **Environment Issues**: Use consistent test environments

### Debugging

```bash
# Debug specific test
pytest tests/test_models.py::TestUser::test_user_creation -v -s

# Debug with breakpoint
pytest --pdb tests/test_models.py

# Debug Cypress test
npx cypress open --config video=true
```

For more specific testing questions or issues, please refer to the individual test files or contact the development team.
