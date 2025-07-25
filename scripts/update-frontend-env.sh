#!/bin/bash

# Script to update frontend environment variables after Railway backend deployment
# Usage: ./scripts/update-frontend-env.sh <railway-backend-url>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Railway backend URL is provided
if [ -z "$1" ]; then
    print_error "Usage: $0 <railway-backend-url>"
    print_error "Example: $0 https://rockdrill-backend-production.railway.app"
    exit 1
fi

RAILWAY_URL="$1"
API_URL="${RAILWAY_URL}/api/v1"

print_status "Updating frontend environment for Railway backend..."
print_status "Backend URL: $RAILWAY_URL"
print_status "API URL: $API_URL"

# Backup current .env.production
if [ -f ".env.production" ]; then
    cp .env.production .env.production.backup
    print_status "Backed up current .env.production to .env.production.backup"
fi

# Update .env.production
cat > .env.production << EOF
# Production Environment Variables for Rockdrill Frontend
# Connected to Railway Backend

# Demo Mode Configuration
# Set to false for production backend
VITE_DEMO_MODE=false

# API Configuration - Railway Backend
VITE_API_URL=${API_URL}
VITE_API_BASE_URL=${RAILWAY_URL}

# Environment
VITE_ENVIRONMENT=production

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_AI_FEATURES=true

# Build Configuration
NODE_ENV=production
EOF

print_success "Updated .env.production with Railway backend configuration"

# Test backend connectivity
print_status "Testing backend connectivity..."

if curl -f "${RAILWAY_URL}/health" > /dev/null 2>&1; then
    print_success "✅ Backend health check passed"
else
    print_warning "⚠️ Backend health check failed - please verify the URL is correct"
    print_warning "Make sure your Railway backend is deployed and accessible"
fi

# Show the changes
print_status "New environment configuration:"
echo "----------------------------------------"
cat .env.production
echo "----------------------------------------"

print_status "Next steps:"
echo "1. Commit the environment changes:"
echo "   git add .env.production"
echo "   git commit -m 'feat: Connect frontend to Railway backend'"
echo "   git push origin main"
echo ""
echo "2. Vercel will automatically deploy the updated frontend"
echo ""
echo "3. Test the integration:"
echo "   - Visit your Vercel frontend URL"
echo "   - Try user registration/login"
echo "   - Verify API calls go to Railway backend"

print_success "Frontend environment update completed!"
