from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, validator

class LeadBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company: Optional[str] = None
    title: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    location: Optional[str] = None
    score: Optional[float] = 0.0
    status: Optional[str] = "new"
    source: Optional[str] = "manual_entry"
    tags: Optional[List[str]] = []
    custom_fields: Optional[Dict[str, Any]] = {}

class LeadCreate(LeadBase):
    @validator('status')
    def validate_status(cls, v):
        valid_statuses = [
            'new', 'enriched', 'qualified', 'contacted', 'replied', 
            'interested', 'not_interested', 'converted', 'unqualified'
        ]
        if v and v.lower() not in valid_statuses:
            raise ValueError(f'Status must be one of: {", ".join(valid_statuses)}')
        return v.lower() if v else 'new'
    
    @validator('source')
    def validate_source(cls, v):
        valid_sources = [
            'csv_upload', 'linkedin_url', 'manual_entry', 'api_import', 'web_scraping'
        ]
        if v and v.lower() not in valid_sources:
            raise ValueError(f'Source must be one of: {", ".join(valid_sources)}')
        return v.lower() if v else 'manual_entry'
    
    @validator('score')
    def validate_score(cls, v):
        if v is not None and (v < 0 or v > 100):
            raise ValueError('Score must be between 0 and 100')
        return v

class LeadUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company: Optional[str] = None
    title: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    location: Optional[str] = None
    score: Optional[float] = None
    status: Optional[str] = None
    source: Optional[str] = None
    tags: Optional[List[str]] = None
    custom_fields: Optional[Dict[str, Any]] = None
    
    @validator('status')
    def validate_status(cls, v):
        if v is None:
            return v
        valid_statuses = [
            'new', 'enriched', 'qualified', 'contacted', 'replied', 
            'interested', 'not_interested', 'converted', 'unqualified'
        ]
        if v.lower() not in valid_statuses:
            raise ValueError(f'Status must be one of: {", ".join(valid_statuses)}')
        return v.lower()
    
    @validator('source')
    def validate_source(cls, v):
        if v is None:
            return v
        valid_sources = [
            'csv_upload', 'linkedin_url', 'manual_entry', 'api_import', 'web_scraping'
        ]
        if v.lower() not in valid_sources:
            raise ValueError(f'Source must be one of: {", ".join(valid_sources)}')
        return v.lower()
    
    @validator('score')
    def validate_score(cls, v):
        if v is not None and (v < 0 or v > 100):
            raise ValueError('Score must be between 0 and 100')
        return v

class LeadResponse(LeadBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class PaginationInfo(BaseModel):
    page: int
    limit: int
    total: int
    pages: int

class LeadListResponse(BaseModel):
    leads: List[LeadResponse]
    pagination: PaginationInfo

class LeadStats(BaseModel):
    total_leads: int
    new_leads: int
    qualified_leads: int
    contacted_leads: int
    converted_leads: int
    average_score: float

class LeadBulkCreate(BaseModel):
    leads: List[LeadCreate]
    
class LeadBulkResponse(BaseModel):
    created: int
    failed: int
    errors: List[str]
