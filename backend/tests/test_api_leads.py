"""
Tests for leads API endpoints.
"""

import pytest
from fastapi import status


class TestLeadsEndpoints:
    """Test cases for leads API endpoints."""

    @pytest.fixture
    def authenticated_client(self, test_client, test_user_data):
        """Create an authenticated test client."""
        # Register and login
        test_client.post("/api/v1/auth/register", json=test_user_data)
        login_data = {
            "username": test_user_data["email"],
            "password": test_user_data["password"]
        }
        login_response = test_client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["access_token"]
        
        # Return client with auth headers
        class AuthenticatedClient:
            def __init__(self, client, token):
                self.client = client
                self.headers = {"Authorization": f"Bearer {token}"}
            
            def get(self, url, **kwargs):
                kwargs.setdefault("headers", {}).update(self.headers)
                return self.client.get(url, **kwargs)
            
            def post(self, url, **kwargs):
                kwargs.setdefault("headers", {}).update(self.headers)
                return self.client.post(url, **kwargs)
            
            def put(self, url, **kwargs):
                kwargs.setdefault("headers", {}).update(self.headers)
                return self.client.put(url, **kwargs)
            
            def delete(self, url, **kwargs):
                kwargs.setdefault("headers", {}).update(self.headers)
                return self.client.delete(url, **kwargs)
        
        return AuthenticatedClient(test_client, token)

    def test_create_lead_success(self, authenticated_client, test_lead_data):
        """Test successful lead creation."""
        response = authenticated_client.post("/api/v1/leads/", json=test_lead_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["email"] == test_lead_data["email"]
        assert data["first_name"] == test_lead_data["first_name"]
        assert data["last_name"] == test_lead_data["last_name"]
        assert data["company"] == test_lead_data["company"]
        assert "id" in data
        assert "created_at" in data

    def test_create_lead_duplicate_email(self, authenticated_client, test_lead_data):
        """Test creating lead with duplicate email."""
        # Create first lead
        authenticated_client.post("/api/v1/leads/", json=test_lead_data)
        
        # Try to create another lead with same email
        response = authenticated_client.post("/api/v1/leads/", json=test_lead_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        data = response.json()
        assert "already exists" in data["detail"].lower()

    def test_create_lead_invalid_email(self, authenticated_client, test_lead_data):
        """Test creating lead with invalid email."""
        test_lead_data["email"] = "invalid-email"
        response = authenticated_client.post("/api/v1/leads/", json=test_lead_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_lead_missing_required_fields(self, authenticated_client):
        """Test creating lead with missing required fields."""
        incomplete_data = {"first_name": "John"}
        response = authenticated_client.post("/api/v1/leads/", json=incomplete_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_get_leads_list(self, authenticated_client, test_lead_data):
        """Test getting list of leads."""
        # Create a few leads
        for i in range(3):
            lead_data = test_lead_data.copy()
            lead_data["email"] = f"lead{i}@example.com"
            lead_data["first_name"] = f"Lead{i}"
            authenticated_client.post("/api/v1/leads/", json=lead_data)
        
        response = authenticated_client.get("/api/v1/leads/")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["items"]) == 3
        assert data["total"] == 3
        assert "page" in data
        assert "size" in data

    def test_get_leads_list_with_pagination(self, authenticated_client, test_lead_data):
        """Test getting leads list with pagination."""
        # Create 5 leads
        for i in range(5):
            lead_data = test_lead_data.copy()
            lead_data["email"] = f"lead{i}@example.com"
            authenticated_client.post("/api/v1/leads/", json=lead_data)
        
        # Get first page with size 2
        response = authenticated_client.get("/api/v1/leads/?page=1&size=2")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["items"]) == 2
        assert data["total"] == 5
        assert data["page"] == 1
        assert data["size"] == 2

    def test_get_lead_by_id(self, authenticated_client, test_lead_data):
        """Test getting a specific lead by ID."""
        # Create a lead
        create_response = authenticated_client.post("/api/v1/leads/", json=test_lead_data)
        lead_id = create_response.json()["id"]
        
        # Get the lead
        response = authenticated_client.get(f"/api/v1/leads/{lead_id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == lead_id
        assert data["email"] == test_lead_data["email"]

    def test_get_lead_by_id_not_found(self, authenticated_client):
        """Test getting a non-existent lead."""
        response = authenticated_client.get("/api/v1/leads/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_lead(self, authenticated_client, test_lead_data):
        """Test updating a lead."""
        # Create a lead
        create_response = authenticated_client.post("/api/v1/leads/", json=test_lead_data)
        lead_id = create_response.json()["id"]
        
        # Update the lead
        update_data = {
            "first_name": "Updated",
            "last_name": "Name",
            "title": "Updated Title"
        }
        response = authenticated_client.put(f"/api/v1/leads/{lead_id}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["first_name"] == "Updated"
        assert data["last_name"] == "Name"
        assert data["title"] == "Updated Title"
        assert data["email"] == test_lead_data["email"]  # Should remain unchanged

    def test_update_lead_not_found(self, authenticated_client):
        """Test updating a non-existent lead."""
        update_data = {"first_name": "Updated"}
        response = authenticated_client.put("/api/v1/leads/999", json=update_data)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_lead(self, authenticated_client, test_lead_data):
        """Test deleting a lead."""
        # Create a lead
        create_response = authenticated_client.post("/api/v1/leads/", json=test_lead_data)
        lead_id = create_response.json()["id"]
        
        # Delete the lead
        response = authenticated_client.delete(f"/api/v1/leads/{lead_id}")
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify lead is deleted
        get_response = authenticated_client.get(f"/api/v1/leads/{lead_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_lead_not_found(self, authenticated_client):
        """Test deleting a non-existent lead."""
        response = authenticated_client.delete("/api/v1/leads/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_search_leads(self, authenticated_client, test_lead_data):
        """Test searching leads."""
        # Create leads with different data
        leads_data = [
            {**test_lead_data, "email": "john@acme.com", "first_name": "John", "company": "Acme Corp"},
            {**test_lead_data, "email": "jane@beta.com", "first_name": "Jane", "company": "Beta Inc"},
            {**test_lead_data, "email": "bob@acme.com", "first_name": "Bob", "company": "Acme Corp"},
        ]
        
        for lead_data in leads_data:
            authenticated_client.post("/api/v1/leads/", json=lead_data)
        
        # Search by company
        response = authenticated_client.get("/api/v1/leads/?search=Acme")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["items"]) == 2
        for item in data["items"]:
            assert "Acme" in item["company"]

    def test_filter_leads_by_status(self, authenticated_client, test_lead_data):
        """Test filtering leads by status."""
        # Create leads with different statuses
        lead1_data = {**test_lead_data, "email": "lead1@example.com", "status": "NEW"}
        lead2_data = {**test_lead_data, "email": "lead2@example.com", "status": "CONTACTED"}
        
        authenticated_client.post("/api/v1/leads/", json=lead1_data)
        authenticated_client.post("/api/v1/leads/", json=lead2_data)
        
        # Filter by status
        response = authenticated_client.get("/api/v1/leads/?status=NEW")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["items"]) == 1
        assert data["items"][0]["status"] == "NEW"

    def test_leads_unauthorized_access(self, test_client, test_lead_data):
        """Test accessing leads endpoints without authentication."""
        response = test_client.get("/api/v1/leads/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        
        response = test_client.post("/api/v1/leads/", json=test_lead_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
