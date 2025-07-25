"""
Tests for authentication API endpoints.
"""

import pytest
from fastapi import status


class TestAuthEndpoints:
    """Test cases for authentication endpoints."""

    def test_register_user_success(self, test_client, test_user_data):
        """Test successful user registration."""
        response = test_client.post("/api/v1/auth/register", json=test_user_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["email"] == test_user_data["email"]
        assert data["full_name"] == test_user_data["full_name"]
        assert data["company"] == test_user_data["company"]
        assert "id" in data
        assert "password" not in data
        assert "hashed_password" not in data

    def test_register_user_duplicate_email(self, test_client, test_user_data):
        """Test registration with duplicate email."""
        # Register first user
        test_client.post("/api/v1/auth/register", json=test_user_data)
        
        # Try to register with same email
        response = test_client.post("/api/v1/auth/register", json=test_user_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        data = response.json()
        assert "already registered" in data["detail"].lower()

    def test_register_user_invalid_email(self, test_client, test_user_data):
        """Test registration with invalid email."""
        test_user_data["email"] = "invalid-email"
        response = test_client.post("/api/v1/auth/register", json=test_user_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_user_missing_fields(self, test_client):
        """Test registration with missing required fields."""
        incomplete_data = {"email": "test@example.com"}
        response = test_client.post("/api/v1/auth/register", json=incomplete_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_login_success(self, test_client, test_user_data):
        """Test successful user login."""
        # First register a user
        test_client.post("/api/v1/auth/register", json=test_user_data)
        
        # Then login
        login_data = {
            "username": test_user_data["email"],
            "password": test_user_data["password"]
        }
        response = test_client.post("/api/v1/auth/login", data=login_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_credentials(self, test_client, test_user_data):
        """Test login with invalid credentials."""
        # Register a user first
        test_client.post("/api/v1/auth/register", json=test_user_data)
        
        # Try login with wrong password
        login_data = {
            "username": test_user_data["email"],
            "password": "wrongpassword"
        }
        response = test_client.post("/api/v1/auth/login", data=login_data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_nonexistent_user(self, test_client):
        """Test login with non-existent user."""
        login_data = {
            "username": "nonexistent@example.com",
            "password": "password"
        }
        response = test_client.post("/api/v1/auth/login", data=login_data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_current_user_with_token(self, test_client, test_user_data):
        """Test getting current user with valid token."""
        # Register and login
        test_client.post("/api/v1/auth/register", json=test_user_data)
        login_data = {
            "username": test_user_data["email"],
            "password": test_user_data["password"]
        }
        login_response = test_client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["access_token"]
        
        # Get current user
        headers = {"Authorization": f"Bearer {token}"}
        response = test_client.get("/api/v1/auth/me", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["email"] == test_user_data["email"]
        assert data["full_name"] == test_user_data["full_name"]

    def test_get_current_user_without_token(self, test_client):
        """Test getting current user without token."""
        response = test_client.get("/api/v1/auth/me")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_current_user_invalid_token(self, test_client):
        """Test getting current user with invalid token."""
        headers = {"Authorization": "Bearer invalid_token"}
        response = test_client.get("/api/v1/auth/me", headers=headers)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_logout(self, test_client, test_user_data):
        """Test user logout."""
        # Register and login
        test_client.post("/api/v1/auth/register", json=test_user_data)
        login_data = {
            "username": test_user_data["email"],
            "password": test_user_data["password"]
        }
        login_response = test_client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["access_token"]
        
        # Logout
        headers = {"Authorization": f"Bearer {token}"}
        response = test_client.post("/api/v1/auth/logout", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["message"] == "Successfully logged out"


class TestPasswordReset:
    """Test cases for password reset functionality."""

    def test_request_password_reset(self, test_client, test_user_data):
        """Test requesting password reset."""
        # Register a user first
        test_client.post("/api/v1/auth/register", json=test_user_data)
        
        # Request password reset
        reset_data = {"email": test_user_data["email"]}
        response = test_client.post("/api/v1/auth/password-reset-request", json=reset_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "message" in data

    def test_request_password_reset_nonexistent_email(self, test_client):
        """Test requesting password reset for non-existent email."""
        reset_data = {"email": "nonexistent@example.com"}
        response = test_client.post("/api/v1/auth/password-reset-request", json=reset_data)
        
        # Should still return 200 for security reasons
        assert response.status_code == status.HTTP_200_OK

    def test_reset_password_invalid_token(self, test_client):
        """Test resetting password with invalid token."""
        reset_data = {
            "token": "invalid_token",
            "new_password": "newpassword123"
        }
        response = test_client.post("/api/v1/auth/password-reset", json=reset_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
