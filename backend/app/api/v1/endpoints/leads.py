from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.api.deps import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.leads import LeadCreate, LeadUpdate, LeadResponse, LeadListResponse

router = APIRouter()

@router.post("/", response_model=LeadResponse)
async def create_lead(
    lead_data: LeadCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Create a new lead."""
    try:
        # Create lead using raw SQL (matching database schema)
        result = db.execute(text("""
            INSERT INTO leads (
                user_id, email, first_name, last_name, company, title, 
                phone, linkedin_url, website, industry, company_size, 
                location, score, status, source, tags, custom_fields
            )
            VALUES (
                :user_id, :email, :first_name, :last_name, :company, :title,
                :phone, :linkedin_url, :website, :industry, :company_size,
                :location, :score, :status, :source, :tags, :custom_fields
            )
        """), {
            "user_id": current_user["id"],
            "email": lead_data.email,
            "first_name": lead_data.first_name or "",
            "last_name": lead_data.last_name or "",
            "company": lead_data.company or "",
            "title": lead_data.title or "",
            "phone": lead_data.phone,
            "linkedin_url": lead_data.linkedin_url,
            "website": lead_data.website,
            "industry": lead_data.industry,
            "company_size": lead_data.company_size,
            "location": lead_data.location,
            "score": lead_data.score or 0.0,
            "status": lead_data.status or "new",
            "source": lead_data.source or "manual_entry",
            "tags": str(lead_data.tags or []),
            "custom_fields": str(lead_data.custom_fields or {})
        })
        db.commit()
        
        # Get the created lead
        lead_id = result.lastrowid
        lead_result = db.execute(text("""
            SELECT id, user_id, email, first_name, last_name, company, title,
                   phone, linkedin_url, website, industry, company_size,
                   location, score, status, source, created_at, updated_at
            FROM leads WHERE id = :lead_id
        """), {"lead_id": lead_id}).fetchone()
        
        return {
            "id": lead_result[0],
            "user_id": lead_result[1],
            "email": lead_result[2],
            "first_name": lead_result[3],
            "last_name": lead_result[4],
            "company": lead_result[5],
            "title": lead_result[6],
            "phone": lead_result[7],
            "linkedin_url": lead_result[8],
            "website": lead_result[9],
            "industry": lead_result[10],
            "company_size": lead_result[11],
            "location": lead_result[12],
            "score": lead_result[13],
            "status": lead_result[14],
            "source": lead_result[15],
            "created_at": lead_result[16],
            "updated_at": lead_result[17]
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create lead: {str(e)}"
        )

@router.get("/", response_model=LeadListResponse)
async def get_leads(
    skip: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Get leads for the current user."""
    try:
        # Build query with filters
        where_conditions = ["user_id = :user_id"]
        params = {"user_id": current_user["id"], "limit": limit, "offset": skip}
        
        if search:
            where_conditions.append(
                "(first_name LIKE :search OR last_name LIKE :search OR email LIKE :search OR company LIKE :search)"
            )
            params["search"] = f"%{search}%"
        
        if status:
            where_conditions.append("status = :status")
            params["status"] = status
        
        where_clause = " AND ".join(where_conditions)
        
        # Get leads
        leads_result = db.execute(text(f"""
            SELECT id, user_id, email, first_name, last_name, company, title,
                   phone, linkedin_url, website, industry, company_size,
                   location, score, status, source, created_at, updated_at
            FROM leads 
            WHERE {where_clause}
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :offset
        """), params).fetchall()
        
        # Get total count
        count_result = db.execute(text(f"""
            SELECT COUNT(*) FROM leads WHERE {where_clause}
        """), {k: v for k, v in params.items() if k not in ['limit', 'offset']}).fetchone()
        
        total = count_result[0]
        
        leads = []
        for row in leads_result:
            leads.append({
                "id": row[0],
                "user_id": row[1],
                "email": row[2],
                "first_name": row[3],
                "last_name": row[4],
                "company": row[5],
                "title": row[6],
                "phone": row[7],
                "linkedin_url": row[8],
                "website": row[9],
                "industry": row[10],
                "company_size": row[11],
                "location": row[12],
                "score": row[13],
                "status": row[14],
                "source": row[15],
                "created_at": row[16],
                "updated_at": row[17]
            })
        
        return {
            "leads": leads,
            "pagination": {
                "page": (skip // limit) + 1,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get leads: {str(e)}"
        )

@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(
    lead_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Get a specific lead."""
    try:
        lead_result = db.execute(text("""
            SELECT id, user_id, email, first_name, last_name, company, title,
                   phone, linkedin_url, website, industry, company_size,
                   location, score, status, source, created_at, updated_at
            FROM leads 
            WHERE id = :lead_id AND user_id = :user_id
        """), {"lead_id": lead_id, "user_id": current_user["id"]}).fetchone()
        
        if not lead_result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lead not found"
            )
        
        return {
            "id": lead_result[0],
            "user_id": lead_result[1],
            "email": lead_result[2],
            "first_name": lead_result[3],
            "last_name": lead_result[4],
            "company": lead_result[5],
            "title": lead_result[6],
            "phone": lead_result[7],
            "linkedin_url": lead_result[8],
            "website": lead_result[9],
            "industry": lead_result[10],
            "company_size": lead_result[11],
            "location": lead_result[12],
            "score": lead_result[13],
            "status": lead_result[14],
            "source": lead_result[15],
            "created_at": lead_result[16],
            "updated_at": lead_result[17]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get lead: {str(e)}"
        )

@router.put("/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: int,
    lead_data: LeadUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Update a lead."""
    try:
        # Check if lead exists and belongs to user
        existing_lead = db.execute(text("""
            SELECT id FROM leads WHERE id = :lead_id AND user_id = :user_id
        """), {"lead_id": lead_id, "user_id": current_user["id"]}).fetchone()
        
        if not existing_lead:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lead not found"
            )
        
        # Build update query dynamically
        update_fields = []
        params = {"lead_id": lead_id}
        
        for field, value in lead_data.dict(exclude_unset=True).items():
            if value is not None:
                update_fields.append(f"{field} = :{field}")
                params[field] = value
        
        if not update_fields:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )
        
        # Add updated_at
        update_fields.append("updated_at = :updated_at")
        params["updated_at"] = "CURRENT_TIMESTAMP"
        
        # Execute update
        db.execute(text(f"""
            UPDATE leads SET {', '.join(update_fields)}
            WHERE id = :lead_id
        """), params)
        db.commit()
        
        # Return updated lead
        return await get_lead(lead_id, current_user, db)
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update lead: {str(e)}"
        )

@router.delete("/{lead_id}")
async def delete_lead(
    lead_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Delete a lead."""
    try:
        # Check if lead exists and belongs to user
        existing_lead = db.execute(text("""
            SELECT id FROM leads WHERE id = :lead_id AND user_id = :user_id
        """), {"lead_id": lead_id, "user_id": current_user["id"]}).fetchone()
        
        if not existing_lead:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lead not found"
            )
        
        # Delete lead
        db.execute(text("DELETE FROM leads WHERE id = :lead_id"), {"lead_id": lead_id})
        db.commit()
        
        return {"message": "Lead deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete lead: {str(e)}"
        )
