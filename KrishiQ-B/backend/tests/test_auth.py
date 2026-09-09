import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.security import get_current_user
from app.schemas.auth import AuthenticatedUser, FarmerProfileSchema

@pytest.mark.asyncio
async def test_auth_me_missing_token():
    """Missing Authorization header must return 401 Unauthorized"""
    app.dependency_overrides.clear()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/auth/me")
    assert response.status_code == 401
    res_json = response.json()
    assert res_json["success"] is False
    assert "Authorization token required" in res_json["message"]

@pytest.mark.asyncio
async def test_auth_me_malformed_header():
    """Malformed Authorization header must return 401 Unauthorized"""
    app.dependency_overrides.clear()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/auth/me", headers={"Authorization": "Basic 12345"})
    assert response.status_code == 401
    res_json = response.json()
    assert res_json["success"] is False
    assert "Malformed authorization header" in res_json["message"]

@pytest.mark.asyncio
async def test_auth_me_invalid_token():
    """Invalid token string must return 401 Unauthorized"""
    app.dependency_overrides.clear()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/auth/me", headers={"Authorization": "Bearer totally-fake-or-invalid-token"})
    assert response.status_code == 401
    res_json = response.json()
    assert res_json["success"] is False

@pytest.mark.asyncio
async def test_rbac_farmer_allowed_on_farmer_routes():
    """Authenticated user with role 'farmer' must be granted access to farmer routes"""
    def override_farmer():
        return AuthenticatedUser(
            id="u0000001-0000-0000-0000-000000000001",
            phone="9876543210",
            email="rajesh.patel@krishiq.in",
            full_name="Rajesh Patel",
            role="farmer",
            is_active=True,
            farmer_profile=FarmerProfileSchema(
                id="f0000001-0000-0000-0000-000000000001",
                farmer_id_code="MP-IND-2026-8841",
                village="Rangwasa",
                tehsil="Rau",
                district="Indore",
                state="Madhya Pradesh",
                aadhaar_verified=True,
                bank_name="State Bank of India",
                account_number_mask="4092",
                ifsc_prefix="SBIN0000382",
                max_allotment_quintals=500.0
            )
        )

    app.dependency_overrides[get_current_user] = override_farmer
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/farmer/centres")
    assert response.status_code == 200
    assert response.json()["success"] is True
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_rbac_non_farmer_rejected_on_farmer_routes():
    """Authenticated user with role 'centre' (non-farmer) must be rejected with 403 Forbidden on farmer routes"""
    def override_centre():
        return AuthenticatedUser(
            id="u0000001-0000-0000-0000-000000000002",
            phone="9876543211",
            email="operator.indore@krishiq.in",
            full_name="Vikram Singh",
            role="centre",
            is_active=True
        )

    app.dependency_overrides[get_current_user] = override_centre
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/farmer/centres")
    assert response.status_code == 403
    res_json = response.json()
    assert res_json["success"] is False
    assert "Insufficient role permissions" in res_json["message"]
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_rbac_centre_and_admin_routes():
    """Verify centre operators and admins can access their respective role-guarded routes"""
    def override_centre():
        return AuthenticatedUser(
            id="u0000001-0000-0000-0000-000000000002",
            phone="9876543211",
            email="operator.indore@krishiq.in",
            full_name="Vikram Singh",
            role="centre",
            is_active=True
        )

    app.dependency_overrides[get_current_user] = override_centre
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Centre operator accessing centre route -> 200
        res_centre = await ac.get("/api/centre/status")
        assert res_centre.status_code == 200
        # Centre operator accessing admin route -> 403
        res_admin = await ac.get("/api/admin/status")
        assert res_admin.status_code == 403

    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_deactivated_user_blocked():
    """Deactivated user (is_active=False) must be rejected with 403 Forbidden"""
    def override_deactivated():
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated. Please contact APMC administration."
        )

    app.dependency_overrides[get_current_user] = override_deactivated
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/auth/me")
    assert response.status_code == 403
    assert "deactivated" in response.json()["message"]
    app.dependency_overrides.clear()
