#!/bin/bash

# Rockdrill Backend Deployment Script for Railway
# This script handles the deployment process including migrations and health checks

set -e  # Exit on any error

echo "🚀 Starting Rockdrill Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check environment variables
check_environment() {
    print_status "Checking environment variables..."
    
    if [ -z "$DATABASE_URL" ]; then
        print_error "DATABASE_URL is not set"
        exit 1
    fi
    
    if [ -z "$SECRET_KEY" ]; then
        print_error "SECRET_KEY is not set"
        exit 1
    fi
    
    print_success "Environment variables check passed"
}

# Wait for database to be ready
wait_for_database() {
    print_status "Waiting for database to be ready..."
    
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if python -c "
import os
import sys
sys.path.insert(0, '/app')
from app.core.database import check_db_health
if check_db_health():
    print('Database is ready')
    sys.exit(0)
else:
    sys.exit(1)
" 2>/dev/null; then
            print_success "Database is ready"
            return 0
        fi
        
        print_status "Database not ready, attempt $attempt/$max_attempts"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Database failed to become ready after $max_attempts attempts"
    exit 1
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    if python scripts/migrate_db.py; then
        print_success "Database migrations completed"
    else
        print_error "Database migrations failed"
        exit 1
    fi
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Start the application in background for health check
    uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} &
    APP_PID=$!
    
    # Wait a moment for the app to start
    sleep 5
    
    # Check health endpoint
    if curl -f http://localhost:${PORT:-8000}/health > /dev/null 2>&1; then
        print_success "Health check passed"
        kill $APP_PID 2>/dev/null || true
        return 0
    else
        print_error "Health check failed"
        kill $APP_PID 2>/dev/null || true
        exit 1
    fi
}

# Main deployment function
main() {
    print_status "Environment: ${ENVIRONMENT:-development}"
    print_status "Port: ${PORT:-8000}"
    
    # Step 1: Check environment
    check_environment
    
    # Step 2: Wait for database
    wait_for_database
    
    # Step 3: Run migrations
    run_migrations
    
    # Step 4: Health check (only in staging/production)
    if [ "$ENVIRONMENT" = "staging" ] || [ "$ENVIRONMENT" = "production" ]; then
        health_check
    fi
    
    print_success "Deployment preparation completed successfully!"
    print_status "Starting application..."
    
    # Start the application
    exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
}

# Run main function
main "$@"
