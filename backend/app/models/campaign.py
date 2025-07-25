from sqlalchemy import Column, String, Integer, DateTime, Enum, JSON, Text, ForeignKey
from sqlalchemy.orm import relationship
import enum
from app.models.base_simple import BaseModel
from app.models.lead import campaign_leads

class CampaignStatus(str, enum.Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class CampaignType(str, enum.Enum):
    EMAIL_SEQUENCE = "email_sequence"
    LINKEDIN_OUTREACH = "linkedin_outreach"
    MULTI_CHANNEL = "multi_channel"
    FOLLOW_UP = "follow_up"
    NURTURE = "nurture"

class Campaign(BaseModel):
    __tablename__ = "campaigns"
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Basic campaign information
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(CampaignStatus), default=CampaignStatus.DRAFT, nullable=False)
    type = Column(Enum(CampaignType), nullable=False)
    
    # Campaign schedule stored as JSON
    schedule = Column(JSON, default={
        "startDate": None,
        "endDate": None,
        "timezone": "UTC",
        "sendTimes": [],
        "frequency": "daily",
        "delays": []
    })
    
    # Campaign settings stored as JSON
    settings = Column(JSON, default={
        "maxEmailsPerDay": 50,
        "respectUnsubscribes": True,
        "trackOpens": True,
        "trackClicks": True,
        "autoFollowUp": True,
        "stopOnReply": True,
        "personalizeSubject": True,
        "personalizeContent": True
    })
    
    # Campaign metrics stored as JSON
    metrics = Column(JSON, default={
        "totalLeads": 0,
        "emailsSent": 0,
        "emailsDelivered": 0,
        "emailsOpened": 0,
        "emailsClicked": 0,
        "emailsReplied": 0,
        "emailsBounced": 0,
        "unsubscribes": 0,
        "conversions": 0,
        "openRate": 0.0,
        "clickRate": 0.0,
        "replyRate": 0.0,
        "conversionRate": 0.0
    })
    
    # Campaign lifecycle timestamps
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="campaigns")
    leads = relationship("Lead", secondary=campaign_leads, back_populates="campaigns")
    sequences = relationship("CampaignSequence", back_populates="campaign", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Campaign(id={self.id}, name='{self.name}', status='{self.status}')>"
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "userId": str(self.user_id),
            "name": self.name,
            "description": self.description,
            "status": self.status.value,
            "type": self.type.value,
            "leads": [str(lead.id) for lead in self.leads],
            "emailTemplates": [str(seq.email_template_id) for seq in self.sequences if seq.email_template_id],
            "schedule": self.schedule,
            "settings": self.settings,
            "metrics": self.metrics,
            "startedAt": self.started_at.isoformat() if self.started_at else None,
            "completedAt": self.completed_at.isoformat() if self.completed_at else None,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat(),
            "isActive": self.is_active
        }
