from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.api.deps import get_db
from app.api.v1.endpoints.auth import get_current_user, get_password_hash
from app.schemas.users import UserProfile, UserUpdate, UserPasswordUpdate

router = APIRouter()

@router.get("/profile", response_model=UserProfile)
async def get_user_profile(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Get current user profile."""
    try:
        user_result = db.execute(text("""
            SELECT id, email, name, company, role, subscription, 
                   email_verified, last_login_at, created_at, updated_at
            FROM users WHERE id = :user_id
        """), {"user_id": current_user["id"]}).fetchone()
        
        if not user_result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {
            "id": user_result[0],
            "email": user_result[1],
            "name": user_result[2],
            "company": user_result[3],
            "role": user_result[4],
            "subscription": user_result[5],
            "email_verified": user_result[6],
            "last_login_at": user_result[7],
            "created_at": user_result[8],
            "updated_at": user_result[9]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user profile: {str(e)}"
        )

@router.put("/profile", response_model=UserProfile)
async def update_user_profile(
    user_data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Update current user profile."""
    try:
        # Build update query dynamically
        update_fields = []
        params = {"user_id": current_user["id"]}
        
        for field, value in user_data.dict(exclude_unset=True).items():
            if value is not None:
                update_fields.append(f"{field} = :{field}")
                params[field] = value
        
        if not update_fields:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )
        
        # Add updated_at
        update_fields.append("updated_at = CURRENT_TIMESTAMP")
        
        # Execute update
        db.execute(text(f"""
            UPDATE users SET {', '.join(update_fields)}
            WHERE id = :user_id
        """), params)
        db.commit()
        
        # Return updated profile
        return await get_user_profile(current_user, db)
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user profile: {str(e)}"
        )

@router.put("/password")
async def update_password(
    password_data: UserPasswordUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Update user password."""
    try:
        # Get current password hash
        user_result = db.execute(text("""
            SELECT password_hash FROM users WHERE id = :user_id
        """), {"user_id": current_user["id"]}).fetchone()
        
        if not user_result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify current password
        from app.api.v1.endpoints.auth import verify_password
        if not verify_password(password_data.current_password, user_result[0]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Hash new password
        new_password_hash = get_password_hash(password_data.new_password)
        
        # Update password
        db.execute(text("""
            UPDATE users SET password_hash = :password_hash, updated_at = CURRENT_TIMESTAMP
            WHERE id = :user_id
        """), {"password_hash": new_password_hash, "user_id": current_user["id"]})
        db.commit()
        
        return {"message": "Password updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update password: {str(e)}"
        )

@router.delete("/account")
async def delete_account(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Delete user account and all associated data."""
    try:
        # Delete user (this will cascade to related data)
        db.execute(text("DELETE FROM users WHERE id = :user_id"), {"user_id": current_user["id"]})
        db.commit()
        
        return {"message": "Account deleted successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete account: {str(e)}"
        )

@router.get("/stats")
async def get_user_stats(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Get user statistics."""
    try:
        # Get lead stats
        lead_stats = db.execute(text("""
            SELECT 
                COUNT(*) as total_leads,
                COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
                COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified_leads,
                COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_leads,
                COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_leads,
                AVG(score) as average_score
            FROM leads WHERE user_id = :user_id
        """), {"user_id": current_user["id"]}).fetchone()
        
        # Get campaign stats
        campaign_stats = db.execute(text("""
            SELECT 
                COUNT(*) as total_campaigns,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_campaigns,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_campaigns
            FROM campaigns WHERE user_id = :user_id
        """), {"user_id": current_user["id"]}).fetchone()
        
        return {
            "leads": {
                "total": lead_stats[0] or 0,
                "new": lead_stats[1] or 0,
                "qualified": lead_stats[2] or 0,
                "contacted": lead_stats[3] or 0,
                "converted": lead_stats[4] or 0,
                "average_score": round(lead_stats[5] or 0.0, 2)
            },
            "campaigns": {
                "total": campaign_stats[0] or 0,
                "active": campaign_stats[1] or 0,
                "completed": campaign_stats[2] or 0
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user stats: {str(e)}"
        )
