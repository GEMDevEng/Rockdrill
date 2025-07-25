# Rockdrill Backend API

FastAPI-based backend for the AI-Powered SDR Automation application.

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Start all services
docker-compose up --build

# API will be available at http://localhost:8000
# API docs at http://localhost:8000/api/v1/docs
```

### Option 2: Local Development

```bash
# Run setup script
python setup.py

# Activate virtual environment
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate     # Windows

# Start database and Redis
docker-compose up -d db redis

# Run database migrations
alembic upgrade head

# Start the API server
uvicorn app.main:app --reload
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/                 # API routes
│   │   ├── v1/
│   │   │   ├── endpoints/   # API endpoints
│   │   │   └── api.py       # API router
│   │   └── deps.py          # Dependencies
│   ├── core/                # Core functionality
│   │   ├── config.py        # Configuration
│   │   ├── database.py      # Database setup
│   │   └── security.py      # Authentication
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Business logic
│   ├── utils/               # Utilities
│   └── main.py              # FastAPI application
├── alembic/                 # Database migrations
├── tests/                   # Test files
├── docker-compose.yml       # Docker services
├── Dockerfile               # Docker image
├── requirements.txt         # Python dependencies
└── .env.example             # Environment variables template
```

## 🔧 Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/rockdrill_db

# JWT Secret
JWT_SECRET_KEY=your-super-secret-key

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key

# External APIs
CLEARBIT_API_KEY=your-clearbit-api-key
```

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/forgot-password` - Password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/verify-email` - Verify email
- `GET /api/v1/auth/validate` - Validate token

### Users
- `GET /api/v1/user/profile` - Get user profile
- `PATCH /api/v1/user/profile` - Update profile
- `PATCH /api/v1/user/password` - Update password
- `DELETE /api/v1/user/account` - Delete account

### Leads
- `GET /api/v1/leads` - List leads
- `POST /api/v1/leads` - Create lead
- `GET /api/v1/leads/{id}` - Get lead
- `PATCH /api/v1/leads/{id}` - Update lead
- `DELETE /api/v1/leads/{id}` - Delete lead
- `POST /api/v1/leads/upload` - Upload CSV
- `GET /api/v1/leads/export` - Export CSV
- `POST /api/v1/leads/bulk-delete` - Bulk delete
- `POST /api/v1/leads/{id}/enrich` - Enrich lead data
- `POST /api/v1/leads/{id}/score` - Score lead
- `GET /api/v1/leads/segments` - Get segments

### Campaigns
- `GET /api/v1/campaigns` - List campaigns
- `POST /api/v1/campaigns` - Create campaign
- `GET /api/v1/campaigns/{id}` - Get campaign
- `PATCH /api/v1/campaigns/{id}` - Update campaign
- `DELETE /api/v1/campaigns/{id}` - Delete campaign
- `POST /api/v1/campaigns/{id}/duplicate` - Duplicate campaign
- `POST /api/v1/campaigns/{id}/start` - Start campaign
- `POST /api/v1/campaigns/{id}/pause` - Pause campaign
- `POST /api/v1/campaigns/{id}/leads` - Add leads to campaign
- `DELETE /api/v1/campaigns/{id}/leads` - Remove leads

### Templates
- `GET /api/v1/templates` - List templates
- `POST /api/v1/templates` - Create template
- `GET /api/v1/templates/{id}` - Get template
- `PATCH /api/v1/templates/{id}` - Update template
- `DELETE /api/v1/templates/{id}` - Delete template
- `POST /api/v1/templates/{id}/preview` - Preview template

### Analytics
- `GET /api/v1/analytics/overview` - Dashboard overview
- `GET /api/v1/analytics/campaigns/{id}` - Campaign analytics
- `GET /api/v1/analytics/leads` - Lead analytics
- `GET /api/v1/analytics/export` - Export report

### Integrations
- `GET /api/v1/integrations` - List integrations
- `POST /api/v1/integrations` - Create integration
- `GET /api/v1/integrations/{id}` - Get integration
- `PATCH /api/v1/integrations/{id}` - Update integration
- `DELETE /api/v1/integrations/{id}` - Delete integration
- `POST /api/v1/integrations/{id}/sync` - Sync integration

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py
```

## 🚀 Deployment

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Render

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Docker

```bash
# Build image
docker build -t rockdrill-api .

# Run container
docker run -p 8000:8000 rockdrill-api
```

## 📝 Development

### Adding New Endpoints

1. Create model in `app/models/`
2. Create schema in `app/schemas/`
3. Create service in `app/services/`
4. Create endpoint in `app/api/v1/endpoints/`
5. Add to router in `app/api/v1/api.py`

### Database Migrations

```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## 🔍 Monitoring

- Health check: `GET /health`
- API docs: `GET /api/v1/docs`
- Metrics: Available via Prometheus (if configured)

## 🛡️ Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention

## 📚 Documentation

- API documentation: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc
- OpenAPI spec: http://localhost:8000/api/v1/openapi.json
