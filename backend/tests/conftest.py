"""
Pytest configuration and fixtures for Rockdrill backend tests.
"""

import asyncio
import os
import tempfile
from typing import AsyncGenerator, Generator

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from httpx import AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import get_settings
from app.core.database import get_db
from app.main import app
from app.models.base_simple import BaseModel


# Test database setup
@pytest.fixture(scope="session")
def test_db_file():
    """Create a temporary database file for testing."""
    db_fd, db_path = tempfile.mkstemp(suffix=".db")
    yield db_path
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture(scope="session")
def test_engine(test_db_file):
    """Create a test database engine."""
    engine = create_engine(
        f"sqlite:///{test_db_file}",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    BaseModel.metadata.create_all(bind=engine)
    return engine


@pytest.fixture(scope="function")
def test_db_session(test_engine):
    """Create a test database session."""
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="function")
def test_client(test_db_session):
    """Create a test client with database dependency override."""
    def override_get_db():
        try:
            yield test_db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as client:
        yield client
    
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def async_client(test_db_session) -> AsyncGenerator[AsyncClient, None]:
    """Create an async test client."""
    def override_get_db():
        try:
            yield test_db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()


@pytest.fixture
def test_user_data():
    """Sample user data for testing."""
    return {
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User",
        "company": "Test Company"
    }


@pytest.fixture
def test_lead_data():
    """Sample lead data for testing."""
    return {
        "email": "lead@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "company": "Example Corp",
        "title": "CEO",
        "phone": "+1234567890",
        "linkedin_url": "https://linkedin.com/in/johndoe",
        "website": "https://example.com"
    }


@pytest.fixture
def test_campaign_data():
    """Sample campaign data for testing."""
    return {
        "name": "Test Campaign",
        "description": "A test campaign for unit testing",
        "type": "EMAIL",
        "status": "DRAFT"
    }


@pytest.fixture
def test_email_template_data():
    """Sample email template data for testing."""
    return {
        "name": "Test Template",
        "subject": "Test Subject",
        "content": "Hello {{first_name}}, this is a test email.",
        "category": "OUTREACH"
    }


# Event loop fixture for async tests
@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()
