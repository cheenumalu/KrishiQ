from datetime import datetime
from typing import List
from fastapi import APIRouter, Query, HTTPException, status, Depends
from app.services.farmer_service import farmer_service
from app.services.booking_service import booking_service
from app.schemas.farmer import ProcurementCentreSchema, CropSchema, SlotSchema
from app.schemas.booking import BookingCreateRequest
from app.schemas.auth import AuthenticatedUser
from app.core.security import require_role
from app.db.database import get_db
from app.utils.response import api_success

router = APIRouter(prefix="/farmer", tags=["Farmer Operations"])

@router.get("/centres", summary="List All Active Procurement Centres (APMC Mandis)")
async def get_procurement_centres(
    current_user: AuthenticatedUser = Depends(require_role("farmer"))
):
    """Returns list of operational APMC Mandis with distance, active counters, and congestion status"""
    centres = await farmer_service.get_centres()
    return api_success(
        data=[c.model_dump() for c in centres],
        message="Procurement centres retrieved successfully"
    )

@router.get("/crops", summary="List Supported MSP Commodities & FAQ Standards")
async def get_crops(
    current_user: AuthenticatedUser = Depends(require_role("farmer"))
):
    """Returns catalog of government-supported crops with Minimum Support Prices per quintal"""
    crops = await farmer_service.get_crops()
    return api_success(
        data=[c.model_dump() for c in crops],
        message="Supported crops retrieved successfully"
    )

@router.get("/slots", summary="Query 30-Minute Intake Slots & Live Capacity")
async def get_slots(
    centre_id: str = Query(..., alias="centreId", description="Procurement centre ID (e.g. 'centre-b')"),
    query_date: str = Query(..., alias="date", description="Scheduled arrival date (YYYY-MM-DD)"),
    current_user: AuthenticatedUser = Depends(require_role("farmer"))
):
    """
    Returns available 30-minute intake windows for a selected centre and date.
    Calculates remaining_capacity = max_capacity - booked_count.
    Exposes availability status: 'AVAILABLE', 'FILLING_FAST', or 'FULL'.
    """
    # 1. Validate Date Format (YYYY-MM-DD)
    try:
        datetime.strptime(query_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format for 'date' parameter. Expected format: YYYY-MM-DD (e.g. 2026-09-15)."
        )

    # 2. Validate Centre ID Presence
    if not centre_id or not centre_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query parameter 'centreId' cannot be empty."
        )

    # 3. Retrieve Slots
    slots = await farmer_service.get_slots(centre_id=centre_id.strip(), query_date=query_date)
    
    return api_success(
        data=[s.model_dump() for s in slots],
        message=f"Retrieved {len(slots)} intake slots for centre '{centre_id}' on {query_date}"
    )

@router.post("/bookings", status_code=status.HTTP_201_CREATED, summary="Create a Procurement Intake Slot Booking")
async def create_booking(
    req: BookingCreateRequest,
    current_user: AuthenticatedUser = Depends(require_role("farmer")),
    db_conn = Depends(get_db)
):
    """
    Creates an appointment booking and automatically allocates a queue token (status: 'PENDING_ARRIVAL').
    
    Security & Integrity:
    - Farmer identity is strictly bound to the authenticated session (farmer_id cannot be supplied by client).
    - Checks individual farmer land allotment quota (max_allotment_quintals).
    - Enforces that a farmer holds at most ONE active booking per calendar day.
    - Atomically reserves slot capacity to prevent race conditions.
    - Requires a live PostgreSQL database connection; returns 503 if offline.
    """
    res = await booking_service.create_booking(req, current_user, db_conn=db_conn)
    return api_success(
        data=res.model_dump(),
        message="Booking created successfully. Intake slot reserved."
    )


