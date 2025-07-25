from datetime import datetime, timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text
import jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.api.deps import get_db
from app.models.user import User, UserRole, UserSubscription
from app.schemas.auth import UserCreate, UserResponse, Token, UserLogin

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_token(token: str) -> dict:
    """Verify and decode a JWT token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.PyJWTError:
        return None

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Get the current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    # Get user from database using raw SQL (due to schema mismatch)
    user_result = db.execute(
        text("SELECT id, email, name, company, role, subscription, email_verified FROM users WHERE id = :user_id"),
        {"user_id": user_id}
    ).fetchone()
    
    if user_result is None:
        raise credentials_exception
    
    return {
        "id": user_result[0],
        "email": user_result[1],
        "name": user_result[2],
        "company": user_result[3],
        "role": user_result[4],
        "subscription": user_result[5],
        "email_verified": user_result[6]
    }

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)) -> Any:
    """Register a new user."""
    try:
        # Check if user already exists
        existing_user = db.execute(
            text("SELECT id FROM users WHERE email = :email"), 
            {"email": user_data.email}
        ).fetchone()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists"
            )
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user using raw SQL
        result = db.execute(text("""
            INSERT INTO users (email, password_hash, name, company, role, subscription, preferences, email_verified)
            VALUES (:email, :password_hash, :name, :company, :role, :subscription, :preferences, :email_verified)
        """), {
            "email": user_data.email,
            "password_hash": hashed_password,
            "name": user_data.name,
            "company": user_data.company or "",
            "role": user_data.role.upper() if user_data.role else "USER",
            "subscription": user_data.subscription.upper() if user_data.subscription else "FREE",
            "preferences": str(user_data.preferences or {}),
            "email_verified": False
        })
        db.commit()
        
        # Get the created user
        user_result = db.execute(
            text("SELECT id, email, name, company, role, subscription FROM users WHERE email = :email"), 
            {"email": user_data.email}
        ).fetchone()
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user_result[0])}, expires_delta=access_token_expires
        )
        
        return {
            "user": {
                "id": user_result[0],
                "email": user_result[1],
                "name": user_result[2],
                "company": user_result[3],
                "role": user_result[4].lower(),
                "subscription": user_result[5].lower()
            },
            "token": access_token
        }
        
    except Exception as e:
        db.rollback()
        if "UNIQUE constraint failed" in str(e):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=UserResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)) -> Any:
    """Authenticate user and return access token."""
    try:
        # Find user by email
        user_result = db.execute(
            text("SELECT id, email, name, company, role, subscription, password_hash FROM users WHERE email = :email"), 
            {"email": credentials.email}
        ).fetchone()
        
        if not user_result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(credentials.password, user_result[6]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Update last login
        db.execute(
            text("UPDATE users SET last_login_at = :now WHERE id = :user_id"),
            {"now": datetime.utcnow(), "user_id": user_result[0]}
        )
        db.commit()
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user_result[0])}, expires_delta=access_token_expires
        )
        
        return {
            "user": {
                "id": user_result[0],
                "email": user_result[1],
                "name": user_result[2],
                "company": user_result[3],
                "role": user_result[4].lower(),
                "subscription": user_result[5].lower()
            },
            "token": access_token
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)) -> Any:
    """Logout user (client should discard token)."""
    return {"message": "Successfully logged out"}

@router.get("/validate", response_model=dict)
async def validate_token(current_user: dict = Depends(get_current_user)) -> Any:
    """Validate current token and return user info."""
    return {"user": current_user}

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: dict = Depends(get_current_user)) -> Any:
    """Refresh access token."""
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(current_user["id"])}, expires_delta=access_token_expires
    )
    return {"token": access_token}
