# Rockdrill

## AI-Powered SDR Automation Platform

Rockdrill is a comprehensive sales development representative (SDR) automation platform that leverages artificial intelligence to streamline lead generation, email outreach, and campaign management.

## Features

- **Lead Management**: Import, enrich, and organize leads with AI-powered insights
- **Email Automation**: Create personalized email sequences that convert prospects
- **Campaign Builder**: Design and execute multi-channel outreach campaigns
- **Analytics Dashboard**: Track performance and optimize sales campaigns
- **AI-Powered Insights**: Get intelligent recommendations to improve outreach
- **Seamless Integrations**: Connect with CRM, email, and sales tools

## Quick Start

### For Developers
See [DEVELOPMENT.md](./DEVELOPMENT.md) for complete local development setup instructions.

**Quick Setup:**
```bash
# 1. Clone and setup
git clone https://github.com/GEMDevEng/Rockdrill.git
cd Rockdrill

# 2. Backend setup
cd backend && python -m venv venv && source venv/bin/activate
pip install fastapi uvicorn sqlalchemy python-dotenv pydantic-settings
cd .. && python create_sqlite_db.py

# 3. Frontend setup
npm install

# 4. Start development servers
cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
npm run dev
```

Open http://localhost:5173 to access the application.

### For Production
See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for production deployment instructions.

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: FastAPI, Python, SQLAlchemy
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: JWT tokens
- **Deployment**: Vercel (frontend), Railway/Heroku (backend)

## Project Structure

```
Rockdrill/
├── backend/           # FastAPI backend application
├── src/              # React frontend application
├── docs/             # Documentation and specifications
├── create_sqlite_db.py # Database setup script
├── DEVELOPMENT.md    # Development setup guide
└── README.md         # This file
```

## Documentation

- [Development Setup](./DEVELOPMENT.md) - Local development environment setup
- [Authentication Guide](./AUTHENTICATION_GUIDE.md) - Authentication implementation
- [Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md) - Production deployment
- [API Documentation](http://localhost:8000/docs) - Interactive API docs (when running locally)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Follow the development setup in [DEVELOPMENT.md](./DEVELOPMENT.md)
4. Make your changes and test thoroughly
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For development questions, see [DEVELOPMENT.md](./DEVELOPMENT.md) troubleshooting section.
For other inquiries, contact the development team.
