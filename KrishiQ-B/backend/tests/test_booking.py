import pytest
import sqlite3
import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.security import get_current_user
from app.db.database import get_db
from app.schemas.auth import AuthenticatedUser, FarmerProfileSchema
from app.schemas.booking import BookingCreateRequest
from app.services.booking_service import booking_service

def create_in_memory_test_db():
    """Creates a standalone in-memory SQLite database matching PostgreSQL schema & constraints"""
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")

    conn.executescript("""
        CREATE TABLE procurement_centres (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'normal'
        );

        CREATE TABLE crops (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            is_active INTEGER NOT NULL DEFAULT 1
        );

        CREATE TABLE slots (
            id TEXT PRIMARY KEY,
            centre_id TEXT NOT NULL,
            slot_date TEXT NOT NULL,
            time_window TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            max_capacity INTEGER NOT NULL DEFAULT 20,
            booked_count INTEGER NOT NULL DEFAULT 0,
            CHECK (booked_count <= max_capacity)
        );

        CREATE TABLE bookings (
            id TEXT PRIMARY KEY,
            booking_number TEXT UNIQUE NOT NULL,
            farmer_id TEXT NOT NULL,
            centre_id TEXT NOT NULL,
            slot_id TEXT NOT NULL,
            slot_date TEXT NOT NULL,
            crop_id TEXT NOT NULL,
            variety TEXT NOT NULL,
            quantity_quintals REAL NOT NULL,
            booking_status TEXT NOT NULL DEFAULT 'CONFIRMED',
            stage_number INTEGER NOT NULL DEFAULT 2,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE UNIQUE INDEX uq_farmer_single_active_booking_per_day
        ON bookings (farmer_id, slot_date)
        WHERE booking_status IN ('CONFIRMED', 'RESCHEDULED');

        CREATE TABLE queue_tokens (
            id TEXT PRIMARY KEY,
            booking_id TEXT UNIQUE NOT NULL,
            centre_id TEXT NOT NULL,
            token_number TEXT NOT NULL,
            sequence_number INTEGER NOT NULL,
            queue_date TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'PENDING_ARRIVAL',
            assigned_counter TEXT,
            estimated_wait_minutes INTEGER NOT NULL DEFAULT 30,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (centre_id, queue_date, sequence_number)
        );

        -- Seed data
        INSERT INTO procurement_centres (id, name, status)
        VALUES ('centre-b', 'Indore Main Mandi', 'critical'), ('centre-a', 'Sanwer Mandi', 'normal');

        INSERT INTO crops (id, name, is_active)
        VALUES 
            ('c0000001-0000-0000-0000-000000000001', 'Wheat', 1),
            ('c0000001-0000-0000-0000-000000000002', 'Inactive Crop', 0);

        INSERT INTO slots (id, centre_id, slot_date, time_window, start_time, end_time, max_capacity, booked_count)
        VALUES 
            ('s001_available', 'centre-b', '2026-09-15', '08:00 - 08:30', '08:00:00', '08:30:00', 20, 0),
            ('s002_full', 'centre-b', '2026-09-15', '08:30 - 09:00', '08:30:00', '09:00:00', 20, 20),
            ('s003_nearly_full', 'centre-b', '2026-09-15', '09:00 - 09:30', '09:00:00', '09:30:00', 2, 1),
            ('s004_sanwer', 'centre-a', '2026-09-15', '09:30 - 10:00', '09:30:00', '10:00:00', 20, 0);
    """)
    return conn

def mock_farmer(farmer_id="f0000001-0000-0000-0000-000000000001", max_allotment=500.0):
    return AuthenticatedUser(
        id="u0000001-0000-0000-0000-000000000001",
        phone="9876543210",
        full_name="Rajesh Patel",
        role="farmer",
        is_active=True,
        farmer_profile=FarmerProfileSchema(
            id=farmer_id,
            farmer_id_code="MP-IND-2026-8841",
            village="Rangwasa",
            tehsil="Rau",
            district="Indore",
            state="Madhya Pradesh",
            aadhaar_verified=True,
            bank_name="State Bank of India",
            account_number_mask="4092",
            ifsc_prefix="SBIN0000382",
            max_allotment_quintals=max_allotment
        )
    )

def mock_centre_operator():
    return AuthenticatedUser(
        id="u0000001-0000-0000-0000-000000000002",
        phone="9876543211",
        full_name="Vikram Singh",
        role="centre",
        is_active=True
    )

# ==============================================================================
# 1. AUTHENTICATION & RBAC TESTS
# ==============================================================================

@pytest.mark.asyncio
async def test_booking_no_auth_token():
    """Missing auth token must return 401 Unauthorized"""
    app.dependency_overrides.clear()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/farmer/bookings", json={
            "centre_id": "centre-b",
            "slot_id": "s001_available",
            "crop_id": "c0000001-0000-0000-0000-000000000001",
            "quantity_quintals": 10.0
        })
    assert res.status_code == 401
    assert res.json()["success"] is False

@pytest.mark.asyncio
async def test_booking_invalid_auth_token():
    """Invalid token must return 401 Unauthorized"""
    app.dependency_overrides.clear()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/farmer/bookings", headers={"Authorization": "Bearer bad-token"}, json={
            "centre_id": "centre-b",
            "slot_id": "s001_available",
            "crop_id": "c0000001-0000-0000-0000-000000000001",
            "quantity_quintals": 10.0
        })
    assert res.status_code == 401
    assert res.json()["success"] is False

@pytest.mark.asyncio
async def test_booking_non_farmer_forbidden():
    """Authenticated user with role 'centre' must receive 403 Forbidden"""
    app.dependency_overrides[get_current_user] = mock_centre_operator
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/farmer/bookings", json={
            "centre_id": "centre-b",
            "slot_id": "s001_available",
            "crop_id": "c0000001-0000-0000-0000-000000000001",
            "quantity_quintals": 10.0
        })
    assert res.status_code == 403
    assert "Insufficient role permissions" in res.json()["message"]
    app.dependency_overrides.clear()

# ==============================================================================
# 2. VALIDATION TESTS (Pydantic Request Schema)
# ==============================================================================

@pytest.mark.asyncio
async def test_booking_validation_missing_fields():
    """Missing required fields must return 400 Validation Error"""
    app.dependency_overrides[get_current_user] = mock_farmer
    app.dependency_overrides[get_db] = create_in_memory_test_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Missing centre_id
        res1 = await ac.post("/api/farmer/bookings", json={
            "slot_id": "s001_available",
            "crop_id": "c0000001-0000-0000-0000-000000000001",
            "quantity_quintals": 10.0
        })
        assert res1.status_code == 400

        # Missing slot_id
        res2 = await ac.post("/api/farmer/bookings", json={
            "centre_id": "centre-b",
            "crop_id": "c0000001-0000-0000-0000-000000000001",
            "quantity_quintals": 10.0
        })
        assert res2.status_code == 400

        # Missing crop_id
        res3 = await ac.post("/api/farmer/bookings", json={
            "centre_id": "centre-b",
            "slot_id": "s001_available",
            "quantity_quintals": 10.0
        })
        assert res3.status_code == 400
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_booking_validation_quantity_bounds():
    """Quantity must be > 0 and <= 500"""
    app.dependency_overrides[get_current_user] = mock_farmer
    app.dependency_overrides[get_db] = create_in_memory_test_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Zero quantity
        res_zero = await ac.post("/api/farmer/bookings", json={
            "centre_id": "centre-b", "slot_id": "s001_available", "crop_id": "c001", "quantity_quintals": 0
        })
        assert res_zero.status_code == 400

        # Negative quantity
        res_neg = await ac.post("/api/farmer/bookings", json={
            "centre_id": "centre-b", "slot_id": "s001_available", "crop_id": "c001", "quantity_quintals": -5
        })
        assert res_neg.status_code == 400

        # Exceeding domain limit of 500
        res_over = await ac.post("/api/farmer/bookings", json={
            "centre_id": "centre-b", "slot_id": "s001_available", "crop_id": "c001", "quantity_quintals": 501
        })
        assert res_over.status_code == 400
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_booking_forbidden_client_extra_fields():
    """Client cannot supply farmer_id, booking_status, or slot_date (extra forbidden)"""
    app.dependency_overrides[get_current_user] = mock_farmer
    app.dependency_overrides[get_db] = create_in_memory_test_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/farmer/bookings", json={
            "centre_id": "centre-b",
            "slot_id": "s001_available",
            "crop_id": "c0000001-0000-0000-0000-000000000001",
            "quantity_quintals": 10.0,
            "farmer_id": "hacked-farmer-id"
        })
        assert res.status_code == 400
        assert "Extra inputs are not permitted" in res.json()["message"]
    app.dependency_overrides.clear()


# ==============================================================================
# 3. DATABASE OFFLINE SAFETY TEST (WRITE GUARD)
# ==============================================================================

@pytest.mark.asyncio
async def test_booking_db_offline_raises_503():
    """CRITICAL: When PostgreSQL is offline, booking creation must return 503 and NEVER pretend to succeed"""
    app.dependency_overrides.clear()
    app.dependency_overrides[get_current_user] = mock_farmer
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/farmer/bookings", json={
            "centre_id": "centre-b",
            "slot_id": "s001_available",
            "crop_id": "c0000001-0000-0000-0000-000000000001",
            "quantity_quintals": 10.0
        })
    assert res.status_code == 503
    assert res.json()["success"] is False
    assert "Database Service Unavailable" in res.json()["message"]
    app.dependency_overrides.clear()

# ==============================================================================
# 4. RESOURCE VALIDATION & DOMAIN RULES (Transactional Engine Tests)
# ==============================================================================

@pytest.mark.asyncio
async def test_booking_centre_not_found():
    """Non-existent centre must return 404"""
    conn = create_in_memory_test_db()
    req = BookingCreateRequest(
        centre_id="non-existent-centre",
        slot_id="s001_available",
        crop_id="c0000001-0000-0000-0000-000000000001",
        quantity_quintals=20.0
    )
    with pytest.raises(Exception) as exc:
        await booking_service.create_booking(req, mock_farmer(), db_conn=conn)
    assert exc.value.status_code == 404
    assert "Procurement centre" in exc.value.detail

@pytest.mark.asyncio
async def test_booking_crop_not_found_or_inactive():
    """Non-existent or inactive crop must return 404"""
    conn = create_in_memory_test_db()
    # Non-existent crop
    req1 = BookingCreateRequest(
        centre_id="centre-b", slot_id="s001_available", crop_id="c999", quantity_quintals=20.0
    )
    with pytest.raises(Exception) as exc1:
        await booking_service.create_booking(req1, mock_farmer(), db_conn=conn)
    assert exc1.value.status_code == 404

    # Inactive crop
    req2 = BookingCreateRequest(
        centre_id="centre-b", slot_id="s001_available", crop_id="c0000001-0000-0000-0000-000000000002", quantity_quintals=20.0
    )
    with pytest.raises(Exception) as exc2:
        await booking_service.create_booking(req2, mock_farmer(), db_conn=conn)
    assert exc2.value.status_code == 404
    assert "inactive" in exc2.value.detail

@pytest.mark.asyncio
async def test_booking_slot_centre_mismatch():
    """Slot belonging to a different centre must return 400 Bad Request"""
    conn = create_in_memory_test_db()
    # s004_sanwer belongs to centre-a, not centre-b
    req = BookingCreateRequest(
        centre_id="centre-b",
        slot_id="s004_sanwer",
        crop_id="c0000001-0000-0000-0000-000000000001",
        quantity_quintals=15.0
    )
    with pytest.raises(Exception) as exc:
        await booking_service.create_booking(req, mock_farmer(), db_conn=conn)
    assert exc.value.status_code == 400
    assert "belongs to centre 'centre-a', not 'centre-b'" in exc.value.detail

@pytest.mark.asyncio
async def test_booking_slot_capacity_full_rejected():
    """Slot with booked_count == max_capacity must return 409 Conflict"""
    conn = create_in_memory_test_db()
    req = BookingCreateRequest(
        centre_id="centre-b",
        slot_id="s002_full",
        crop_id="c0000001-0000-0000-0000-000000000001",
        quantity_quintals=15.0
    )
    with pytest.raises(Exception) as exc:
        await booking_service.create_booking(req, mock_farmer(), db_conn=conn)
    assert exc.value.status_code == 409
    assert "Slot capacity reached" in exc.value.detail

@pytest.mark.asyncio
async def test_booking_quota_exceeded():
    """Request exceeding farmer's registered max_allotment_quintals must return 409 Conflict"""
    conn = create_in_memory_test_db()
    farmer_small_quota = mock_farmer(max_allotment=50.0)
    req = BookingCreateRequest(
        centre_id="centre-b",
        slot_id="s001_available",
        crop_id="c0000001-0000-0000-0000-000000000001",
        quantity_quintals=75.0  # Exceeds 50.0 quota
    )
    with pytest.raises(Exception) as exc:
        await booking_service.create_booking(req, farmer_small_quota, db_conn=conn)
    assert exc.value.status_code == 409
    assert "exceeds your registered land allotment quota" in exc.value.detail

@pytest.mark.asyncio
async def test_successful_booking_creation():
    """Successful booking reserves capacity, creates booking record, and issues PENDING_ARRIVAL token"""
    conn = create_in_memory_test_db()
    farmer = mock_farmer()
    req = BookingCreateRequest(
        centre_id="centre-b",
        slot_id="s001_available",
        crop_id="c0000001-0000-0000-0000-000000000001",
        variety="Sharbati Gold Grade A",
        quantity_quintals=45.0
    )
    res = await booking_service.create_booking(req, farmer, db_conn=conn)

    # 1. Verify Booking Response
    assert res.booking.booking_number.startswith("BK-2026-")
    assert res.booking.farmer_id == farmer.farmer_profile.id
    assert res.booking.centre_id == "centre-b"
    assert res.booking.slot_id == "s001_available"
    assert res.booking.quantity_quintals == 45.0
    assert res.booking.booking_status == "CONFIRMED"
    assert res.booking.stage_number == 2

    # 2. Verify Queue Token Response
    assert res.queue_token.token_number == "A101"
    assert res.queue_token.sequence_number == 1
    assert res.queue_token.status == "PENDING_ARRIVAL"
    assert res.queue_token.booking_id == res.booking.id

    # 3. Verify Database State
    cur = conn.cursor()
    cur.execute("SELECT booked_count FROM slots WHERE id = 's001_available'")
    assert cur.fetchone()["booked_count"] == 1

@pytest.mark.asyncio
async def test_same_farmer_same_day_duplicate_rejected():
    """A farmer holding an active booking cannot book another slot on the same day (409 Conflict)"""
    conn = create_in_memory_test_db()
    farmer = mock_farmer()
    req = BookingCreateRequest(
        centre_id="centre-b",
        slot_id="s001_available",
        crop_id="c0000001-0000-0000-0000-000000000001",
        quantity_quintals=25.0
    )
    # First booking succeeds
    await booking_service.create_booking(req, farmer, db_conn=conn)

    # Second booking on the same date (2026-09-15) must be rejected with 409
    with pytest.raises(Exception) as exc:
        await booking_service.create_booking(req, farmer, db_conn=conn)
    assert exc.value.status_code == 409
    assert "already holds an active booking" in exc.value.detail or "Conflict" in exc.value.detail

# ==============================================================================
# 5. TRANSACTION SAFETY & ROLLBACK TESTS
# ==============================================================================

@pytest.mark.asyncio
async def test_transaction_rollback_on_booking_failure():
    """If booking insertion fails, slot capacity must roll back (booked_count remains unchanged)"""
    conn = create_in_memory_test_db()
    farmer = mock_farmer()

    # Drop bookings table to induce failure after slot capacity update
    conn.execute("DROP TABLE bookings")

    req = BookingCreateRequest(
        centre_id="centre-b",
        slot_id="s001_available",
        crop_id="c0000001-0000-0000-0000-000000000001",
        quantity_quintals=20.0
    )

    with pytest.raises(Exception) as exc:
        await booking_service.create_booking(req, farmer, db_conn=conn)
    assert exc.value.status_code in (409, 500)

    # Verify slot booked_count rolled back to 0
    cur = conn.cursor()
    cur.execute("SELECT booked_count FROM slots WHERE id = 's001_available'")
    assert cur.fetchone()["booked_count"] == 0

@pytest.mark.asyncio
async def test_transaction_rollback_on_token_failure():
    """If queue_token creation fails, booking insertion and slot capacity must roll back"""
    conn = create_in_memory_test_db()
    farmer = mock_farmer()

    # Drop queue_tokens table to induce failure after booking insert
    conn.execute("DROP TABLE queue_tokens")

    req = BookingCreateRequest(
        centre_id="centre-b",
        slot_id="s001_available",
        crop_id="c0000001-0000-0000-0000-000000000001",
        quantity_quintals=20.0
    )

    with pytest.raises(Exception) as exc:
        await booking_service.create_booking(req, farmer, db_conn=conn)
    assert exc.value.status_code in (409, 500)

    # Verify booked_count rolled back to 0
    cur = conn.cursor()
    cur.execute("SELECT booked_count FROM slots WHERE id = 's001_available'")
    assert cur.fetchone()["booked_count"] == 0

    # Verify no dangling booking records exist
    cur.execute("SELECT COUNT(*) as cnt FROM bookings")
    assert cur.fetchone()["cnt"] == 0

# ==============================================================================
# 6. CONCURRENCY TEST
# ==============================================================================

@pytest.mark.asyncio
async def test_concurrency_nearly_full_slot_cannot_overbook():
    """
    Simulates concurrent booking attempts against a nearly full slot (capacity: 2, booked: 1).
    Three different farmers attempt to book the single remaining spot concurrently.
    PostgreSQL/Atomic row locking guarantees:
    - Exactly ONE booking succeeds (200/201)
    - All other bookings are rejected (409 Conflict)
    - booked_count NEVER exceeds max_capacity (<= 2)
    """
    conn = create_in_memory_test_db()

    farmer_a = mock_farmer(farmer_id="farmer_a")
    farmer_b = mock_farmer(farmer_id="farmer_b")
    farmer_c = mock_farmer(farmer_id="farmer_c")

    req = BookingCreateRequest(
        centre_id="centre-b",
        slot_id="s003_nearly_full",
        crop_id="c0000001-0000-0000-0000-000000000001",
        quantity_quintals=10.0
    )

    results = []
    for f in [farmer_a, farmer_b, farmer_c]:
        try:
            res = await booking_service.create_booking(req, f, db_conn=conn)
            results.append(("SUCCESS", res))
        except Exception as e:
            results.append(("FAILED", getattr(e, "status_code", 500)))

    successes = [r for r in results if r[0] == "SUCCESS"]
    failures = [r for r in results if r[0] == "FAILED"]

    # Exactly 1 success because slot had 1 space remaining (max 2, initial 1)
    assert len(successes) == 1
    assert len(failures) == 2
    for f in failures:
        assert f[1] == 409  # Conflict: slot full

    # Verify booked_count == max_capacity == 2 (NEVER OVERBOOKED)
    cur = conn.cursor()
    cur.execute("SELECT booked_count, max_capacity FROM slots WHERE id = 's003_nearly_full'")
    row = cur.fetchone()
    assert row["booked_count"] == 2
    assert row["booked_count"] <= row["max_capacity"]
