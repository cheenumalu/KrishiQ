import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.security import get_current_user
from app.schemas.auth import AuthenticatedUser, FarmerProfileSchema

def get_test_farmer():
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

@pytest.mark.asyncio
async def test_discovery_unauthenticated_rejected():
    """Unauthenticated requests to /api/farmer/* must be rejected with 401"""
    app.dependency_overrides.clear()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        r1 = await ac.get("/api/farmer/centres")
        r2 = await ac.get("/api/farmer/crops")
        r3 = await ac.get("/api/farmer/slots?centreId=centre-b&date=2026-09-15")
    assert r1.status_code == 401
    assert r2.status_code == 401
    assert r3.status_code == 401

@pytest.mark.asyncio
async def test_get_centres_authenticated():
    """Verify GET /api/farmer/centres returns the list of APMC Mandis for authenticated farmers"""
    app.dependency_overrides[get_current_user] = get_test_farmer
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/farmer/centres")
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert isinstance(res_json["data"], list)
    assert len(res_json["data"]) >= 5
    
    # Check Indore Main Mandi and Sanwer are present
    ids = [c["id"] for c in res_json["data"]]
    assert "centre-b" in ids
    assert "centre-a" in ids
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_get_crops_authenticated():
    """Verify GET /api/farmer/crops returns supported commodities and MSP rates for authenticated farmers"""
    app.dependency_overrides[get_current_user] = get_test_farmer
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/farmer/crops")
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert isinstance(res_json["data"], list)
    assert len(res_json["data"]) >= 6

    # Verify Wheat and Soybean MSP values match government rates
    crops_map = {c["name"]: c["msp_per_quintal"] for c in res_json["data"]}
    assert crops_map["Wheat"] == 2275.0
    assert crops_map["Soybean"] == 4600.0
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_get_slots_valid():
    """Verify GET /api/farmer/slots with valid query params returns slots with dynamic status"""
    app.dependency_overrides[get_current_user] = get_test_farmer
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/farmer/slots?centreId=centre-b&date=2026-09-15")
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert isinstance(res_json["data"], list)
    assert len(res_json["data"]) > 0

    first_slot = res_json["data"][0]
    assert "remaining_capacity" in first_slot
    assert "status" in first_slot
    assert first_slot["status"] in ["AVAILABLE", "FILLING_FAST", "FULL"]
    assert first_slot["remaining_capacity"] == first_slot["max_capacity"] - first_slot["booked_count"]
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_get_slots_invalid_date():
    """Verify GET /api/farmer/slots returns 400 Bad Request when date is malformed"""
    app.dependency_overrides[get_current_user] = get_test_farmer
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/farmer/slots?centreId=centre-b&date=invalid-date")
    assert response.status_code == 400
    res_json = response.json()
    assert res_json["success"] is False
    assert "Invalid date format" in res_json["message"]
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_get_slots_missing_params():
    """Verify GET /api/farmer/slots returns 400 Bad Request when required params are missing"""
    app.dependency_overrides[get_current_user] = get_test_farmer
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/farmer/slots")
    assert response.status_code == 400
    res_json = response.json()
    assert res_json["success"] is False
    assert "Validation Error" in res_json["message"]
    app.dependency_overrides.clear()
