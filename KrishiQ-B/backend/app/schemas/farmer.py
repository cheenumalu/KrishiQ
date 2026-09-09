from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict, Field

SlotStatus = Literal["AVAILABLE", "FILLING_FAST", "FULL"]
CentreStatus = Literal["normal", "warning", "critical"]

class ProcurementCentreSchema(BaseModel):
    id: str
    name: str
    code: str
    district: str
    state: str = "Madhya Pradesh"
    distance_km: float = 0.0
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    active_counters: int = 4
    total_capacity_per_day: int = 300
    operating_hours: str = "08:00 AM - 06:00 PM"
    status: CentreStatus = "normal"

    model_config = ConfigDict(from_attributes=True)

class CropSchema(BaseModel):
    id: str
    name: str
    msp_per_quintal: float
    max_moisture_percent: float = 12.0
    max_dockage_percent: float = 1.0
    max_foreign_matter_percent: float = 1.5
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)

class SlotSchema(BaseModel):
    id: str
    centre_id: str
    slot_date: str
    time_window: str
    start_time: str
    end_time: str
    max_capacity: int
    booked_count: int
    remaining_capacity: int
    status: SlotStatus

    model_config = ConfigDict(from_attributes=True)
