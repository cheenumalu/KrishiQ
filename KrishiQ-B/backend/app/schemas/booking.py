from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict, Field

BookingStatus = Literal["CONFIRMED", "RESCHEDULED", "CANCELLED", "COMPLETED"]
QueueTokenStatus = Literal["PENDING_ARRIVAL", "WAITING", "SERVING", "COMPLETED", "NO_SHOW"]

class BookingCreateRequest(BaseModel):
    """
    Client request schema for scheduling a procurement intake slot.
    Security Notice:
    - farmer_id is NOT accepted from client (derived from authenticated session)
    - booking_status is NOT accepted from client (initialized by system)
    - slot_date is NOT accepted from client (derived from slot record in DB)
    - extra fields are strictly forbidden
    """
    centre_id: str = Field(..., min_length=1, max_length=50, description="Procurement centre ID (e.g. 'centre-b')")
    slot_id: str = Field(..., min_length=1, max_length=50, description="Intake slot UUID")
    crop_id: str = Field(..., min_length=1, max_length=50, description="Commodity crop UUID")
    variety: Optional[str] = Field(default="Standard Grade A", min_length=1, max_length=100, description="Crop variety name")
    quantity_quintals: float = Field(..., gt=0.0, le=500.0, description="Intake lot size in quintals (positive, max 500)")

    model_config = ConfigDict(extra="forbid")

class QueueTokenResponse(BaseModel):
    id: str
    booking_id: str
    centre_id: str
    token_number: str
    sequence_number: int
    queue_date: str
    status: QueueTokenStatus
    assigned_counter: Optional[str] = None
    estimated_wait_minutes: int = 30
    created_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class BookingResponse(BaseModel):
    id: str
    booking_number: str
    farmer_id: str
    centre_id: str
    slot_id: str
    slot_date: str
    crop_id: str
    variety: str
    quantity_quintals: float
    booking_status: BookingStatus
    stage_number: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class BookingCreateResponseData(BaseModel):
    booking: BookingResponse
    queue_token: QueueTokenResponse
