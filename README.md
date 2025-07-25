# Rockdrill - AI-Powered SDR Automation Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/FastAPI-0.104.0-green?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.3.0-blue?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
</div>

<div align="center">
  <img src="https://img.shields.io/github/workflow/status/GEMDevEng/Rockdrill/Test%20Suite?style=for-the-badge" alt="Build Status" />
  <img src="https://img.shields.io/codecov/c/github/GEMDevEng/Rockdrill?style=for-the-badge" alt="Coverage" />
  <img src="https://img.shields.io/github/license/GEMDevEng/Rockdrill?style=for-the-badge" alt="License" />
</div>

## 🚀 Overview

Rockdrill is a cutting-edge AI-powered Sales Development Representative (SDR) automation platform designed to revolutionize outbound sales processes. By leveraging advanced artificial intelligence and machine learning technologies, Rockdrill automates lead generation, personalized outreach, and campaign management, enabling sales teams to scale their efforts while maintaining high-quality, personalized communication.

### 🎯 Key Features

- **🤖 AI-Powered Lead Generation**: Intelligent lead discovery and qualification using advanced algorithms
- **📧 Automated Email Campaigns**: Personalized email sequences with AI-generated content
- **💼 LinkedIn Automation**: Automated LinkedIn outreach and connection management
- **📊 Advanced Analytics**: Comprehensive campaign performance tracking and insights
- **🎨 Template Management**: Customizable email and message templates with AI optimization
- **🔗 CRM Integration**: Seamless integration with popular CRM platforms
- **📱 Real-time Dashboard**: Live campaign monitoring and performance metrics
- **🛡️ Compliance Management**: Built-in compliance tools for GDPR, CAN-SPAM, and other regulations

### 🏗️ Architecture

Rockdrill follows a modern, scalable architecture with clear separation of concerns:

- **Frontend**: React 18 with TypeScript, Tailwind CSS, and Vite for optimal performance
- **Backend**: FastAPI with Python 3.11 for high-performance API development
- **Database**: PostgreSQL for reliable data storage with SQLAlchemy ORM
- **Authentication**: JWT-based authentication with secure session management
- **Testing**: Comprehensive test suite with 80%+ coverage using pytest, Vitest, and Cypress
- **Deployment**: Cloud-native deployment with CI/CD automation

## 📋 Table of Contents

- [🚀 Overview](#-overview)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Project Structure](#-project-structure)
- [⚡ Quick Start](#-quick-start)
- [🔧 Installation](#-installation)
- [🌍 Environment Configuration](#-environment-configuration)
- [🧪 Testing](#-testing)
- [📚 API Documentation](#-api-documentation)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern React with hooks and concurrent features
- **TypeScript 5.0** - Type-safe JavaScript development
- **Vite 5.0** - Lightning-fast build tool and development server
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **React Router 6** - Declarative routing for React applications
- **Zustand** - Lightweight state management
- **React Query** - Powerful data synchronization for React
- **React Hook Form** - Performant forms with easy validation
- **Lucide React** - Beautiful and customizable icons

### Backend
- **FastAPI 0.104** - Modern, fast web framework for building APIs
- **Python 3.11** - Latest Python with performance improvements
- **SQLAlchemy 2.0** - Modern Python SQL toolkit and ORM
- **PostgreSQL 15** - Advanced open-source relational database
- **Alembic** - Database migration tool for SQLAlchemy
- **Pydantic 2.0** - Data validation using Python type hints
- **JWT** - JSON Web Tokens for secure authentication
- **Celery** - Distributed task queue for background processing

### Development & Testing
- **Vitest** - Fast unit test framework
- **Cypress** - End-to-end testing framework
- **pytest** - Python testing framework
- **ESLint & Prettier** - Code linting and formatting
- **GitHub Actions** - CI/CD automation
- **Docker** - Containerization for consistent environments

## 📁 Project Structure

```
Rockdrill/
├── 📁 backend/                    # FastAPI backend application
│   ├── 📁 app/                   # Main application package
│   │   ├── 📁 api/               # API route handlers
│   │   ├── 📁 core/              # Core functionality (auth, config)
│   │   ├── 📁 models/            # SQLAlchemy database models
│   │   ├── 📁 schemas/           # Pydantic schemas for validation
│   │   ├── 📁 services/          # Business logic layer
│   │   └── main.py               # FastAPI application entry point
│   ├── 📁 tests/                 # Backend test suite
│   │   ├── conftest.py           # Test configuration and fixtures
│   │   ├── test_models.py        # Model unit tests
│   │   ├── test_api_*.py         # API endpoint tests
│   │   └── test_integration_*.py # Integration tests
│   ├── requirements.txt          # Python dependencies
│   └── pytest.ini               # Pytest configuration
├── 📁 src/                       # React frontend application
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 ui/                # Base UI components
│   │   ├── 📁 auth/              # Authentication components
│   │   ├── 📁 leads/             # Lead management components
│   │   └── 📁 campaigns/         # Campaign management components
│   ├── 📁 pages/                 # Page components
│   ├── 📁 hooks/                 # Custom React hooks
│   ├── 📁 services/              # API service functions
│   ├── 📁 stores/                # State management (Zustand)
│   ├── 📁 types/                 # TypeScript type definitions
│   └── 📁 utils/                 # Utility functions
├── 📁 tests/                     # Frontend test suite
│   ├── 📁 components/            # Component tests
│   ├── 📁 integration/           # Integration tests
│   ├── 📁 utils/                 # Test utilities
│   └── setup.ts                 # Test setup configuration
├── 📁 cypress/                   # End-to-end tests
│   ├── 📁 e2e/                   # E2E test files
│   ├── 📁 support/               # Cypress support files
│   └── 📁 fixtures/              # Test data fixtures
├── 📁 .github/                   # GitHub Actions workflows
│   └── 📁 workflows/             # CI/CD pipeline definitions
├── 📁 docs/                      # Documentation
├── 📁 scripts/                   # Build and deployment scripts
├── package.json                  # Frontend dependencies and scripts
├── vite.config.ts               # Vite configuration
├── vitest.config.ts             # Vitest test configuration
├── cypress.config.ts            # Cypress E2E test configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── TESTING.md                   # Comprehensive testing guide
├── test-config.json             # Test configuration settings
└── README.md                    # This file
```

## ⚡ Quick Start

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Python 3.11+** - [Download here](https://python.org/)
- **PostgreSQL 15+** - [Download here](https://postgresql.org/) (for production)
- **Git** - [Download here](https://git-scm.com/)

### 🚀 Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/GEMDevEng/Rockdrill.git
   cd Rockdrill
   ```

2. **Backend Setup**
   ```bash
   cd backend

   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt

   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration

   # Initialize database
   python -c "from app.database import create_tables; create_tables()"
   ```

3. **Frontend Setup**
   ```bash
   cd ..  # Back to root directory

   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Start backend
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

   # Terminal 2: Start frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### 🐳 Docker Setup (Alternative)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## 🔧 Installation

### Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Key Backend Dependencies:**
- `fastapi` - Modern web framework for building APIs
- `uvicorn` - ASGI server for FastAPI
- `sqlalchemy` - SQL toolkit and ORM
- `alembic` - Database migration tool
- `pydantic` - Data validation using Python type hints
- `python-jose` - JWT token handling
- `passlib` - Password hashing
- `python-multipart` - Form data parsing
- `pytest` - Testing framework
- `pytest-cov` - Coverage reporting

### Frontend Dependencies

```bash
npm install
```

**Key Frontend Dependencies:**
- `react` - UI library
- `typescript` - Type-safe JavaScript
- `vite` - Build tool and dev server
- `tailwindcss` - Utility-first CSS framework
- `react-router-dom` - Client-side routing
- `@tanstack/react-query` - Data fetching and caching
- `zustand` - State management
- `react-hook-form` - Form handling
- `lucide-react` - Icon library
- `vitest` - Testing framework
- `cypress` - E2E testing

## 🌍 Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/rockdrill
# For development with SQLite:
# DATABASE_URL=sqlite:///./rockdrill.db

# Security
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Environment
ENVIRONMENT=development

# CORS Settings
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# External API Keys (Optional)
OPENAI_API_KEY=your-openai-api-key
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

### Frontend Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_BASE_URL=http://localhost:8000

# Environment
VITE_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_AI_FEATURES=true

# External Services (Optional)
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_SENTRY_DSN=your-sentry-dsn
```

### Production Environment

For production deployment, ensure you have:

1. **Database**: PostgreSQL instance with proper credentials
2. **Security**: Strong SECRET_KEY and secure password policies
3. **CORS**: Properly configured allowed origins
4. **SSL**: HTTPS enabled for all endpoints
5. **Monitoring**: Error tracking and performance monitoring

## 🧪 Testing

Rockdrill includes a comprehensive testing suite with 80%+ code coverage. For detailed testing information, see [TESTING.md](./TESTING.md).

### Quick Test Commands

```bash
# Backend Tests
cd backend
pytest                    # Run all tests
pytest --cov=app         # Run with coverage
pytest -v                # Verbose output

# Frontend Tests
npm test                  # Run unit tests
npm run test:coverage     # Run with coverage
npm run test:watch        # Watch mode

# End-to-End Tests
npm run cypress:open      # Interactive mode
npm run cypress:run       # Headless mode

# Run All Tests
npm run test:all          # All test suites
```

### Test Coverage

- **Backend**: 85%+ coverage with pytest
- **Frontend**: 80%+ coverage with Vitest
- **E2E**: Critical user workflows with Cypress
- **Integration**: API and database integration tests

### Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Scheduled nightly runs

## 📚 API Documentation

### Interactive Documentation

When running the backend locally, access interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### API Endpoints Overview

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

#### Lead Management
- `GET /api/v1/leads` - List leads with filtering and pagination
- `POST /api/v1/leads` - Create new lead
- `GET /api/v1/leads/{id}` - Get lead details
- `PUT /api/v1/leads/{id}` - Update lead
- `DELETE /api/v1/leads/{id}` - Delete lead
- `POST /api/v1/leads/import` - Bulk import leads

#### Campaign Management
- `GET /api/v1/campaigns` - List campaigns
- `POST /api/v1/campaigns` - Create campaign
- `GET /api/v1/campaigns/{id}` - Get campaign details
- `PUT /api/v1/campaigns/{id}` - Update campaign
- `DELETE /api/v1/campaigns/{id}` - Delete campaign
- `POST /api/v1/campaigns/{id}/start` - Start campaign
- `POST /api/v1/campaigns/{id}/pause` - Pause campaign

#### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard metrics
- `GET /api/v1/analytics/campaigns/{id}` - Campaign analytics
- `GET /api/v1/analytics/leads` - Lead analytics

### Authentication

All API endpoints (except registration and login) require JWT authentication:

```bash
# Include in request headers
Authorization: Bearer <your-jwt-token>
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Set `VITE_API_URL` to your backend URL
   - Configure other production environment variables

### Backend Deployment Options

#### Option 1: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option 2: Heroku
```bash
# Install Heroku CLI and deploy
heroku create your-app-name
git push heroku main
```

#### Option 3: Docker
```bash
# Build and run Docker container
docker build -t rockdrill-backend ./backend
docker run -p 8000:8000 rockdrill-backend
```

### Database Setup (Production)

1. **PostgreSQL Setup**
   - Create PostgreSQL database
   - Update `DATABASE_URL` environment variable
   - Run migrations: `alembic upgrade head`

2. **Environment Variables**
   - Set all required environment variables
   - Use strong `SECRET_KEY`
   - Configure CORS for your domain

### CI/CD Pipeline

The project includes GitHub Actions for automated deployment:

- **Test Pipeline**: Runs on every PR
- **Deploy Pipeline**: Runs on merge to main
- **Security Scanning**: Regular security checks

## 🤝 Contributing

We welcome contributions to Rockdrill! Please follow these guidelines:

### Development Workflow

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/Rockdrill.git
   cd Rockdrill
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set Up Development Environment**
   - Follow the [Quick Start](#-quick-start) guide
   - Ensure all tests pass: `npm run test:all`

4. **Make Your Changes**
   - Write clean, well-documented code
   - Follow existing code style and conventions
   - Add tests for new functionality
   - Update documentation as needed

5. **Test Your Changes**
   ```bash
   # Run all tests
   npm run test:all

   # Check code formatting
   npm run lint
   npm run format

   # Run type checking
   npm run type-check
   ```

6. **Submit Pull Request**
   - Write clear commit messages
   - Include description of changes
   - Reference any related issues
   - Ensure CI/CD pipeline passes

### Code Style Guidelines

#### TypeScript/React
- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use functional components with hooks
- Implement proper error boundaries
- Write comprehensive PropTypes/TypeScript interfaces

#### Python/FastAPI
- Follow PEP 8 style guidelines
- Use type hints for all functions
- Write docstrings for all public functions
- Implement proper error handling
- Use async/await for database operations

#### Testing
- Write tests for all new features
- Maintain 80%+ code coverage
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add password reset functionality
fix(leads): resolve duplicate email validation issue
docs(readme): update installation instructions
test(campaigns): add integration tests for campaign creation
```

### Issue Reporting

When reporting issues, please include:

1. **Environment Information**
   - Operating system
   - Node.js version
   - Python version
   - Browser (for frontend issues)

2. **Steps to Reproduce**
   - Clear, numbered steps
   - Expected vs actual behavior
   - Screenshots if applicable

3. **Error Messages**
   - Full error messages
   - Stack traces
   - Console logs

### Feature Requests

For feature requests, please:

1. Check existing issues first
2. Provide clear use case description
3. Explain expected behavior
4. Consider implementation complexity
5. Be open to discussion and feedback

## 📄 License

This project is proprietary software. All rights reserved.

**Copyright © 2024 Rockdrill Technologies**

Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without explicit written permission from Rockdrill Technologies.

## 🆘 Support & Documentation

### Documentation Links

- **[Testing Guide](./TESTING.md)** - Comprehensive testing documentation
- **[Development Setup](./DEVELOPMENT.md)** - Detailed development environment setup
- **[API Documentation](http://localhost:8000/docs)** - Interactive API documentation
- **[Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md)** - Production deployment instructions

### Getting Help

1. **Check Documentation**: Review relevant documentation files
2. **Search Issues**: Look through existing GitHub issues
3. **Create Issue**: If you can't find a solution, create a new issue
4. **Contact Team**: For urgent matters, contact the development team

### Troubleshooting

#### Common Issues

**Backend won't start:**
- Check Python version (3.11+ required)
- Verify all dependencies are installed
- Check database connection
- Review environment variables

**Frontend won't start:**
- Check Node.js version (18+ required)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check environment variables
- Verify backend is running

**Tests failing:**
- Ensure test database is set up
- Check test environment variables
- Run tests individually to isolate issues
- Review test logs for specific errors

**Database connection issues:**
- Verify database is running
- Check connection string format
- Ensure database exists
- Verify user permissions

For more detailed troubleshooting, see the [TESTING.md](./TESTING.md) file.

---

<div align="center">
  <p>Built with ❤️ by the Rockdrill Team</p>
  <p>
    <a href="https://github.com/GEMDevEng/Rockdrill">GitHub</a> •
    <a href="mailto:dev@rockdrill.com">Contact</a> •
    <a href="https://rockdrill.com">Website</a>
  </p>
</div>
