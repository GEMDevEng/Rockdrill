from sqlalchemy import Column, String, Integer, DateTime, Enum, JSON, Text, ForeignKey
from sqlalchemy.orm import relationship
import enum
from app.models.base_simple import BaseModel

class InteractionType(str, enum.Enum):
    EMAIL_SENT = "email_sent"
    EMAIL_OPENED = "email_opened"
    EMAIL_CLICKED = "email_clicked"
    EMAIL_REPLIED = "email_replied"
    LINKEDIN_CONNECTION = "linkedin_connection"
    LINKEDIN_MESSAGE = "linkedin_message"
    PHONE_CALL = "phone_call"
    MEETING_SCHEDULED = "meeting_scheduled"
    MEETING_COMPLETED = "meeting_completed"

class CommunicationChannel(str, enum.Enum):
    EMAIL = "email"
    LINKEDIN = "linkedin"
    PHONE = "phone"
    SMS = "sms"
    DIRECT_MAIL = "direct_mail"

class InteractionStatus(str, enum.Enum):
    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    OPENED = "opened"
    CLICKED = "clicked"
    REPLIED = "replied"
    BOUNCED = "bounced"
    FAILED = "failed"

class Interaction(BaseModel):
    __tablename__ = "interactions"
    
    # Foreign keys
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=True, index=True)
    
    # Interaction details
    type = Column(Enum(InteractionType), nullable=False)
    channel = Column(Enum(CommunicationChannel), nullable=False)
    status = Column(Enum(InteractionStatus), default=InteractionStatus.PENDING, nullable=False)
    
    # Content
    subject = Column(String(500), nullable=True)
    content = Column(Text, nullable=True)
    response = Column(Text, nullable=True)
    
    # Metadata stored as JSON
    interaction_metadata = Column(JSON, default=dict)
    
    # Timestamps
    responded_at = Column(DateTime, nullable=True)
    
    # Relationships
    lead = relationship("Lead", back_populates="interactions")
    
    def __repr__(self):
        return f"<Interaction(id={self.id}, lead_id={self.lead_id}, type='{self.type}', status='{self.status}')>"
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "leadId": str(self.lead_id),
            "campaignId": str(self.campaign_id) if self.campaign_id else None,
            "type": self.type.value,
            "channel": self.channel.value,
            "status": self.status.value,
            "subject": self.subject,
            "content": self.content,
            "response": self.response,
            "metadata": self.interaction_metadata or {},
            "respondedAt": self.responded_at.isoformat() if self.responded_at else None,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat()
        }
