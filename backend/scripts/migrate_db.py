#!/usr/bin/env python3
"""
Database migration script for Rockdrill production deployment.

This script handles:
1. Database initialization
2. Running Alembic migrations
3. Data seeding for production
4. Health checks
"""

import os
import sys
import logging
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from alembic.config import Config
from alembic import command
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.core.database import Base, engine
from app.models import *  # Import all models

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def check_database_connection():
    """Check if database is accessible"""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("✅ Database connection successful")
        return True
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        return False


def run_migrations():
    """Run Alembic migrations"""
    try:
        # Configure Alembic
        alembic_cfg = Config(str(backend_dir / "alembic.ini"))
        alembic_cfg.set_main_option("script_location", str(backend_dir / "alembic"))
        alembic_cfg.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
        
        # Run migrations
        logger.info("🔄 Running database migrations...")
        command.upgrade(alembic_cfg, "head")
        logger.info("✅ Database migrations completed successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Migration failed: {e}")
        return False


def create_initial_data():
    """Create initial data for production"""
    try:
        from sqlalchemy.orm import sessionmaker
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        logger.info("🌱 Creating initial production data...")
        
        # Check if data already exists
        from app.models.user import User
        existing_users = db.query(User).count()
        
        if existing_users == 0:
            # Create admin user if none exists
            from app.core.security import get_password_hash
            from app.models.user import UserRole, UserSubscription
            
            admin_user = User(
                email="admin@rockdrill.com",
                hashed_password=get_password_hash("admin123!"),
                first_name="Admin",
                last_name="User",
                role=UserRole.ADMIN,
                subscription=UserSubscription.ENTERPRISE,
                is_active=True,
                is_verified=True
            )
            db.add(admin_user)
            
            # Create default email templates
            from app.models.email_template import EmailTemplate, TemplateCategory
            
            default_templates = [
                {
                    "name": "Cold Outreach Template",
                    "subject": "Quick question about {{company}}",
                    "content": """Hi {{first_name}},

I noticed {{company}} is doing great work in {{industry}}. I'd love to learn more about your current challenges with {{pain_point}}.

Would you be open to a brief 15-minute call this week?

Best regards,
{{sender_name}}""",
                    "category": TemplateCategory.COLD_OUTREACH,
                    "variables": ["first_name", "company", "industry", "pain_point", "sender_name"]
                },
                {
                    "name": "Follow-up Template",
                    "subject": "Following up on our conversation",
                    "content": """Hi {{first_name}},

Thanks for taking the time to speak with me about {{topic}}. As discussed, I'm attaching some resources that might be helpful for {{company}}.

Let me know if you'd like to schedule a follow-up call.

Best regards,
{{sender_name}}""",
                    "category": TemplateCategory.FOLLOW_UP,
                    "variables": ["first_name", "topic", "company", "sender_name"]
                }
            ]
            
            for template_data in default_templates:
                template = EmailTemplate(**template_data)
                db.add(template)
            
            db.commit()
            logger.info("✅ Initial production data created successfully")
        else:
            logger.info("ℹ️ Production data already exists, skipping creation")
        
        db.close()
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to create initial data: {e}")
        if 'db' in locals():
            db.rollback()
            db.close()
        return False


def verify_deployment():
    """Verify that the deployment was successful"""
    try:
        logger.info("🔍 Verifying deployment...")
        
        # Check database tables
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        expected_tables = ['users', 'leads', 'campaigns', 'email_templates', 'interactions', 'integrations']
        missing_tables = [table for table in expected_tables if table not in tables]
        
        if missing_tables:
            logger.error(f"❌ Missing tables: {missing_tables}")
            return False
        
        logger.info(f"✅ All expected tables present: {len(tables)} tables found")
        
        # Check if we can query basic data
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        from app.models.user import User
        user_count = db.query(User).count()
        logger.info(f"✅ Database verification complete: {user_count} users found")
        
        db.close()
        return True
        
    except Exception as e:
        logger.error(f"❌ Deployment verification failed: {e}")
        return False


def main():
    """Main migration function"""
    logger.info("🚀 Starting Rockdrill database migration...")
    
    # Check environment
    if settings.ENVIRONMENT not in ['staging', 'production']:
        logger.warning(f"⚠️ Running migrations in {settings.ENVIRONMENT} environment")
    
    # Step 1: Check database connection
    if not check_database_connection():
        sys.exit(1)
    
    # Step 2: Run migrations
    if not run_migrations():
        sys.exit(1)
    
    # Step 3: Create initial data (only for production)
    if settings.ENVIRONMENT in ['production', 'staging']:
        if not create_initial_data():
            sys.exit(1)
    
    # Step 4: Verify deployment
    if not verify_deployment():
        sys.exit(1)
    
    logger.info("🎉 Database migration completed successfully!")


if __name__ == "__main__":
    main()
