"""
Unit tests for SQLAlchemy models.
"""

import pytest
from datetime import datetime
from sqlalchemy.exc import IntegrityError

from app.models.user import User, UserRole, UserSubscription
from app.models.lead import Lead, LeadStatus, LeadSource
from app.models.campaign import Campaign, CampaignStatus, CampaignType
from app.models.email_template import EmailTemplate, TemplateCategory
from app.models.interaction import Interaction, InteractionType, CommunicationChannel
from app.models.integration import Integration, IntegrationType, IntegrationStatus


class TestUserModel:
    """Test cases for User model."""

    def test_create_user(self, test_db_session):
        """Test creating a new user."""
        user = User(
            email="test@example.com",
            hashed_password="hashed_password",
            full_name="Test User",
            company="Test Company",
            role=UserRole.USER,
            subscription=UserSubscription.FREE
        )
        test_db_session.add(user)
        test_db_session.commit()
        
        assert user.id is not None
        assert user.email == "test@example.com"
        assert user.full_name == "Test User"
        assert user.company == "Test Company"
        assert user.role == UserRole.USER
        assert user.subscription == UserSubscription.FREE
        assert user.is_active is True
        assert user.created_at is not None

    def test_user_email_unique_constraint(self, test_db_session):
        """Test that user email must be unique."""
        user1 = User(
            email="duplicate@example.com",
            hashed_password="password1",
            full_name="User One"
        )
        user2 = User(
            email="duplicate@example.com",
            hashed_password="password2",
            full_name="User Two"
        )
        
        test_db_session.add(user1)
        test_db_session.commit()
        
        test_db_session.add(user2)
        with pytest.raises(IntegrityError):
            test_db_session.commit()

    def test_user_str_representation(self, test_db_session):
        """Test user string representation."""
        user = User(
            email="test@example.com",
            hashed_password="hashed_password",
            full_name="Test User"
        )
        test_db_session.add(user)
        test_db_session.commit()
        
        assert str(user) == "Test User (test@example.com)"


class TestLeadModel:
    """Test cases for Lead model."""

    def test_create_lead(self, test_db_session):
        """Test creating a new lead."""
        # First create a user
        user = User(
            email="owner@example.com",
            hashed_password="password",
            full_name="Owner"
        )
        test_db_session.add(user)
        test_db_session.commit()
        
        lead = Lead(
            email="lead@example.com",
            first_name="John",
            last_name="Doe",
            company="Example Corp",
            title="CEO",
            phone="+1234567890",
            linkedin_url="https://linkedin.com/in/johndoe",
            website="https://example.com",
            status=LeadStatus.NEW,
            source=LeadSource.MANUAL,
            owner_id=user.id
        )
        test_db_session.add(lead)
        test_db_session.commit()
        
        assert lead.id is not None
        assert lead.email == "lead@example.com"
        assert lead.first_name == "John"
        assert lead.last_name == "Doe"
        assert lead.company == "Example Corp"
        assert lead.status == LeadStatus.NEW
        assert lead.source == LeadSource.MANUAL
        assert lead.owner_id == user.id

    def test_lead_full_name_property(self, test_db_session):
        """Test lead full_name property."""
        user = User(email="owner@example.com", hashed_password="password", full_name="Owner")
        test_db_session.add(user)
        test_db_session.commit()
        
        lead = Lead(
            email="lead@example.com",
            first_name="John",
            last_name="Doe",
            owner_id=user.id
        )
        test_db_session.add(lead)
        test_db_session.commit()
        
        assert lead.full_name == "John Doe"

    def test_lead_email_unique_constraint(self, test_db_session):
        """Test that lead email must be unique."""
        user = User(email="owner@example.com", hashed_password="password", full_name="Owner")
        test_db_session.add(user)
        test_db_session.commit()
        
        lead1 = Lead(
            email="duplicate@example.com",
            first_name="John",
            last_name="Doe",
            owner_id=user.id
        )
        lead2 = Lead(
            email="duplicate@example.com",
            first_name="Jane",
            last_name="Smith",
            owner_id=user.id
        )
        
        test_db_session.add(lead1)
        test_db_session.commit()
        
        test_db_session.add(lead2)
        with pytest.raises(IntegrityError):
            test_db_session.commit()


class TestCampaignModel:
    """Test cases for Campaign model."""

    def test_create_campaign(self, test_db_session):
        """Test creating a new campaign."""
        user = User(email="owner@example.com", hashed_password="password", full_name="Owner")
        test_db_session.add(user)
        test_db_session.commit()
        
        campaign = Campaign(
            name="Test Campaign",
            description="A test campaign",
            type=CampaignType.EMAIL,
            status=CampaignStatus.DRAFT,
            owner_id=user.id
        )
        test_db_session.add(campaign)
        test_db_session.commit()
        
        assert campaign.id is not None
        assert campaign.name == "Test Campaign"
        assert campaign.description == "A test campaign"
        assert campaign.type == CampaignType.EMAIL
        assert campaign.status == CampaignStatus.DRAFT
        assert campaign.owner_id == user.id


class TestEmailTemplateModel:
    """Test cases for EmailTemplate model."""

    def test_create_email_template(self, test_db_session):
        """Test creating a new email template."""
        user = User(email="owner@example.com", hashed_password="password", full_name="Owner")
        test_db_session.add(user)
        test_db_session.commit()
        
        template = EmailTemplate(
            name="Test Template",
            subject="Test Subject",
            content="Hello {{first_name}}, this is a test.",
            category=TemplateCategory.OUTREACH,
            owner_id=user.id
        )
        test_db_session.add(template)
        test_db_session.commit()
        
        assert template.id is not None
        assert template.name == "Test Template"
        assert template.subject == "Test Subject"
        assert template.content == "Hello {{first_name}}, this is a test."
        assert template.category == TemplateCategory.OUTREACH
        assert template.owner_id == user.id


class TestInteractionModel:
    """Test cases for Interaction model."""

    def test_create_interaction(self, test_db_session):
        """Test creating a new interaction."""
        user = User(email="owner@example.com", hashed_password="password", full_name="Owner")
        test_db_session.add(user)
        test_db_session.commit()
        
        lead = Lead(
            email="lead@example.com",
            first_name="John",
            last_name="Doe",
            owner_id=user.id
        )
        test_db_session.add(lead)
        test_db_session.commit()
        
        interaction = Interaction(
            type=InteractionType.EMAIL_SENT,
            channel=CommunicationChannel.EMAIL,
            content="Test email content",
            lead_id=lead.id,
            user_id=user.id
        )
        test_db_session.add(interaction)
        test_db_session.commit()
        
        assert interaction.id is not None
        assert interaction.type == InteractionType.EMAIL_SENT
        assert interaction.channel == CommunicationChannel.EMAIL
        assert interaction.content == "Test email content"
        assert interaction.lead_id == lead.id
        assert interaction.user_id == user.id


class TestIntegrationModel:
    """Test cases for Integration model."""

    def test_create_integration(self, test_db_session):
        """Test creating a new integration."""
        user = User(email="owner@example.com", hashed_password="password", full_name="Owner")
        test_db_session.add(user)
        test_db_session.commit()
        
        integration = Integration(
            name="Test Integration",
            type=IntegrationType.CRM,
            status=IntegrationStatus.ACTIVE,
            config={"api_key": "test_key"},
            owner_id=user.id
        )
        test_db_session.add(integration)
        test_db_session.commit()
        
        assert integration.id is not None
        assert integration.name == "Test Integration"
        assert integration.type == IntegrationType.CRM
        assert integration.status == IntegrationStatus.ACTIVE
        assert integration.config == {"api_key": "test_key"}
        assert integration.owner_id == user.id
