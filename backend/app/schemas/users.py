from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, validator

class UserProfile(BaseModel):
    id: int
    email: EmailStr
    name: str
    company: Optional[str] = None
    role: str
    subscription: str
    email_verified: bool = False
    last_login_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    
    @validator('name')
    def validate_name(cls, v):
        if v is not None and len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        return v.strip() if v else v

class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserStats(BaseModel):
    leads: Dict[str, Any]
    campaigns: Dict[str, Any]
