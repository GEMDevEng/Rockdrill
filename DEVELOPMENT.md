# Rockdrill Development Guide

## Overview
Rockdrill is an AI-Powered SDR Automation Platform built with FastAPI (backend) and React/TypeScript (frontend), using SQLite for local development.

## Quick Start Checklist

### Prerequisites
- [ ] Python 3.8+ installed
- [ ] Node.js 16+ and npm installed
- [ ] Git installed
- [ ] SQLite3 installed (for database inspection)

### Initial Setup (First Time)
- [ ] Clone repository: `git clone https://github.com/GEMDevEng/Rockdrill.git`
- [ ] Navigate to project: `cd Rockdrill`
- [ ] Set up backend (see Backend Setup section)
- [ ] Set up frontend (see Frontend Setup section)
- [ ] Create SQLite database (see Database Setup section)
- [ ] Test the complete stack (see Testing section)

## Backend Setup

### 1. Environment Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
# Install core dependencies (avoid PostgreSQL dependencies for local dev)
pip install fastapi uvicorn sqlalchemy python-dotenv pydantic-settings
```

### 3. Environment Configuration
Create `backend/.env` file:
```env
# Database Configuration
DATABASE_URL=sqlite:///./rockdrill.db

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Rockdrill API
PROJECT_VERSION=1.0.0
DEBUG=true

# CORS Configuration
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","http://localhost:8080"]

# Security (for development)
SECRET_KEY=dev-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis Configuration (optional for local dev)
REDIS_URL=redis://localhost:6379

# Email Configuration (optional for local dev)
SMTP_TLS=true
SMTP_PORT=587
SMTP_HOST=smtp.gmail.com
SMTP_USER=
SMTP_PASSWORD=

# External API Keys (optional for local dev)
OPENAI_API_KEY=
CLAY_API_KEY=
ZOOMINFO_API_KEY=
CLEARBIT_API_KEY=
APOLLO_API_KEY=
```

### 4. Start Backend Server
```bash
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000

## Frontend Setup

### 1. Install Dependencies
```bash
# From project root
npm install
```

### 2. Start Frontend Server
```bash
npm run dev
```

Frontend will be available at: http://localhost:5173

## Database Setup

### 1. Create SQLite Database
```bash
# From project root
python create_sqlite_db.py
```

This creates `rockdrill.db` with the complete schema including:
- users table
- leads table  
- campaigns table
- email_templates table
- integrations table
- interactions table
- campaign_leads table (junction)
- campaign_sequences table

### 2. Verify Database Creation
```bash
sqlite3 rockdrill.db ".tables"
sqlite3 rockdrill.db ".schema users"
```

## Testing the Complete Stack

### 1. Backend API Testing
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test user creation
curl -X POST http://localhost:8000/test/user -H "Content-Type: application/json"

# Test lead creation  
curl -X POST http://localhost:8000/test/lead -H "Content-Type: application/json"

# Test API endpoints
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","company":"Test Co"}'
```

### 2. Frontend-Backend Integration Testing
1. Open http://localhost:5173 in browser
2. Try registration flow (creates user in database)
3. Try login flow (authenticates against database)
4. Test lead creation through UI
5. Verify data in database: `sqlite3 rockdrill.db "SELECT * FROM users;"`

### 3. Database Verification
```bash
# Check users
sqlite3 rockdrill.db "SELECT id, email, name, company FROM users;"

# Check leads
sqlite3 rockdrill.db "SELECT id, email, first_name, last_name, company FROM leads;"
```

## Development Workflow

### Daily Development
1. Start backend: `cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
2. Start frontend: `npm run dev`
3. Open http://localhost:5173 for frontend
4. Open http://localhost:8000/docs for API documentation

### Making Changes
- Backend changes: Server auto-reloads with `--reload` flag
- Frontend changes: Vite auto-reloads in browser
- Database changes: Re-run `python create_sqlite_db.py` if schema changes

## Common Troubleshooting

### Backend Issues

**"ModuleNotFoundError: No module named 'pydantic_settings'"**
```bash
pip install pydantic-settings
```

**"Could not find a version that satisfies the requirement psycopg2-binary"**
- Skip PostgreSQL dependencies for local development
- Use SQLite configuration in .env file

**"Database connection failed"**
- Ensure `DATABASE_URL=sqlite:///./rockdrill.db` in .env
- Run `python create_sqlite_db.py` to create database
- Check file permissions on rockdrill.db

### Frontend Issues

**"Failed to fetch" errors in browser console**
- Verify backend is running on http://localhost:8000
- Check API_BASE_URL in `src/services/api.ts` points to correct port
- Verify CORS configuration in backend .env file

**Registration/Login not working**
- Check browser Network tab for API call responses
- Verify backend endpoints are responding: `curl http://localhost:8000/api/v1/auth/register`
- Check database for created users: `sqlite3 rockdrill.db "SELECT * FROM users;"`

### Database Issues

**"Database is locked"**
```bash
# Close any open SQLite connections
pkill sqlite3
# Or restart the backend server
```

**"Table doesn't exist"**
```bash
# Recreate database
rm rockdrill.db
python create_sqlite_db.py
```

## Architecture Notes

### Current Development Setup
- **Backend**: FastAPI with SQLite database
- **Frontend**: React/TypeScript with Vite
- **Database**: SQLite for local development
- **Authentication**: Placeholder JWT tokens (development only)

### Known Issues
1. **Schema Mismatch**: SQLAlchemy models don't match database table structure
2. **Temporary API Endpoints**: Using test endpoints instead of full API router
3. **Authentication**: Using placeholder tokens, not real JWT implementation
4. **Health Check**: Shows database as "disconnected" despite working CRUD operations

### Production Considerations
- Switch to PostgreSQL for production
- Implement proper JWT authentication
- Fix SQLAlchemy model-database schema alignment
- Enable full API router with proper error handling
- Add proper logging and monitoring

## File Structure
```
Rockdrill/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── core/config.py   # Configuration settings
│   │   └── models/          # SQLAlchemy models
│   ├── .env                 # Environment variables
│   ├── requirements.txt     # Python dependencies
│   └── rockdrill.db        # SQLite database
├── src/
│   ├── services/api.ts      # Frontend API client
│   ├── components/          # React components
│   └── contexts/           # React contexts
├── create_sqlite_db.py     # Database creation script
├── package.json            # Node.js dependencies
└── DEVELOPMENT.md          # This file
```

## Quick Developer Onboarding Checklist

### New Developer Setup (30 minutes)
- [ ] **Prerequisites Check**
  - [ ] Python 3.8+ installed: `python --version`
  - [ ] Node.js 16+ installed: `node --version`
  - [ ] Git installed: `git --version`
  - [ ] SQLite3 installed: `sqlite3 --version`

- [ ] **Repository Setup**
  - [ ] Clone repo: `git clone https://github.com/GEMDevEng/Rockdrill.git`
  - [ ] Navigate to project: `cd Rockdrill`

- [ ] **Backend Setup (10 minutes)**
  - [ ] Create virtual environment: `cd backend && python -m venv venv`
  - [ ] Activate environment: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
  - [ ] Install dependencies: `pip install fastapi uvicorn sqlalchemy python-dotenv pydantic-settings`
  - [ ] Copy .env configuration from DEVELOPMENT.md
  - [ ] Create database: `cd .. && python create_sqlite_db.py`
  - [ ] Start backend: `cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
  - [ ] Verify backend: Open http://localhost:8000/health

- [ ] **Frontend Setup (5 minutes)**
  - [ ] Install dependencies: `npm install`
  - [ ] Start frontend: `npm run dev`
  - [ ] Verify frontend: Open http://localhost:5173

- [ ] **Integration Test (5 minutes)**
  - [ ] Test registration: Create account through UI at http://localhost:5173
  - [ ] Test login: Login with created account
  - [ ] Test lead creation: Create a test lead through UI
  - [ ] Verify database: `sqlite3 rockdrill.db "SELECT * FROM users;"`

- [ ] **Development Environment Ready** ✅

### Daily Development Workflow
1. **Start Development Servers**
   ```bash
   # Terminal 1: Backend
   cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

   # Terminal 2: Frontend
   npm run dev
   ```

2. **Development URLs**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

3. **Common Commands**
   ```bash
   # Check database
   sqlite3 rockdrill.db "SELECT * FROM users;"

   # Test API endpoints
   curl http://localhost:8000/health
   curl -X POST http://localhost:8000/test/user

   # Reset database
   rm rockdrill.db && python create_sqlite_db.py
   ```

### Troubleshooting Quick Fixes
- **Backend won't start**: Check .env file exists and has correct DATABASE_URL
- **Frontend API errors**: Verify backend is running on port 8000
- **Database errors**: Delete rockdrill.db and run `python create_sqlite_db.py`
- **Import errors**: Reinstall dependencies in virtual environment

## Next Steps for Production
1. Fix SQLAlchemy model-database schema alignment
2. Implement proper JWT authentication system
3. Enable full API router with all endpoints
4. Add comprehensive error handling
5. Set up proper logging and monitoring
6. Configure PostgreSQL for production
7. Add automated testing suite
8. Set up CI/CD pipeline
