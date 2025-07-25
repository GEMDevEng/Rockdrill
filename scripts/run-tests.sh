#!/bin/bash

# Rockdrill Test Runner Script
# This script provides a unified interface for running all types of tests

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
TEST_TYPE="all"
ENVIRONMENT="development"
COVERAGE=false
PARALLEL=false
VERBOSE=false
WATCH=false

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

OPTIONS:
    -t, --type TYPE         Test type: unit, integration, e2e, all (default: all)
    -e, --env ENV          Environment: development, ci, staging (default: development)
    -c, --coverage         Generate coverage reports
    -p, --parallel         Run tests in parallel
    -v, --verbose          Verbose output
    -w, --watch            Watch mode (for unit tests)
    -h, --help             Show this help message

EXAMPLES:
    $0                                    # Run all tests
    $0 -t unit -c                        # Run unit tests with coverage
    $0 -t e2e -e ci                      # Run E2E tests in CI environment
    $0 -t unit -w                        # Run unit tests in watch mode
    $0 -t integration -p -v              # Run integration tests in parallel with verbose output

TEST TYPES:
    unit         - Frontend and backend unit tests
    integration  - API and component integration tests
    e2e          - End-to-end tests with Cypress
    smoke        - Quick smoke tests
    all          - All test types (default)
EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--type)
            TEST_TYPE="$2"
            shift 2
            ;;
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -c|--coverage)
            COVERAGE=true
            shift
            ;;
        -p|--parallel)
            PARALLEL=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -w|--watch)
            WATCH=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate test type
case $TEST_TYPE in
    unit|integration|e2e|smoke|all)
        ;;
    *)
        print_error "Invalid test type: $TEST_TYPE"
        show_usage
        exit 1
        ;;
esac

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command_exists node; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check Python
    if ! command_exists python3; then
        print_error "Python 3 is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command_exists npm; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check pip
    if ! command_exists pip; then
        print_error "pip is not installed"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to setup environment
setup_environment() {
    print_status "Setting up $ENVIRONMENT environment..."
    
    case $ENVIRONMENT in
        development)
            export NODE_ENV=test
            export DATABASE_URL="sqlite:///./test.db"
            export SECRET_KEY="dev-secret-key"
            ;;
        ci)
            export NODE_ENV=test
            export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rockdrill_test"
            export SECRET_KEY="ci-secret-key"
            ;;
        staging)
            export NODE_ENV=staging
            # These should be set in CI/CD environment
            if [[ -z "$DATABASE_URL" || -z "$SECRET_KEY" ]]; then
                print_error "DATABASE_URL and SECRET_KEY must be set for staging environment"
                exit 1
            fi
            ;;
    esac
    
    print_success "Environment setup complete"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Frontend dependencies
    if [[ ! -d "node_modules" ]]; then
        print_status "Installing frontend dependencies..."
        npm ci
    fi
    
    # Backend dependencies
    if [[ ! -d "backend/venv" ]]; then
        print_status "Installing backend dependencies..."
        cd backend
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        cd ..
    fi
    
    print_success "Dependencies installed"
}

# Function to run unit tests
run_unit_tests() {
    print_status "Running unit tests..."
    
    local exit_code=0
    
    # Frontend unit tests
    print_status "Running frontend unit tests..."
    local frontend_cmd="npm test"
    
    if [[ "$COVERAGE" == true ]]; then
        frontend_cmd="npm run test:coverage"
    fi
    
    if [[ "$WATCH" == true ]]; then
        frontend_cmd="npm run test:watch"
    fi
    
    if [[ "$VERBOSE" == true ]]; then
        frontend_cmd="$frontend_cmd -- --reporter=verbose"
    fi
    
    if ! eval $frontend_cmd; then
        print_error "Frontend unit tests failed"
        exit_code=1
    fi
    
    # Backend unit tests
    print_status "Running backend unit tests..."
    cd backend
    source venv/bin/activate
    
    local backend_cmd="pytest"
    
    if [[ "$COVERAGE" == true ]]; then
        backend_cmd="pytest --cov=app --cov-report=html --cov-report=xml"
    fi
    
    if [[ "$PARALLEL" == true ]]; then
        backend_cmd="$backend_cmd -n auto"
    fi
    
    if [[ "$VERBOSE" == true ]]; then
        backend_cmd="$backend_cmd -v"
    fi
    
    if ! eval $backend_cmd; then
        print_error "Backend unit tests failed"
        exit_code=1
    fi
    
    cd ..
    
    return $exit_code
}

# Function to run integration tests
run_integration_tests() {
    print_status "Running integration tests..."
    
    local exit_code=0
    
    # Start backend server for integration tests
    print_status "Starting backend server..."
    cd backend
    source venv/bin/activate
    uvicorn app.main:app --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ..
    
    # Wait for server to start
    sleep 10
    
    # Run integration tests
    if ! npm run test -- tests/integration/; then
        print_error "Integration tests failed"
        exit_code=1
    fi
    
    # Stop backend server
    kill $BACKEND_PID 2>/dev/null || true
    
    return $exit_code
}

# Function to run E2E tests
run_e2e_tests() {
    print_status "Running E2E tests..."
    
    local exit_code=0
    
    # Start backend server
    print_status "Starting backend server..."
    cd backend
    source venv/bin/activate
    uvicorn app.main:app --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ..
    
    # Build and start frontend
    print_status "Building and starting frontend..."
    npm run build
    npm run preview &
    FRONTEND_PID=$!
    
    # Wait for servers to start
    sleep 15
    
    # Run Cypress tests
    local cypress_cmd="npm run cypress:run"
    
    if [[ "$VERBOSE" == true ]]; then
        cypress_cmd="npm run cypress:open"
    fi
    
    if ! eval $cypress_cmd; then
        print_error "E2E tests failed"
        exit_code=1
    fi
    
    # Stop servers
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    
    return $exit_code
}

# Function to run smoke tests
run_smoke_tests() {
    print_status "Running smoke tests..."
    
    # Run a subset of critical tests
    local exit_code=0
    
    # Quick unit tests
    if ! npm test -- --testNamePattern="should render|should login|should create"; then
        print_error "Smoke tests failed"
        exit_code=1
    fi
    
    return $exit_code
}

# Function to generate test report
generate_report() {
    print_status "Generating test report..."
    
    local report_dir="test-results/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$report_dir"
    
    # Copy coverage reports
    if [[ "$COVERAGE" == true ]]; then
        if [[ -d "coverage" ]]; then
            cp -r coverage "$report_dir/frontend-coverage"
        fi
        
        if [[ -d "backend/htmlcov" ]]; then
            cp -r backend/htmlcov "$report_dir/backend-coverage"
        fi
    fi
    
    # Copy Cypress results
    if [[ -d "cypress/screenshots" ]]; then
        cp -r cypress/screenshots "$report_dir/"
    fi
    
    if [[ -d "cypress/videos" ]]; then
        cp -r cypress/videos "$report_dir/"
    fi
    
    print_success "Test report generated in $report_dir"
}

# Main execution
main() {
    print_status "Starting Rockdrill test runner..."
    print_status "Test type: $TEST_TYPE"
    print_status "Environment: $ENVIRONMENT"
    print_status "Coverage: $COVERAGE"
    print_status "Parallel: $PARALLEL"
    print_status "Verbose: $VERBOSE"
    print_status "Watch: $WATCH"
    
    check_prerequisites
    setup_environment
    install_dependencies
    
    local overall_exit_code=0
    
    case $TEST_TYPE in
        unit)
            run_unit_tests || overall_exit_code=1
            ;;
        integration)
            run_integration_tests || overall_exit_code=1
            ;;
        e2e)
            run_e2e_tests || overall_exit_code=1
            ;;
        smoke)
            run_smoke_tests || overall_exit_code=1
            ;;
        all)
            run_unit_tests || overall_exit_code=1
            run_integration_tests || overall_exit_code=1
            run_e2e_tests || overall_exit_code=1
            ;;
    esac
    
    if [[ "$COVERAGE" == true || "$TEST_TYPE" == "all" ]]; then
        generate_report
    fi
    
    if [[ $overall_exit_code -eq 0 ]]; then
        print_success "All tests passed! ✅"
    else
        print_error "Some tests failed! ❌"
    fi
    
    exit $overall_exit_code
}

# Run main function
main "$@"
