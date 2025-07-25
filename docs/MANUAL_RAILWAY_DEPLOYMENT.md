# Manual Railway Deployment Guide for Rockdrill Backend

## 🚀 Alternative Deployment Approach

Since CLI authentication can be challenging, we'll use Railway's GitHub integration for deployment.

## Step 1: Railway Web Dashboard Setup

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub account
3. Verify your email address

### 1.2 Create New Project
1. Click "New Project" in Railway dashboard
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account if not already connected
4. Select the `GEMDevEng/Rockdrill` repository
5. Choose the `main` branch

### 1.3 Configure Build Settings
1. Set **Root Directory**: `backend`
2. Set **Build Command**: `pip install -r requirements.txt`
3. Set **Start Command**: `./scripts/deploy.sh`
4. Enable **Auto-Deploy** from main branch

## Step 2: Add PostgreSQL Database

### 2.1 Add Database Service
1. In your Railway project dashboard
2. Click "New Service" → "Database" → "PostgreSQL"
3. Railway will automatically provision a PostgreSQL instance
4. Note the connection details (automatically available as environment variables)

### 2.2 Database Configuration
- Railway automatically provides `DATABASE_URL` environment variable
- No manual configuration needed for basic setup

## Step 3: Configure Environment Variables

### 3.1 Required Environment Variables
Set these in Railway dashboard under "Variables" tab:

```bash
# Application Configuration
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO

# Security (CRITICAL - Generate new values)
SECRET_KEY=your-super-secure-secret-key-here-generate-new-one
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS Configuration
BACKEND_CORS_ORIGINS=https://rockdrill-348vi04cd-gem-devs-projects.vercel.app,http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_BURST=10

# File Upload
MAX_FILE_SIZE_MB=10

# Email Configuration (Optional - configure later)
# SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM_NAME=Rockdrill
EMAIL_FROM_ADDRESS=noreply@rockdrill.com

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_EMAIL_VERIFICATION=true
ENABLE_PASSWORD_RESET=true
ENABLE_ANALYTICS=true

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Rockdrill API
PROJECT_VERSION=1.0.0
```

### 3.2 Generate Secure SECRET_KEY
Use this Python command to generate a secure secret key:
```python
import secrets
print(secrets.token_urlsafe(32))
```

## Step 4: Deploy and Verify

### 4.1 Trigger Deployment
1. Push any change to main branch, or
2. Click "Deploy" in Railway dashboard
3. Monitor build logs in Railway dashboard

### 4.2 Verify Deployment
Once deployed, test these endpoints:

1. **Health Check**: `https://your-app.railway.app/health`
   - Should return: `{"status": "healthy"}`

2. **API Documentation**: `https://your-app.railway.app/api/v1/docs`
   - Should show FastAPI Swagger UI

3. **Database Connection**: Check logs for successful migration messages

## Step 5: Get Railway Backend URL

### 5.1 Find Your Backend URL
1. In Railway dashboard, go to your backend service
2. Click on "Settings" tab
3. Find "Public Domain" section
4. Copy the generated URL (e.g., `https://rockdrill-backend-production.railway.app`)

### 5.2 Test Backend Endpoints
```bash
# Health check
curl https://your-backend.railway.app/health

# API docs (should return HTML)
curl https://your-backend.railway.app/api/v1/docs
```

## Step 6: Update Frontend Configuration

### 6.1 Update Environment Variables
Create/update `.env.production` in the root directory:

```bash
# Disable demo mode
VITE_DEMO_MODE=false

# Connect to Railway backend
VITE_API_URL=https://your-backend.railway.app/api/v1
VITE_API_BASE_URL=https://your-backend.railway.app

# Environment
VITE_ENVIRONMENT=production

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_AI_FEATURES=true
```

### 6.2 Deploy Frontend Update
```bash
# Commit the environment changes
git add .env.production
git commit -m "feat: Connect frontend to Railway backend"
git push origin main
```

Vercel will automatically deploy the updated frontend.

## Step 7: Test Full Integration

### 7.1 Test User Registration
1. Go to your Vercel frontend URL
2. Try to register a new user
3. Verify the request goes to Railway backend
4. Check Railway logs for successful registration

### 7.2 Test User Login
1. Login with the registered user
2. Verify JWT token is received
3. Test authenticated endpoints

### 7.3 Test Core Features
1. Create a lead
2. Create a campaign
3. Test email templates
4. Verify data persistence

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Verify `BACKEND_CORS_ORIGINS` includes your Vercel URL
   - Check Railway logs for CORS-related errors

2. **Database Connection Issues**:
   - Verify PostgreSQL service is running
   - Check `DATABASE_URL` is automatically set
   - Review migration logs

3. **Authentication Issues**:
   - Verify `SECRET_KEY` is set and secure
   - Check JWT token format in browser dev tools

4. **Build Failures**:
   - Check Railway build logs
   - Verify all dependencies in `requirements.txt`
   - Ensure `scripts/deploy.sh` is executable

### Monitoring

1. **Railway Dashboard**: Monitor service health and logs
2. **Vercel Dashboard**: Monitor frontend deployments
3. **Browser Dev Tools**: Check network requests and console errors

## Success Criteria

✅ Railway backend deployed and accessible  
✅ PostgreSQL database connected and migrated  
✅ Health endpoint returns 200  
✅ API documentation accessible  
✅ Frontend connects to backend successfully  
✅ User registration/login works  
✅ Core features functional  

## Next Steps After Successful Deployment

1. **Phase 2**: Database optimization and backups
2. **Phase 3**: Security hardening
3. **Phase 4**: Custom domain and SSL
4. **Phase 5**: Monitoring and alerting
5. **Phase 6**: Performance optimization

---

**Note**: This manual approach ensures reliable deployment even if CLI authentication issues occur. The GitHub integration provides automatic deployments and is the recommended approach for production systems.
