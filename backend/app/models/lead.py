from sqlalchemy import Column, String, Integer, Float, DateTime, Enum, JSON, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
import enum
from app.models.base_simple import BaseModel, Base

class LeadStatus(str, enum.Enum):
    NEW = "new"
    ENRICHED = "enriched"
    QUALIFIED = "qualified"
    CONTACTED = "contacted"
    REPLIED = "replied"
    INTERESTED = "interested"
    NOT_INTERESTED = "not_interested"
    CONVERTED = "converted"
    UNQUALIFIED = "unqualified"

class LeadSource(str, enum.Enum):
    CSV_UPLOAD = "csv_upload"
    LINKEDIN_URL = "linkedin_url"
    MANUAL_ENTRY = "manual_entry"
    API_IMPORT = "api_import"
    WEB_SCRAPING = "web_scraping"

# Association table for many-to-many relationship between campaigns and leads
campaign_leads = Table(
    'campaign_leads',
    Base.metadata,
    Column('campaign_id', Integer, ForeignKey('campaigns.id'), primary_key=True),
    Column('lead_id', Integer, ForeignKey('leads.id'), primary_key=True)
)

class Lead(BaseModel):
    __tablename__ = "leads"
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Basic lead information
    email = Column(String(255), nullable=False, index=True)
    first_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    title = Column(String(255), nullable=True)
    
    # Optional contact information
    linkedin_url = Column(String(500), nullable=True)
    phone = Column(String(50), nullable=True)
    website = Column(String(500), nullable=True)
    
    # Company details
    industry = Column(String(255), nullable=True)
    company_size = Column(String(100), nullable=True)
    location = Column(String(255), nullable=True)
    
    # Lead scoring and status
    score = Column(Float, default=0.0, nullable=False)
    status = Column(Enum(LeadStatus), default=LeadStatus.NEW, nullable=False)
    source = Column(Enum(LeadSource), nullable=False)
    
    # Tags and custom fields stored as JSON
    tags = Column(JSON, default=list)
    custom_fields = Column(JSON, default=dict)
    
    # Enrichment data stored as JSON
    enrichment_data = Column(JSON, nullable=True)
    
    # Research data stored as JSON
    research_data = Column(JSON, nullable=True)
    
    # Contact tracking
    last_contacted_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="leads")
    interactions = relationship("Interaction", back_populates="lead", cascade="all, delete-orphan")
    campaigns = relationship("Campaign", secondary=campaign_leads, back_populates="leads")
    
    def __repr__(self):
        name = f"{self.first_name or ''} {self.last_name or ''}".strip()
        return f"<Lead(id={self.id}, name='{name}', email='{self.email}', company='{self.company}')>"
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "userId": str(self.user_id),
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "company": self.company,
            "title": self.title,
            "linkedinUrl": self.linkedin_url,
            "phone": self.phone,
            "website": self.website,
            "industry": self.industry,
            "companySize": self.company_size,
            "location": self.location,
            "score": self.score,
            "status": self.status.value if self.status else None,
            "source": self.source.value if self.source else None,
            "tags": self.tags or [],
            "customFields": self.custom_fields or {},
            "enrichmentData": self.enrichment_data,
            "researchData": self.research_data,
            "lastContactedAt": self.last_contacted_at.isoformat() if self.last_contacted_at else None,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
            "isActive": self.is_active if hasattr(self, 'is_active') else True
        }
