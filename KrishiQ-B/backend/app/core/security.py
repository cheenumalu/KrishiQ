from typing import Optional, Callable
from fastapi import Header, HTTPException, status, Depends
from app.db.database import supabase, supabase_admin
from app.schemas.auth import AuthenticatedUser, FarmerProfileSchema

async def get_current_user(authorization: Optional[str] = Header(None)) -> AuthenticatedUser:
    """
    FastAPI dependency to extract and validate Supabase Auth Bearer tokens,
    query the user's role and agricultural profile from PostgreSQL,
    and enforce authentication.
    """
    # 1. Error Case: Missing Authorization Header
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token required. Please provide a Bearer token in the Authorization header."
        )

    # 2. Error Case: Malformed Authorization Header
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed authorization header. Expected format: 'Bearer <token>'."
        )

    token = authorization[7:].strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token required. Token value cannot be empty."
        )

    if supabase is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication service unavailable: Supabase credentials not configured."
        )

    # 3. Cryptographically Validate Token with Supabase Auth
    try:
        auth_response = supabase.auth.get_user(token)
        if not auth_response or not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or unauthorized access token."
            )
        auth_user = auth_response.user
    except HTTPException:
        raise
    except Exception as e:
        err_msg = str(e).lower()
        if "expired" in err_msg or "jwt expired" in err_msg:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication session has expired. Please log in again."
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or unauthorized access token."
        )

    # 4. Query Role and Profile from PostgreSQL (Database is Single Source of Truth)
    db_user = None
    if supabase_admin:
        try:
            user_res = (
                supabase_admin.table("users")
                .select("id, phone, email, full_name, role, is_active, created_at, updated_at, farmers(*)")
                .or_(f"id.eq.{auth_user.id},phone.eq.{auth_user.phone or 'none'},email.eq.{auth_user.email or 'none'}")
                .limit(1)
                .execute()
            )
            if user_res.data and len(user_res.data) > 0:
                db_user = user_res.data[0]
        except Exception:
            db_user = None

    # 5. Check Deactivation Status
    if db_user and not db_user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated. Please contact APMC administration."
        )

    # 6. Assemble AuthenticatedUser
    if db_user:
        farmer_data = db_user.get("farmers")
        if isinstance(farmer_data, list) and len(farmer_data) > 0:
            farmer_data = farmer_data[0]

        farmer_profile = None
        if farmer_data:
            farmer_profile = FarmerProfileSchema(
                id=farmer_data["id"],
                farmer_id_code=farmer_data["farmer_id_code"],
                village=farmer_data["village"],
                tehsil=farmer_data["tehsil"],
                district=farmer_data["district"],
                state=farmer_data.get("state", "Madhya Pradesh"),
                aadhaar_verified=farmer_data.get("aadhaar_verified", False),
                bank_name=farmer_data["bank_name"],
                account_number_mask=farmer_data["account_number_mask"],
                ifsc_prefix=farmer_data["ifsc_prefix"],
                max_allotment_quintals=float(farmer_data.get("max_allotment_quintals", 500.0))
            )

        return AuthenticatedUser(
            id=db_user["id"],
            phone=db_user["phone"],
            email=db_user.get("email"),
            full_name=db_user["full_name"],
            role=db_user["role"],
            is_active=db_user.get("is_active", True),
            farmer_profile=farmer_profile,
            created_at=db_user.get("created_at"),
            updated_at=db_user.get("updated_at")
        )
    else:
        role = auth_user.user_metadata.get("role", "farmer") if auth_user.user_metadata else "farmer"
        full_name = auth_user.user_metadata.get("full_name", "Registered User") if auth_user.user_metadata else "Registered User"
        return AuthenticatedUser(
            id=auth_user.id,
            phone=auth_user.phone or "",
            email=auth_user.email,
            full_name=full_name,
            role=role,
            is_active=True,
            farmer_profile=None
        )

def require_role(*allowed_roles: str) -> Callable:
    """
    Role-Based Access Control (RBAC) Dependency Factory
    Verifies that the authenticated user possesses one of the required roles.
    Never trusts client headers or parameters.
    """
    async def role_checker(current_user: AuthenticatedUser = Depends(get_current_user)) -> AuthenticatedUser:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Insufficient role permissions. Required: [{', '.join(allowed_roles)}]. Your role: '{current_user.role}'."
            )
        return current_user
    return role_checker
