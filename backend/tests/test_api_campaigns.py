"""
Tests for campaigns API endpoints.
"""

import pytest
from fastapi import status


class TestCampaignsEndpoints:
    """Test cases for campaigns API endpoints."""

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

    def test_create_campaign_success(self, authenticated_client, test_campaign_data):
        """Test successful campaign creation."""
        response = authenticated_client.post("/api/v1/campaigns/", json=test_campaign_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == test_campaign_data["name"]
        assert data["description"] == test_campaign_data["description"]
        assert data["type"] == test_campaign_data["type"]
        assert data["status"] == test_campaign_data["status"]
        assert "id" in data
        assert "created_at" in data

    def test_create_campaign_missing_required_fields(self, authenticated_client):
        """Test creating campaign with missing required fields."""
        incomplete_data = {"description": "Missing name"}
        response = authenticated_client.post("/api/v1/campaigns/", json=incomplete_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_get_campaigns_list(self, authenticated_client, test_campaign_data):
        """Test getting list of campaigns."""
        # Create a few campaigns
        for i in range(3):
            campaign_data = test_campaign_data.copy()
            campaign_data["name"] = f"Campaign {i}"
            authenticated_client.post("/api/v1/campaigns/", json=campaign_data)
        
        response = authenticated_client.get("/api/v1/campaigns/")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["items"]) == 3
        assert data["total"] == 3

    def test_get_campaign_by_id(self, authenticated_client, test_campaign_data):
        """Test getting a specific campaign by ID."""
        # Create a campaign
        create_response = authenticated_client.post("/api/v1/campaigns/", json=test_campaign_data)
        campaign_id = create_response.json()["id"]
        
        # Get the campaign
        response = authenticated_client.get(f"/api/v1/campaigns/{campaign_id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == campaign_id
        assert data["name"] == test_campaign_data["name"]

    def test_get_campaign_by_id_not_found(self, authenticated_client):
        """Test getting a non-existent campaign."""
        response = authenticated_client.get("/api/v1/campaigns/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_campaign(self, authenticated_client, test_campaign_data):
        """Test updating a campaign."""
        # Create a campaign
        create_response = authenticated_client.post("/api/v1/campaigns/", json=test_campaign_data)
        campaign_id = create_response.json()["id"]
        
        # Update the campaign
        update_data = {
            "name": "Updated Campaign",
            "description": "Updated description",
            "status": "ACTIVE"
        }
        response = authenticated_client.put(f"/api/v1/campaigns/{campaign_id}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "Updated Campaign"
        assert data["description"] == "Updated description"
        assert data["status"] == "ACTIVE"

    def test_update_campaign_not_found(self, authenticated_client):
        """Test updating a non-existent campaign."""
        update_data = {"name": "Updated"}
        response = authenticated_client.put("/api/v1/campaigns/999", json=update_data)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_campaign(self, authenticated_client, test_campaign_data):
        """Test deleting a campaign."""
        # Create a campaign
        create_response = authenticated_client.post("/api/v1/campaigns/", json=test_campaign_data)
        campaign_id = create_response.json()["id"]
        
        # Delete the campaign
        response = authenticated_client.delete(f"/api/v1/campaigns/{campaign_id}")
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify campaign is deleted
        get_response = authenticated_client.get(f"/api/v1/campaigns/{campaign_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_add_leads_to_campaign(self, authenticated_client, test_campaign_data, test_lead_data):
        """Test adding leads to a campaign."""
        # Create a campaign
        campaign_response = authenticated_client.post("/api/v1/campaigns/", json=test_campaign_data)
        campaign_id = campaign_response.json()["id"]
        
        # Create a lead
        lead_response = authenticated_client.post("/api/v1/leads/", json=test_lead_data)
        lead_id = lead_response.json()["id"]
        
        # Add lead to campaign
        response = authenticated_client.post(
            f"/api/v1/campaigns/{campaign_id}/leads",
            json={"lead_ids": [lead_id]}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "message" in data

    def test_remove_leads_from_campaign(self, authenticated_client, test_campaign_data, test_lead_data):
        """Test removing leads from a campaign."""
        # Create a campaign
        campaign_response = authenticated_client.post("/api/v1/campaigns/", json=test_campaign_data)
        campaign_id = campaign_response.json()["id"]
        
        # Create a lead
        lead_response = authenticated_client.post("/api/v1/leads/", json=test_lead_data)
        lead_id = lead_response.json()["id"]
        
        # Add lead to campaign first
        authenticated_client.post(
            f"/api/v1/campaigns/{campaign_id}/leads",
            json={"lead_ids": [lead_id]}
        )
        
        # Remove lead from campaign
        response = authenticated_client.delete(
            f"/api/v1/campaigns/{campaign_id}/leads",
            json={"lead_ids": [lead_id]}
        )
        
        assert response.status_code == status.HTTP_200_OK

    def test_get_campaign_leads(self, authenticated_client, test_campaign_data, test_lead_data):
        """Test getting leads associated with a campaign."""
        # Create a campaign
        campaign_response = authenticated_client.post("/api/v1/campaigns/", json=test_campaign_data)
        campaign_id = campaign_response.json()["id"]
        
        # Create leads
        lead_ids = []
        for i in range(2):
            lead_data = test_lead_data.copy()
            lead_data["email"] = f"lead{i}@example.com"
            lead_response = authenticated_client.post("/api/v1/leads/", json=lead_data)
            lead_ids.append(lead_response.json()["id"])
        
        # Add leads to campaign
        authenticated_client.post(
            f"/api/v1/campaigns/{campaign_id}/leads",
            json={"lead_ids": lead_ids}
        )
        
        # Get campaign leads
        response = authenticated_client.get(f"/api/v1/campaigns/{campaign_id}/leads")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["items"]) == 2

    def test_start_campaign(self, authenticated_client, test_campaign_data):
        """Test starting a campaign."""
        # Create a campaign
        create_response = authenticated_client.post("/api/v1/campaigns/", json=test_campaign_data)
        campaign_id = create_response.json()["id"]
        
        # Start the campaign
        response = authenticated_client.post(f"/api/v1/campaigns/{campaign_id}/start")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "ACTIVE"

    def test_pause_campaign(self, authenticated_client, test_campaign_data):
        """Test pausing a campaign."""
        # Create and start a campaign
        create_response = authenticated_client.post("/api/v1/campaigns/", json=test_campaign_data)
        campaign_id = create_response.json()["id"]
        authenticated_client.post(f"/api/v1/campaigns/{campaign_id}/start")
        
        # Pause the campaign
        response = authenticated_client.post(f"/api/v1/campaigns/{campaign_id}/pause")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "PAUSED"

    def test_stop_campaign(self, authenticated_client, test_campaign_data):
        """Test stopping a campaign."""
        # Create and start a campaign
        create_response = authenticated_client.post("/api/v1/campaigns/", json=test_campaign_data)
        campaign_id = create_response.json()["id"]
        authenticated_client.post(f"/api/v1/campaigns/{campaign_id}/start")
        
        # Stop the campaign
        response = authenticated_client.post(f"/api/v1/campaigns/{campaign_id}/stop")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "COMPLETED"

    def test_campaigns_unauthorized_access(self, test_client, test_campaign_data):
        """Test accessing campaigns endpoints without authentication."""
        response = test_client.get("/api/v1/campaigns/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        
        response = test_client.post("/api/v1/campaigns/", json=test_campaign_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
