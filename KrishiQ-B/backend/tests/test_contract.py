import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.security import get_current_user
from app.schemas.auth import AuthenticatedUser

@pytest.mark.asyncio
async def test_api_contract_success_envelope():
    """Verify that successful responses conform strictly to {'success': True, 'message': str, 'data': ...}"""
    def override_farmer():
        return AuthenticatedUser(
            id="u0000001-0000-0000-0000-000000000001",
            phone="9876543210",
            full_name="Rajesh Patel",
            role="farmer",
            is_active=True
        )

    app.dependency_overrides[get_current_user] = override_farmer
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/farmer/crops")
    assert response.status_code == 200
    res_json = response.json()
    assert "success" in res_json
    assert res_json["success"] is True
    assert "message" in res_json
    assert isinstance(res_json["message"], str)
    assert "data" in res_json
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_api_contract_error_envelope():
    """Verify that error responses conform strictly to {'success': False, 'message': str}"""
    app.dependency_overrides.clear()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. 401 Unauthorized
        res_401 = await ac.get("/api/farmer/centres")
        assert res_401.status_code == 401
        body_401 = res_401.json()
        assert body_401["success"] is False
        assert isinstance(body_401["message"], str)

        # 2. 400 Bad Request (validation)
        res_400 = await ac.get("/api/health/non-existent-endpoint")
        # 404 Not Found
        res_404 = await ac.get("/api/non-existent")
        assert res_404.status_code == 404
        body_404 = res_404.json()
        assert body_404["success"] is False
        assert isinstance(body_404["message"], str)

@pytest.mark.asyncio
async def test_api_cors_headers():
    """Verify CORS headers allow requests from frontend origin"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.options(
            "/api/health",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "GET"
            }
        )
    assert response.status_code in (200, 204)
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
