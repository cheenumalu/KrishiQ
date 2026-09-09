from fastapi import APIRouter, Depends
from app.core.security import require_role
from app.schemas.auth import AuthenticatedUser
from app.utils.response import api_success

router = APIRouter(prefix="/admin", tags=["District Administrator"])

@router.get("/status", summary="District Admin Status Check")
async def get_admin_status(current_user: AuthenticatedUser = Depends(require_role("admin"))):
    """Placeholder endpoint for District Procurement Officer workflows (protected by admin role)"""
    return api_success(
        data={"admin_id": current_user.id, "role": current_user.role},
        message="District administrator gateway active"
    )
