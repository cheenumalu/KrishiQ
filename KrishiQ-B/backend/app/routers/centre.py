from fastapi import APIRouter, Depends
from app.core.security import require_role
from app.schemas.auth import AuthenticatedUser
from app.utils.response import api_success

router = APIRouter(prefix="/centre", tags=["Procurement Centre Operations"])

@router.get("/status", summary="Centre Operator Status Check")
async def get_centre_status(current_user: AuthenticatedUser = Depends(require_role("centre", "admin"))):
    """Placeholder endpoint for Mandi operator intake workflows (protected by centre role)"""
    return api_success(
        data={"operator_id": current_user.id, "role": current_user.role},
        message="Mandi operator gateway active"
    )
