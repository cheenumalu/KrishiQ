from fastapi import APIRouter, Depends, HTTPException, Query
from app.core.security import get_current_user
from app.schemas.auth import AuthenticatedUser
from app.utils.response import api_success
from app.db.database import supabase, supabase_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/me", summary="Get Authenticated User Profile & Role")
async def get_me(current_user: AuthenticatedUser = Depends(get_current_user)):
    """
    Returns the authenticated user's profile and role.
    """
    return api_success(
        data={"user": current_user.model_dump()},
        message="Authenticated user profile retrieved successfully"
    )


@router.post("/dev-login", summary="Development Login for SIH Demo")
async def dev_login(
    role: str = Query("farmer", description="Demo role: farmer, centre, or admin")
):
    """
    DEVELOPMENT ONLY.

    Creates/signs in a demo Supabase Auth user and returns an access token.
    This allows the SIH frontend/backend to be tested without implementing
    OTP/SMS authentication during the emergency MVP phase.
    """

    demo_users = {
        "farmer": {
            "email": "rajesh.patel@krishiq.in",
            "password": "KrishiQ@Demo2026",
            "full_name": "Rajesh Patel",
        },
        "centre": {
            "email": "operator.indore@krishiq.in",
            "password": "KrishiQ@Demo2026",
            "full_name": "Vikram Singh (Mandi In-charge)",
        },
        "admin": {
            "email": "admin@krishiq.in",
            "password": "KrishiQ@Demo2026",
            "full_name": "District Procurement Officer",
        },
    }

    if role not in demo_users:
        raise HTTPException(
            status_code=400,
            detail="Invalid demo role. Use farmer, centre, or admin."
        )

    if supabase is None or supabase_admin is None:
        raise HTTPException(
            status_code=500,
            detail="Supabase is not configured."
        )

    demo = demo_users[role]

    # Try to create the demo Auth account.
    # If it already exists, we simply continue to login.
    try:
        supabase_admin.auth.admin.create_user({
            "email": demo["email"],
            "password": demo["password"],
            "email_confirm": True,
            "user_metadata": {
                "role": role,
                "full_name": demo["full_name"],
            },
        })
    except Exception:
        # Account probably already exists.
        # Login below will tell us if anything is actually wrong.
        pass

    # Sign in and obtain a real Supabase access token.
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": demo["email"],
            "password": demo["password"],
        })
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Demo login failed: {str(e)}"
        )

    if not auth_response or not auth_response.session:
        raise HTTPException(
            status_code=401,
            detail="Unable to create authentication session."
        )

    return api_success(
        data={
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "token_type": "bearer",
            "role": role,
            "user": {
                "email": demo["email"],
                "full_name": demo["full_name"],
            },
        },
        message=f"Demo {role} login successful"
    )