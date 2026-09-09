from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.schemas.auth import AuthenticatedUser
from app.utils.response import api_success

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/me", summary="Get Authenticated User Profile & Role")
async def get_me(current_user: AuthenticatedUser = Depends(get_current_user)):
    """
    Returns the cryptographic identity and PostgreSQL profile of the authenticated user.
    Enforces that the user has a valid Supabase token and is not deactivated.
    """
    return api_success(
        data={"user": current_user.model_dump()},
        message="Authenticated user profile retrieved successfully"
    )
