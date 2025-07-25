from sqlalchemy import Column, String, Integer, Text, Boolean, Enum, JSON, ForeignKey
from sqlalchemy.orm import relationship
import enum
from app.models.base_simple import BaseModel

class TemplateCategory(str, enum.Enum):
    COLD_OUTREACH = "cold_outreach"
    FOLLOW_UP = "follow_up"
    MEETING_REQUEST = "meeting_request"
    INTRODUCTION = "introduction"
    THANK_YOU = "thank_you"
    NURTURE = "nurture"
    CUSTOM = "custom"

class EmailTemplate(BaseModel):
    __tablename__ = "email_templates"
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Template information
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(Enum(TemplateCategory), nullable=False)
    
    # Email content
    subject = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)
    
    # Template metadata
    placeholders = Column(JSON, default=list)  # List of placeholder variables
    is_active = Column(Boolean, default=True, nullable=False)
    usage = Column(Integer, default=0, nullable=False)  # Number of times used
    
    # Template metrics stored as JSON
    metrics = Column(JSON, default={
        "timesSent": 0,
        "openRate": 0.0,
        "clickRate": 0.0,
        "replyRate": 0.0,
        "conversionRate": 0.0,
        "lastUsed": None
    })
    
    # Relationships
    user = relationship("User", back_populates="email_templates")
    sequences = relationship("CampaignSequence", back_populates="email_template")
    
    def __repr__(self):
        return f"<EmailTemplate(id={self.id}, name='{self.name}', category='{self.category}')>"
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "userId": str(self.user_id),
            "name": self.name,
            "description": self.description,
            "category": self.category.value,
            "subject": self.subject,
            "body": self.body,
            "placeholders": self.placeholders or [],
            "isActive": self.is_active,
            "usage": self.usage,
            "metrics": self.metrics,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat()
        }

class CampaignSequence(BaseModel):
    __tablename__ = "campaign_sequences"
    
    # Foreign keys
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False, index=True)
    email_template_id = Column(Integer, ForeignKey("email_templates.id"), nullable=True)
    
    # Sequence configuration
    step_number = Column(Integer, nullable=False)  # Order in the sequence
    delay_days = Column(Integer, default=0, nullable=False)
    delay_hours = Column(Integer, default=0, nullable=False)
    
    # Step settings
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    campaign = relationship("Campaign", back_populates="sequences")
    email_template = relationship("EmailTemplate", back_populates="sequences")
    
    def __repr__(self):
        return f"<CampaignSequence(id={self.id}, campaign_id={self.campaign_id}, step={self.step_number})>"
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "campaignId": str(self.campaign_id),
            "emailTemplateId": str(self.email_template_id) if self.email_template_id else None,
            "stepNumber": self.step_number,
            "delayDays": self.delay_days,
            "delayHours": self.delay_hours,
            "isActive": self.is_active,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat()
        }
