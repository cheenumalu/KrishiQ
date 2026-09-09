import logging
from typing import List, Dict, Any, Optional
from datetime import date
from app.db.database import supabase_admin, check_db_connectivity, FALLBACK_CENTRES, FALLBACK_CROPS, generate_fallback_slots
from app.schemas.farmer import ProcurementCentreSchema, CropSchema, SlotSchema

logger = logging.getLogger("krishiq.farmer_service")

class FarmerService:
    """Service handling read-only discovery queries for Mandis, crops, and intake slots"""

    @staticmethod
    async def get_centres() -> List[ProcurementCentreSchema]:
        """Fetch active procurement centres from database or verified seed dataset"""
        is_connected, _ = check_db_connectivity()
        if is_connected and supabase_admin:
            try:
                res = supabase_admin.table("procurement_centres").select("*").order("distance_km").execute()
                if res.data:
                    return [ProcurementCentreSchema(**row) for row in res.data]
            except Exception as e:
                logger.error(f"Error querying procurement_centres table: {e}")

        # Fallback to verified seed catalog
        return [ProcurementCentreSchema(**c) for c in FALLBACK_CENTRES]

    @staticmethod
    async def get_crops() -> List[CropSchema]:
        """Fetch supported commodities with MSP rates and FAQ standards"""
        is_connected, _ = check_db_connectivity()
        if is_connected and supabase_admin:
            try:
                res = supabase_admin.table("crops").select("*").eq("is_active", True).order("name").execute()
                if res.data:
                    return [CropSchema(**row) for row in res.data]
            except Exception as e:
                logger.error(f"Error querying crops table: {e}")

        return [CropSchema(**c) for c in FALLBACK_CROPS]

    @staticmethod
    async def get_slots(centre_id: str, query_date: str) -> List[SlotSchema]:
        """
        Fetch intake slots for a given centre and date.
        Computes remaining_capacity = max_capacity - booked_count.
        Calculates status:
          - 'FULL' if remaining_capacity == 0
          - 'FILLING_FAST' if remaining_capacity <= 5
          - 'AVAILABLE' if remaining_capacity > 5
        """
        is_connected, _ = check_db_connectivity()
        if is_connected and supabase_admin:
            try:
                res = (
                    supabase_admin.table("slots")
                    .select("*")
                    .eq("centre_id", centre_id)
                    .eq("slot_date", query_date)
                    .order("start_time")
                    .execute()
                )
                if res.data and len(res.data) > 0:
                    slots = []
                    for row in res.data:
                        max_cap = row["max_capacity"]
                        booked = row["booked_count"]
                        rem = max(0, max_cap - booked)
                        status = "FULL" if rem == 0 else ("FILLING_FAST" if rem <= 5 else "AVAILABLE")
                        slots.append(SlotSchema(
                            id=row["id"],
                            centre_id=row["centre_id"],
                            slot_date=str(row["slot_date"]),
                            time_window=row["time_window"],
                            start_time=str(row["start_time"]),
                            end_time=str(row["end_time"]),
                            max_capacity=max_cap,
                            booked_count=booked,
                            remaining_capacity=rem,
                            status=status
                        ))
                    return slots
            except Exception as e:
                logger.error(f"Error querying slots table: {e}")

        # Fallback to seed availability slots
        seed_slots = generate_fallback_slots(centre_id, query_date)
        return [SlotSchema(**s) for s in seed_slots]

farmer_service = FarmerService()
