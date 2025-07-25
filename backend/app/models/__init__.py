"""
Database models for the Rockdrill AI-Powered SDR Automation application.

This module contains all SQLAlchemy models that define the database schema.
All models inherit from BaseModel which provides common fields and functionality.
"""

from app.models.base_simple import BaseModel
from app.models.user import User, UserRole, UserSubscription
from app.models.lead import Lead, LeadStatus, LeadSource, campaign_leads
from app.models.campaign import Campaign, CampaignStatus, CampaignType
from app.models.email_template import EmailTemplate, TemplateCategory, CampaignSequence
from app.models.interaction import Interaction, InteractionType, CommunicationChannel, InteractionStatus
from app.models.integration import Integration, IntegrationType, IntegrationStatus

# Export all models and enums
__all__ = [
    # Base model
    "BaseModel",

    # User models
    "User",
    "UserRole",
    "UserSubscription",

    # Lead models
    "Lead",
    "LeadStatus",
    "LeadSource",
    "campaign_leads",

    # Campaign models
    "Campaign",
    "CampaignStatus",
    "CampaignType",

    # Email template models
    "EmailTemplate",
    "TemplateCategory",
    "CampaignSequence",

    # Interaction models
    "Interaction",
    "InteractionType",
    "CommunicationChannel",
    "InteractionStatus",

    # Integration models
    "Integration",
    "IntegrationType",
    "IntegrationStatus",
]
