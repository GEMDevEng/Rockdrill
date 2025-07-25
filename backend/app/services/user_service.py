from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.user import User
from app.core.security import get_password_hash, verify_password


class UserService:
    """Service for user-related operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_by_email(self, email: str) -> Optional[dict]:
        """Get user by email using raw SQL"""
        try:
            result = self.db.execute(
                text("SELECT id, email, password_hash, name, company, role, subscription FROM users WHERE email = :email"),
                {"email": email}
            ).fetchone()
            
            if result:
                return {
                    "id": result[0],
                    "email": result[1],
                    "password_hash": result[2],
                    "name": result[3],
                    "company": result[4],
                    "role": result[5],
                    "subscription": result[6]
                }
            return None
        except Exception as e:
            print(f"Error getting user by email: {e}")
            return None
    
    def get_user_by_id(self, user_id: int) -> Optional[dict]:
        """Get user by ID using raw SQL"""
        try:
            result = self.db.execute(
                text("SELECT id, email, password_hash, name, company, role, subscription FROM users WHERE id = :user_id"),
                {"user_id": user_id}
            ).fetchone()
            
            if result:
                return {
                    "id": result[0],
                    "email": result[1],
                    "password_hash": result[2],
                    "name": result[3],
                    "company": result[4],
                    "role": result[5],
                    "subscription": result[6]
                }
            return None
        except Exception as e:
            print(f"Error getting user by ID: {e}")
            return None
    
    def create_user(self, email: str, password: str, name: str, company: str = "", role: str = "USER", subscription: str = "FREE") -> Optional[dict]:
        """Create a new user using raw SQL"""
        try:
            # Hash the password
            password_hash = get_password_hash(password)
            
            # Insert user
            result = self.db.execute(text("""
                INSERT INTO users (email, password_hash, name, company, role, subscription, preferences, email_verified)
                VALUES (:email, :password_hash, :name, :company, :role, :subscription, :preferences, :email_verified)
            """), {
                "email": email,
                "password_hash": password_hash,
                "name": name,
                "company": company,
                "role": role.upper(),
                "subscription": subscription.upper(),
                "preferences": "{}",
                "email_verified": False
            })
            self.db.commit()
            
            # Get the created user
            return self.get_user_by_email(email)
        except Exception as e:
            self.db.rollback()
            print(f"Error creating user: {e}")
            return None
    
    def verify_password(self, email: str, password: str) -> bool:
        """Verify user password"""
        user = self.get_user_by_email(email)
        if not user:
            return False
        
        return verify_password(password, user["password_hash"])
    
    def authenticate_user(self, email: str, password: str) -> Optional[dict]:
        """Authenticate user with email and password"""
        user = self.get_user_by_email(email)
        if not user:
            return None
        
        if not verify_password(password, user["password_hash"]):
            return None
        
        return user
