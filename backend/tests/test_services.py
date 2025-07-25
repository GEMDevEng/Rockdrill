"""
Tests for service layer functions.
"""

import pytest
from unittest.mock import Mock, patch
from sqlalchemy.orm import Session

from app.services.user_service import UserService
from app.models.user import User, UserRole, UserSubscription
from app.schemas.users import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


class TestUserService:
    """Test cases for UserService."""

    @pytest.fixture
    def user_service(self):
        """Create a UserService instance."""
        return UserService()

    @pytest.fixture
    def mock_db_session(self):
        """Create a mock database session."""
        return Mock(spec=Session)

    def test_create_user_success(self, user_service, mock_db_session):
        """Test successful user creation."""
        user_data = UserCreate(
            email="test@example.com",
            password="password123",
            full_name="Test User",
            company="Test Company"
        )
        
        # Mock the database operations
        mock_db_session.query.return_value.filter.return_value.first.return_value = None
        mock_db_session.add = Mock()
        mock_db_session.commit = Mock()
        mock_db_session.refresh = Mock()
        
        # Create a mock user object that would be returned
        mock_user = User(
            id=1,
            email=user_data.email,
            hashed_password=get_password_hash(user_data.password),
            full_name=user_data.full_name,
            company=user_data.company,
            role=UserRole.USER,
            subscription=UserSubscription.FREE,
            is_active=True
        )
        
        with patch.object(user_service, '_create_user_object', return_value=mock_user):
            result = user_service.create_user(mock_db_session, user_data)
        
        assert result.email == user_data.email
        assert result.full_name == user_data.full_name
        assert result.company == user_data.company
        mock_db_session.add.assert_called_once()
        mock_db_session.commit.assert_called_once()

    def test_create_user_duplicate_email(self, user_service, mock_db_session):
        """Test creating user with duplicate email."""
        user_data = UserCreate(
            email="existing@example.com",
            password="password123",
            full_name="Test User"
        )
        
        # Mock existing user
        existing_user = User(email=user_data.email)
        mock_db_session.query.return_value.filter.return_value.first.return_value = existing_user
        
        with pytest.raises(ValueError, match="Email already registered"):
            user_service.create_user(mock_db_session, user_data)

    def test_get_user_by_email_found(self, user_service, mock_db_session):
        """Test getting user by email when user exists."""
        email = "test@example.com"
        mock_user = User(email=email, full_name="Test User")
        mock_db_session.query.return_value.filter.return_value.first.return_value = mock_user
        
        result = user_service.get_user_by_email(mock_db_session, email)
        
        assert result == mock_user
        mock_db_session.query.assert_called_with(User)

    def test_get_user_by_email_not_found(self, user_service, mock_db_session):
        """Test getting user by email when user doesn't exist."""
        email = "nonexistent@example.com"
        mock_db_session.query.return_value.filter.return_value.first.return_value = None
        
        result = user_service.get_user_by_email(mock_db_session, email)
        
        assert result is None

    def test_get_user_by_id_found(self, user_service, mock_db_session):
        """Test getting user by ID when user exists."""
        user_id = 1
        mock_user = User(id=user_id, email="test@example.com")
        mock_db_session.query.return_value.filter.return_value.first.return_value = mock_user
        
        result = user_service.get_user_by_id(mock_db_session, user_id)
        
        assert result == mock_user

    def test_get_user_by_id_not_found(self, user_service, mock_db_session):
        """Test getting user by ID when user doesn't exist."""
        user_id = 999
        mock_db_session.query.return_value.filter.return_value.first.return_value = None
        
        result = user_service.get_user_by_id(mock_db_session, user_id)
        
        assert result is None

    def test_update_user_success(self, user_service, mock_db_session):
        """Test successful user update."""
        user_id = 1
        update_data = UserUpdate(
            full_name="Updated Name",
            company="Updated Company"
        )
        
        # Mock existing user
        mock_user = User(
            id=user_id,
            email="test@example.com",
            full_name="Original Name",
            company="Original Company"
        )
        mock_db_session.query.return_value.filter.return_value.first.return_value = mock_user
        mock_db_session.commit = Mock()
        mock_db_session.refresh = Mock()
        
        result = user_service.update_user(mock_db_session, user_id, update_data)
        
        assert result.full_name == "Updated Name"
        assert result.company == "Updated Company"
        mock_db_session.commit.assert_called_once()

    def test_update_user_not_found(self, user_service, mock_db_session):
        """Test updating non-existent user."""
        user_id = 999
        update_data = UserUpdate(full_name="Updated Name")
        
        mock_db_session.query.return_value.filter.return_value.first.return_value = None
        
        result = user_service.update_user(mock_db_session, user_id, update_data)
        
        assert result is None

    def test_authenticate_user_success(self, user_service, mock_db_session):
        """Test successful user authentication."""
        email = "test@example.com"
        password = "password123"
        hashed_password = get_password_hash(password)
        
        mock_user = User(
            email=email,
            hashed_password=hashed_password,
            is_active=True
        )
        mock_db_session.query.return_value.filter.return_value.first.return_value = mock_user
        
        result = user_service.authenticate_user(mock_db_session, email, password)
        
        assert result == mock_user

    def test_authenticate_user_wrong_password(self, user_service, mock_db_session):
        """Test authentication with wrong password."""
        email = "test@example.com"
        password = "wrongpassword"
        correct_password = "correctpassword"
        hashed_password = get_password_hash(correct_password)
        
        mock_user = User(
            email=email,
            hashed_password=hashed_password,
            is_active=True
        )
        mock_db_session.query.return_value.filter.return_value.first.return_value = mock_user
        
        result = user_service.authenticate_user(mock_db_session, email, password)
        
        assert result is None

    def test_authenticate_user_inactive(self, user_service, mock_db_session):
        """Test authentication with inactive user."""
        email = "test@example.com"
        password = "password123"
        hashed_password = get_password_hash(password)
        
        mock_user = User(
            email=email,
            hashed_password=hashed_password,
            is_active=False
        )
        mock_db_session.query.return_value.filter.return_value.first.return_value = mock_user
        
        result = user_service.authenticate_user(mock_db_session, email, password)
        
        assert result is None

    def test_authenticate_user_not_found(self, user_service, mock_db_session):
        """Test authentication with non-existent user."""
        email = "nonexistent@example.com"
        password = "password123"
        
        mock_db_session.query.return_value.filter.return_value.first.return_value = None
        
        result = user_service.authenticate_user(mock_db_session, email, password)
        
        assert result is None

    def test_deactivate_user(self, user_service, mock_db_session):
        """Test deactivating a user."""
        user_id = 1
        mock_user = User(id=user_id, is_active=True)
        mock_db_session.query.return_value.filter.return_value.first.return_value = mock_user
        mock_db_session.commit = Mock()
        
        result = user_service.deactivate_user(mock_db_session, user_id)
        
        assert result.is_active is False
        mock_db_session.commit.assert_called_once()

    def test_activate_user(self, user_service, mock_db_session):
        """Test activating a user."""
        user_id = 1
        mock_user = User(id=user_id, is_active=False)
        mock_db_session.query.return_value.filter.return_value.first.return_value = mock_user
        mock_db_session.commit = Mock()
        
        result = user_service.activate_user(mock_db_session, user_id)
        
        assert result.is_active is True
        mock_db_session.commit.assert_called_once()

    def test_get_users_list(self, user_service, mock_db_session):
        """Test getting paginated list of users."""
        mock_users = [
            User(id=1, email="user1@example.com"),
            User(id=2, email="user2@example.com"),
        ]
        
        mock_query = Mock()
        mock_query.offset.return_value.limit.return_value.all.return_value = mock_users
        mock_query.count.return_value = 2
        mock_db_session.query.return_value = mock_query
        
        result = user_service.get_users(mock_db_session, skip=0, limit=10)
        
        assert len(result) == 2
        assert result[0].email == "user1@example.com"
        assert result[1].email == "user2@example.com"
