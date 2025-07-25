from sqlalchemy import Column, String, Integer, DateTime, Enum, JSON, ForeignKey
from sqlalchemy.orm import relationship
import enum
from app.models.base_simple import BaseModel

class IntegrationType(str, enum.Enum):
    CRM = "crm"
    EMAIL_SERVICE = "email_service"
    DATA_ENRICHMENT = "data_enrichment"
    SOCIAL_MEDIA = "social_media"
    CALENDAR = "calendar"
    ANALYTICS = "analytics"

class IntegrationStatus(str, enum.Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    ERROR = "error"
    PENDING = "pending"
    EXPIRED = "expired"

class Integration(BaseModel):
    __tablename__ = "integrations"
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Integration details
    name = Column(String(255), nullable=False)
    type = Column(Enum(IntegrationType), nullable=False)
    provider = Column(String(255), nullable=False)  # e.g., "salesforce", "hubspot", "sendgrid"
    status = Column(Enum(IntegrationStatus), default=IntegrationStatus.PENDING, nullable=False)
    
    # Configuration stored as JSON (encrypted sensitive data)
    config = Column(JSON, default={
        "apiKey": None,
        "apiSecret": None,
        "accessToken": None,
        "refreshToken": None,
        "webhookUrl": None,
        "settings": {}
    })
    
    # Sync tracking
    last_sync = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="integrations")
    
    def __repr__(self):
        return f"<Integration(id={self.id}, name='{self.name}', provider='{self.provider}', status='{self.status}')>"
    
    def to_dict(self, include_sensitive=False):
        config_data = self.config.copy() if self.config else {}
        
        # Remove sensitive data unless explicitly requested
        if not include_sensitive:
            sensitive_keys = ["apiKey", "apiSecret", "accessToken", "refreshToken"]
            for key in sensitive_keys:
                if key in config_data:
                    config_data[key] = "***" if config_data[key] else None
        
        return {
            "id": str(self.id),
            "userId": str(self.user_id),
            "name": self.name,
            "type": self.type.value,
            "provider": self.provider,
            "status": self.status.value,
            "config": config_data,
            "lastSync": self.last_sync.isoformat() if self.last_sync else None,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat()
        }
