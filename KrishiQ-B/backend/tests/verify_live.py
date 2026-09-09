import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import time
import threading
import uvicorn
import httpx
from app.main import app

def run_server():
    uvicorn.run(app, host="127.0.0.1", port=5001, log_level="warning")

if __name__ == "__main__":
    t = threading.Thread(target=run_server, daemon=True)
    t.start()
    time.sleep(1.5)

    base = "http://127.0.0.1:5001"
    print("\n--- 1. Testing GET / ---")
    r = httpx.get(f"{base}/")
    print(f"Status: {r.status_code}")
    print(r.json())
    assert r.status_code == 200

    print("\n--- 2. Testing GET /api/health ---")
    r = httpx.get(f"{base}/api/health")
    print(f"Status: {r.status_code}")
    print(r.json())
    assert r.status_code == 200

    print("\n--- 3. Testing 401 Unauthorized on unauthenticated /api/farmer/centres ---")
    r = httpx.get(f"{base}/api/farmer/centres")
    print(f"Status: {r.status_code}")
    print(r.json())
    assert r.status_code == 401
    assert r.json()["success"] is False

    print("\n--- 4. Testing 401 Unauthorized on unauthenticated /api/auth/me ---")
    r = httpx.get(f"{base}/api/auth/me")
    print(f"Status: {r.status_code}")
    print(r.json())
    assert r.status_code == 401
    assert r.json()["success"] is False

    print("\n--- 5. Testing 401 Unauthorized on unauthenticated /api/centre/status ---")
    r = httpx.get(f"{base}/api/centre/status")
    print(f"Status: {r.status_code}")
    print(r.json())
    assert r.status_code == 401
    assert r.json()["success"] is False

    print("\n--- 6. Testing 401 Unauthorized on unauthenticated /api/admin/status ---")
    r = httpx.get(f"{base}/api/admin/status")
    print(f"Status: {r.status_code}")
    print(r.json())
    assert r.status_code == 401
    assert r.json()["success"] is False

    print("\n--- 7. Testing GET /docs (OpenAPI Swagger UI) ---")
    r = httpx.get(f"{base}/docs")
    print(f"Status: {r.status_code}")
    assert r.status_code == 200

    print("\n--- 8. Testing DB write guard (require_live_db) raises 503 when offline ---")
    from app.db.database import require_live_db
    from fastapi import HTTPException
    try:
        require_live_db()
        print("FAIL: Expected HTTPException(503)")
        sys.exit(1)
    except HTTPException as e:
        print(f"Success: Caught expected 503 error: {e.detail}")
        assert e.status_code == 503

    print("\n--- 9. Testing 401 on unauthenticated POST /api/farmer/bookings ---")
    r = httpx.post(f"{base}/api/farmer/bookings", json={
        "centre_id": "centre-b",
        "slot_id": "s001",
        "crop_id": "c001",
        "quantity_quintals": 10.0
    })
    print(f"Status: {r.status_code}")
    print(r.json())
    assert r.status_code == 401
    assert r.json()["success"] is False

    print("\n--- 10. Testing 503 Service Unavailable on POST /api/farmer/bookings when DB is offline ---")
    # Using auth override to simulate authenticated farmer hitting the endpoint without live DB
    from app.core.security import get_current_user
    from app.schemas.auth import AuthenticatedUser, FarmerProfileSchema
    app.dependency_overrides[get_current_user] = lambda: AuthenticatedUser(
        id="u0000001-0000-0000-0000-000000000001",
        phone="9876543210",
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
    r = httpx.post(f"{base}/api/farmer/bookings", json={
        "centre_id": "centre-b",
        "slot_id": "s001",
        "crop_id": "c001",
        "quantity_quintals": 10.0
    })
    print(f"Status: {r.status_code}")
    print(r.json())
    assert r.status_code == 503
    assert r.json()["success"] is False
    assert "Database Service Unavailable" in r.json()["message"]
    app.dependency_overrides.clear()

    print("\n==================================================")
    print("ALL LIVE ENDPOINT & BOOKING WRITE TESTS PASSED CLEANLY!")
    print("==================================================")

