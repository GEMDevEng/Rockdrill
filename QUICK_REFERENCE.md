# Rockdrill Quick Reference

## Development Commands

### Start Development Environment
```bash
# Backend (Terminal 1)
cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (Terminal 2)
npm run dev
```

### Database Operations
```bash
# Create/Reset Database
python create_sqlite_db.py

# Inspect Database
sqlite3 rockdrill.db ".tables"
sqlite3 rockdrill.db "SELECT * FROM users;"
sqlite3 rockdrill.db "SELECT * FROM leads;"

# Database Schema
sqlite3 rockdrill.db ".schema users"
sqlite3 rockdrill.db ".schema leads"
```

### API Testing
```bash
# Health Check
curl http://localhost:8000/health

# Test User Creation
curl -X POST http://localhost:8000/test/user

# Test Lead Creation
curl -X POST http://localhost:8000/test/lead

# Register User via API
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","company":"Test Co"}'

# Login User via API
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Create Lead via API
curl -X POST http://localhost:8000/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{"email":"lead@example.com","first_name":"John","last_name":"Doe","company":"Example Corp"}'

# Get Leads via API
curl http://localhost:8000/api/v1/leads
```

## Development URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## File Locations

### Configuration Files
- Backend config: `backend/.env`
- Frontend API config: `src/services/api.ts`
- Database: `backend/rockdrill.db`

### Key Source Files
- Backend main: `backend/app/main.py`
- Frontend main: `src/App.tsx`
- API client: `src/services/api.ts`
- Database models: `backend/app/models/`

## Troubleshooting

### Backend Issues
```bash
# Module not found errors
pip install fastapi uvicorn sqlalchemy python-dotenv pydantic-settings

# Database connection issues
# Check .env file has: DATABASE_URL=sqlite:///./rockdrill.db

# Port already in use
lsof -ti:8000 | xargs kill -9
```

### Frontend Issues
```bash
# API connection errors
# Verify backend running on port 8000
# Check src/services/api.ts has correct API_BASE_URL

# Dependencies issues
rm -rf node_modules package-lock.json
npm install
```

### Database Issues
```bash
# Database locked
pkill sqlite3

# Recreate database
rm backend/rockdrill.db
python create_sqlite_db.py

# Check database exists
ls -la backend/rockdrill.db
```

## Common Development Tasks

### Adding New API Endpoint
1. Add endpoint to `backend/app/main.py`
2. Test with curl
3. Update frontend API client in `src/services/api.ts`
4. Test frontend integration

### Database Schema Changes
1. Update `create_sqlite_db.py`
2. Delete old database: `rm backend/rockdrill.db`
3. Create new database: `python create_sqlite_db.py`
4. Update SQLAlchemy models in `backend/app/models/`
5. Test API endpoints

### Frontend Component Changes
1. Edit components in `src/components/`
2. Frontend auto-reloads with Vite
3. Test in browser at http://localhost:5173

### Environment Variables
1. Backend: Edit `backend/.env`
2. Frontend: Edit `src/services/api.ts` for API_BASE_URL
3. Restart servers after changes

## Testing Checklist

### Backend Testing
- [ ] Health endpoint: `curl http://localhost:8000/health`
- [ ] User creation: `curl -X POST http://localhost:8000/test/user`
- [ ] Lead creation: `curl -X POST http://localhost:8000/test/lead`
- [ ] Database verification: `sqlite3 rockdrill.db "SELECT * FROM users;"`

### Frontend Testing
- [ ] Registration flow through UI
- [ ] Login flow through UI
- [ ] Lead creation through UI
- [ ] Data persistence in database

### Integration Testing
- [ ] Frontend → Backend → Database flow
- [ ] Error handling in UI
- [ ] API response formatting
- [ ] CORS configuration working

## Git Workflow

```bash
# Daily workflow
git pull origin main
git checkout -b feature/your-feature-name

# Make changes, test locally
git add .
git commit -m "Description of changes"
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## Production Deployment

### Backend (Railway/Heroku)
- Set environment variables for production
- Use PostgreSQL instead of SQLite
- Update DATABASE_URL

### Frontend (Vercel)
- Set REACT_APP_API_BASE_URL to production backend URL
- Build and deploy: `npm run build`

## Emergency Fixes

### Complete Reset
```bash
# Reset everything
rm -rf backend/venv backend/rockdrill.db node_modules
cd backend && python -m venv venv && source venv/bin/activate
pip install fastapi uvicorn sqlalchemy python-dotenv pydantic-settings
cd .. && python create_sqlite_db.py
npm install
```

### Quick Health Check
```bash
# Check all services
curl http://localhost:8000/health
curl http://localhost:5173
sqlite3 backend/rockdrill.db ".tables"
```
