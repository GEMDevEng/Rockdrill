from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, validator

class UserBase(BaseModel):
    email: EmailStr
    name: str
    company: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "user"
    subscription: Optional[str] = "free"
    preferences: Optional[Dict[str, Any]] = None
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
    
    @validator('role')
    def validate_role(cls, v):
        if v and v.lower() not in ['admin', 'user', 'viewer']:
            raise ValueError('Role must be admin, user, or viewer')
        return v.lower() if v else 'user'
    
    @validator('subscription')
    def validate_subscription(cls, v):
        if v and v.lower() not in ['free', 'pro', 'enterprise']:
            raise ValueError('Subscription must be free, pro, or enterprise')
        return v.lower() if v else 'free'

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserBase):
    id: int
    role: str
    subscription: str
    email_verified: bool = False

class User(UserInDB):
    pass

class Token(BaseModel):
    token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    user: User
    token: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
