import pytest
from fastapi import HTTPException
from app.db.database import check_db_connectivity, require_live_db, FALLBACK_CENTRES, FALLBACK_CROPS
from app.services.farmer_service import farmer_service

@pytest.mark.asyncio
async def test_offline_discovery_fallback():
    """
    Verify that when PostgreSQL is offline or unconfigured:
    Read-only discovery APIs return verified fallback datasets without crashing.
    """
    centres = await farmer_service.get_centres()
    assert len(centres) == len(FALLBACK_CENTRES)
    assert centres[0].id == "centre-b"

    crops = await farmer_service.get_crops()
    assert len(crops) == len(FALLBACK_CROPS)
    assert crops[0].name == "Wheat"

    slots = await farmer_service.get_slots("centre-b", "2026-09-15")
    assert len(slots) == 8
    assert slots[0].remaining_capacity == 0
    assert slots[0].status == "FULL"

def test_require_live_db_raises_503_when_offline():
    """
    CRITICAL ARCHITECTURAL RULE:
    WRITE/STATE-CHANGING APIs must NEVER pretend to succeed on mock data.
    When PostgreSQL is offline, require_live_db() MUST raise HTTP 503 Service Unavailable.
    """
    is_connected, _ = check_db_connectivity()
    # In this test environment, Supabase URL has placeholder credentials
    assert is_connected is False

    with pytest.raises(HTTPException) as exc_info:
        require_live_db()

    assert exc_info.value.status_code == 503
    assert "Database Service Unavailable" in exc_info.value.detail
    assert "Cannot perform state-changing operation" in exc_info.value.detail
