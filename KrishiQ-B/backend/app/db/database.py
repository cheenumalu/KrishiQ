import logging
from typing import Optional, Tuple, List, Dict, Any
from datetime import date
from fastapi import HTTPException, status
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger("krishiq.db")

# Global Supabase clients
supabase: Optional[Client] = None
supabase_admin: Optional[Client] = None

def init_supabase() -> None:
    """Safely initialize Supabase clients without crashing if credentials are dummy"""
    global supabase, supabase_admin
    try:
        if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
            supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
            admin_key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
            supabase_admin = create_client(settings.SUPABASE_URL, admin_key)
            logger.info("Supabase client initialized successfully.")
    except Exception as e:
        logger.warning(f"Failed to initialize Supabase client: {e}")
        supabase = None
        supabase_admin = None

init_supabase()

def check_db_connectivity() -> Tuple[bool, str]:
    """
    Explicitly checks whether the live PostgreSQL / Supabase database is connected.
    Returns (is_connected: bool, message: str)
    """
    if not settings.SUPABASE_URL or "your-project-id" in settings.SUPABASE_URL:
        return False, "Database disconnected: SUPABASE_URL contains placeholder credentials in .env"
    
    if supabase_admin is None:
        return False, "Database client is not initialized"
        
    try:
        # Perform lightweight count probe
        res = supabase_admin.table("procurement_centres").select("id").limit(1).execute()
        return True, "Connected to Supabase PostgreSQL"
    except Exception as e:
        return False, f"Database connectivity probe failed: {str(e)}"

def require_live_db() -> Client:
    """
    FastAPI dependency enforcing live PostgreSQL/Supabase database connectivity
    for all WRITE / state-changing operations (such as booking creation, slot reservation).
    Raises HTTP 503 Service Unavailable if the database is unreachable.
    Guarantees state-changing operations NEVER operate on fallback/mock data or pretend to succeed.
    """
    is_connected, detail = check_db_connectivity()
    if not is_connected or supabase_admin is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database Service Unavailable: Cannot perform state-changing operation. {detail}"
        )
    return supabase_admin

def get_db_connection():
    """
    Returns a live, transaction-capable PostgreSQL connection via psycopg.
    Raises HTTPException(503) if database is unreachable or unconfigured.
    """
    is_connected, detail = check_db_connectivity()
    if not is_connected:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database Service Unavailable: Cannot perform state-changing operation. {detail}"
        )
    if not settings.DATABASE_URL:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database Service Unavailable: Direct PostgreSQL connection URL (DATABASE_URL) is not configured in .env."
        )
    try:
        import psycopg
        from psycopg.rows import dict_row
        return psycopg.connect(settings.DATABASE_URL, row_factory=dict_row)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database Service Unavailable: Failed to establish PostgreSQL transaction: {str(e)}"
        )

def get_db():
    """FastAPI dependency yielding live database connection"""
    return get_db_connection()



# ==============================================================================
# SEED / DEMO FALLBACK DATA FOR LOCAL OFFLINE VERIFICATION & SIH DEMO
# Matches backend/database/02_seed.sql exactly
# ==============================================================================
FALLBACK_CENTRES: List[Dict[str, Any]] = [
    {
        "id": "centre-b",
        "name": "Indore Main Mandi (Laxmi Bai Nagar)",
        "code": "MP-IND-01",
        "district": "Indore",
        "state": "Madhya Pradesh",
        "distance_km": 4.2,
        "latitude": 22.7533,
        "longitude": 75.8647,
        "active_counters": 8,
        "total_capacity_per_day": 450,
        "operating_hours": "08:00 AM - 07:00 PM",
        "status": "critical"
    },
    {
        "id": "centre-a",
        "name": "Sanwer Sub-Mandi Hub",
        "code": "MP-IND-02",
        "district": "Indore",
        "state": "Madhya Pradesh",
        "distance_km": 11.5,
        "latitude": 22.9774,
        "longitude": 75.8300,
        "active_counters": 4,
        "total_capacity_per_day": 250,
        "operating_hours": "08:00 AM - 06:00 PM",
        "status": "normal"
    },
    {
        "id": "centre-c",
        "name": "Mhow Krishi Upaj Mandi",
        "code": "MP-IND-03",
        "district": "Indore",
        "state": "Madhya Pradesh",
        "distance_km": 18.2,
        "latitude": 22.5539,
        "longitude": 75.7644,
        "active_counters": 5,
        "total_capacity_per_day": 300,
        "operating_hours": "08:00 AM - 06:00 PM",
        "status": "warning"
    },
    {
        "id": "centre-d",
        "name": "Depalpur APMC Centre",
        "code": "MP-IND-04",
        "district": "Indore",
        "state": "Madhya Pradesh",
        "distance_km": 26.0,
        "latitude": 22.8532,
        "longitude": 75.5489,
        "active_counters": 3,
        "total_capacity_per_day": 200,
        "operating_hours": "08:30 AM - 05:30 PM",
        "status": "normal"
    },
    {
        "id": "centre-e",
        "name": "Rau Cooperative Procurement Hub",
        "code": "MP-IND-05",
        "district": "Indore",
        "state": "Madhya Pradesh",
        "distance_km": 7.8,
        "latitude": 22.6341,
        "longitude": 75.8038,
        "active_counters": 4,
        "total_capacity_per_day": 220,
        "operating_hours": "08:00 AM - 06:00 PM",
        "status": "normal"
    }
]

FALLBACK_CROPS: List[Dict[str, Any]] = [
    {"id": "c0000001-0000-0000-0000-000000000001", "name": "Wheat", "msp_per_quintal": 2275.0, "max_moisture_percent": 12.0, "max_dockage_percent": 1.0, "max_foreign_matter_percent": 1.5, "is_active": True},
    {"id": "c0000001-0000-0000-0000-000000000002", "name": "Paddy", "msp_per_quintal": 2183.0, "max_moisture_percent": 14.0, "max_dockage_percent": 1.5, "max_foreign_matter_percent": 2.0, "is_active": True},
    {"id": "c0000001-0000-0000-0000-000000000003", "name": "Soybean", "msp_per_quintal": 4600.0, "max_moisture_percent": 10.0, "max_dockage_percent": 2.0, "max_foreign_matter_percent": 2.0, "is_active": True},
    {"id": "c0000001-0000-0000-0000-000000000004", "name": "Maize", "msp_per_quintal": 2090.0, "max_moisture_percent": 14.0, "max_dockage_percent": 1.5, "max_foreign_matter_percent": 1.5, "is_active": True},
    {"id": "c0000001-0000-0000-0000-000000000005", "name": "Cotton", "msp_per_quintal": 6620.0, "max_moisture_percent": 8.0, "max_dockage_percent": 2.0, "max_foreign_matter_percent": 2.0, "is_active": True},
    {"id": "c0000001-0000-0000-0000-000000000006", "name": "Mustard", "msp_per_quintal": 5650.0, "max_moisture_percent": 9.0, "max_dockage_percent": 1.0, "max_foreign_matter_percent": 1.0, "is_active": True}
]

def generate_fallback_slots(centre_id: str, query_date: str) -> List[Dict[str, Any]]:
    """Generates standard 30-min intake slots matching 02_seed.sql availability profiles"""
    base_windows = [
        ("08:00", "08:30", 20, 20 if centre_id == "centre-b" else 0),  # Full slot if centre-b
        ("08:30", "09:00", 20, 18 if centre_id == "centre-b" else 2),  # Filling fast if centre-b
        ("09:00", "09:30", 20, 10 if centre_id == "centre-b" else 5),
        ("09:30", "10:00", 20, 0),
        ("10:00", "10:30", 20, 2),
        ("10:30", "11:00", 20, 0),
        ("11:00", "11:30", 20, 0),
        ("11:30", "12:00", 20, 0)
    ]
    slots = []
    for idx, (start, end, max_cap, booked) in enumerate(base_windows, start=1):
        rem = max_cap - booked
        status = "FULL" if rem == 0 else ("FILLING_FAST" if rem <= 5 else "AVAILABLE")
        slots.append({
            "id": f"s0000001-0000-0000-0000-{str(idx).zfill(12)}",
            "centre_id": centre_id,
            "slot_date": query_date,
            "time_window": f"{start} - {end}",
            "start_time": f"{start}:00",
            "end_time": f"{end}:00",
            "max_capacity": max_cap,
            "booked_count": booked,
            "remaining_capacity": rem,
            "status": status
        })
    return slots
