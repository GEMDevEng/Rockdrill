"""
Integration tests for API endpoints with database.
"""

import pytest
from fastapi import status
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.lead import Lead
from app.models.campaign import Campaign


class TestUserAPIIntegration:
    """Integration tests for user-related API endpoints."""

    def test_user_registration_and_login_flow(self, test_client, test_user_data):
        """Test complete user registration and login flow."""
        # Register user
        register_response = test_client.post("/api/v1/auth/register", json=test_user_data)
        assert register_response.status_code == status.HTTP_201_CREATED
        
        user_data = register_response.json()
        assert user_data["email"] == test_user_data["email"]
        assert user_data["full_name"] == test_user_data["full_name"]
        
        # Login with registered user
        login_data = {
            "username": test_user_data["email"],
            "password": test_user_data["password"]
        }
        login_response = test_client.post("/api/v1/auth/login", data=login_data)
        assert login_response.status_code == status.HTTP_200_OK
        
        token_data = login_response.json()
        assert "access_token" in token_data
        assert token_data["token_type"] == "bearer"
        
        # Use token to access protected endpoint
        headers = {"Authorization": f"Bearer {token_data['access_token']}"}
        me_response = test_client.get("/api/v1/auth/me", headers=headers)
        assert me_response.status_code == status.HTTP_200_OK
        
        me_data = me_response.json()
        assert me_data["email"] == test_user_data["email"]

    def test_user_profile_update_flow(self, test_client, test_user_data):
        """Test user profile update flow."""
        # Register and login
        test_client.post("/api/v1/auth/register", json=test_user_data)
        login_data = {
            "username": test_user_data["email"],
            "password": test_user_data["password"]
        }
        login_response = test_client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Update profile
        update_data = {
            "full_name": "Updated Name",
            "company": "Updated Company"
        }
        update_response = test_client.put("/api/v1/users/me", json=update_data, headers=headers)
        assert update_response.status_code == status.HTTP_200_OK
        
        updated_user = update_response.json()
        assert updated_user["full_name"] == "Updated Name"
        assert updated_user["company"] == "Updated Company"


class TestLeadAPIIntegration:
    """Integration tests for lead-related API endpoints."""

    @pytest.fixture
    def authenticated_headers(self, test_client, test_user_data):
        """Get authentication headers for API requests."""
        test_client.post("/api/v1/auth/register", json=test_user_data)
        login_data = {
            "username": test_user_data["email"],
            "password": test_user_data["password"]
        }
        login_response = test_client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

    def test_lead_crud_operations(self, test_client, authenticated_headers, test_lead_data):
        """Test complete CRUD operations for leads."""
        # Create lead
        create_response = test_client.post(
            "/api/v1/leads/", 
            json=test_lead_data, 
            headers=authenticated_headers
        )
        assert create_response.status_code == status.HTTP_201_CREATED
        
        lead = create_response.json()
        lead_id = lead["id"]
        assert lead["email"] == test_lead_data["email"]
        assert lead["first_name"] == test_lead_data["first_name"]
        
        # Read lead
        get_response = test_client.get(f"/api/v1/leads/{lead_id}", headers=authenticated_headers)
        assert get_response.status_code == status.HTTP_200_OK
        
        retrieved_lead = get_response.json()
        assert retrieved_lead["id"] == lead_id
        assert retrieved_lead["email"] == test_lead_data["email"]
        
        # Update lead
        update_data = {
            "first_name": "Updated",
            "last_name": "Name",
            "title": "Updated Title"
        }
        update_response = test_client.put(
            f"/api/v1/leads/{lead_id}", 
            json=update_data, 
            headers=authenticated_headers
        )
        assert update_response.status_code == status.HTTP_200_OK
        
        updated_lead = update_response.json()
        assert updated_lead["first_name"] == "Updated"
        assert updated_lead["last_name"] == "Name"
        assert updated_lead["title"] == "Updated Title"
        
        # Delete lead
        delete_response = test_client.delete(f"/api/v1/leads/{lead_id}", headers=authenticated_headers)
        assert delete_response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify deletion
        get_deleted_response = test_client.get(f"/api/v1/leads/{lead_id}", headers=authenticated_headers)
        assert get_deleted_response.status_code == status.HTTP_404_NOT_FOUND

    def test_lead_search_and_filtering(self, test_client, authenticated_headers, test_lead_data):
        """Test lead search and filtering functionality."""
        # Create multiple leads
        leads_data = [
            {**test_lead_data, "email": "john@acme.com", "first_name": "John", "company": "Acme Corp"},
            {**test_lead_data, "email": "jane@beta.com", "first_name": "Jane", "company": "Beta Inc"},
            {**test_lead_data, "email": "bob@acme.com", "first_name": "Bob", "company": "Acme Corp"},
        ]
        
        for lead_data in leads_data:
            test_client.post("/api/v1/leads/", json=lead_data, headers=authenticated_headers)
        
        # Test search by company
        search_response = test_client.get(
            "/api/v1/leads/?search=Acme", 
            headers=authenticated_headers
        )
        assert search_response.status_code == status.HTTP_200_OK
        
        search_results = search_response.json()
        assert len(search_results["items"]) == 2
        for item in search_results["items"]:
            assert "Acme" in item["company"]
        
        # Test pagination
        paginated_response = test_client.get(
            "/api/v1/leads/?page=1&size=2", 
            headers=authenticated_headers
        )
        assert paginated_response.status_code == status.HTTP_200_OK
        
        paginated_results = paginated_response.json()
        assert len(paginated_results["items"]) == 2
        assert paginated_results["total"] == 3
        assert paginated_results["page"] == 1
        assert paginated_results["size"] == 2


class TestCampaignAPIIntegration:
    """Integration tests for campaign-related API endpoints."""

    @pytest.fixture
    def authenticated_headers(self, test_client, test_user_data):
        """Get authentication headers for API requests."""
        test_client.post("/api/v1/auth/register", json=test_user_data)
        login_data = {
            "username": test_user_data["email"],
            "password": test_user_data["password"]
        }
        login_response = test_client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

    def test_campaign_with_leads_integration(self, test_client, authenticated_headers, test_campaign_data, test_lead_data):
        """Test campaign creation and lead association."""
        # Create campaign
        campaign_response = test_client.post(
            "/api/v1/campaigns/", 
            json=test_campaign_data, 
            headers=authenticated_headers
        )
        assert campaign_response.status_code == status.HTTP_201_CREATED
        campaign_id = campaign_response.json()["id"]
        
        # Create leads
        lead_ids = []
        for i in range(2):
            lead_data = test_lead_data.copy()
            lead_data["email"] = f"lead{i}@example.com"
            lead_response = test_client.post(
                "/api/v1/leads/", 
                json=lead_data, 
                headers=authenticated_headers
            )
            lead_ids.append(lead_response.json()["id"])
        
        # Add leads to campaign
        add_leads_response = test_client.post(
            f"/api/v1/campaigns/{campaign_id}/leads",
            json={"lead_ids": lead_ids},
            headers=authenticated_headers
        )
        assert add_leads_response.status_code == status.HTTP_200_OK
        
        # Get campaign leads
        campaign_leads_response = test_client.get(
            f"/api/v1/campaigns/{campaign_id}/leads",
            headers=authenticated_headers
        )
        assert campaign_leads_response.status_code == status.HTTP_200_OK
        
        campaign_leads = campaign_leads_response.json()
        assert len(campaign_leads["items"]) == 2
        
        # Remove one lead from campaign
        remove_leads_response = test_client.delete(
            f"/api/v1/campaigns/{campaign_id}/leads",
            json={"lead_ids": [lead_ids[0]]},
            headers=authenticated_headers
        )
        assert remove_leads_response.status_code == status.HTTP_200_OK
        
        # Verify lead removal
        updated_campaign_leads_response = test_client.get(
            f"/api/v1/campaigns/{campaign_id}/leads",
            headers=authenticated_headers
        )
        updated_campaign_leads = updated_campaign_leads_response.json()
        assert len(updated_campaign_leads["items"]) == 1

    def test_campaign_status_transitions(self, test_client, authenticated_headers, test_campaign_data):
        """Test campaign status transitions."""
        # Create campaign
        campaign_response = test_client.post(
            "/api/v1/campaigns/", 
            json=test_campaign_data, 
            headers=authenticated_headers
        )
        campaign_id = campaign_response.json()["id"]
        
        # Start campaign
        start_response = test_client.post(
            f"/api/v1/campaigns/{campaign_id}/start",
            headers=authenticated_headers
        )
        assert start_response.status_code == status.HTTP_200_OK
        assert start_response.json()["status"] == "ACTIVE"
        
        # Pause campaign
        pause_response = test_client.post(
            f"/api/v1/campaigns/{campaign_id}/pause",
            headers=authenticated_headers
        )
        assert pause_response.status_code == status.HTTP_200_OK
        assert pause_response.json()["status"] == "PAUSED"
        
        # Resume campaign
        resume_response = test_client.post(
            f"/api/v1/campaigns/{campaign_id}/start",
            headers=authenticated_headers
        )
        assert resume_response.status_code == status.HTTP_200_OK
        assert resume_response.json()["status"] == "ACTIVE"
        
        # Stop campaign
        stop_response = test_client.post(
            f"/api/v1/campaigns/{campaign_id}/stop",
            headers=authenticated_headers
        )
        assert stop_response.status_code == status.HTTP_200_OK
        assert stop_response.json()["status"] == "COMPLETED"


class TestDatabaseIntegration:
    """Integration tests for database operations."""

    def test_database_constraints_and_relationships(self, test_db_session, test_user_data, test_lead_data):
        """Test database constraints and relationships."""
        # Create user
        user = User(
            email=test_user_data["email"],
            hashed_password="hashed_password",
            full_name=test_user_data["full_name"],
            company=test_user_data["company"]
        )
        test_db_session.add(user)
        test_db_session.commit()
        
        # Create lead associated with user
        lead = Lead(
            email=test_lead_data["email"],
            first_name=test_lead_data["first_name"],
            last_name=test_lead_data["last_name"],
            company=test_lead_data["company"],
            owner_id=user.id
        )
        test_db_session.add(lead)
        test_db_session.commit()
        
        # Verify relationship
        assert lead.owner == user
        assert lead in user.leads
        
        # Test cascade deletion
        test_db_session.delete(user)
        test_db_session.commit()
        
        # Lead should still exist but with null owner_id
        remaining_lead = test_db_session.query(Lead).filter(Lead.id == lead.id).first()
        assert remaining_lead is not None
        assert remaining_lead.owner_id is None
