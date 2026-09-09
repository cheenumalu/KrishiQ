from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict

UserRole = Literal["farmer", "centre", "admin"]

class FarmerProfileSchema(BaseModel):
    id: str
    farmer_id_code: str
    village: str
    tehsil: str
    district: str
    state: str
    aadhaar_verified: bool
    bank_name: str
    account_number_mask: str
    ifsc_prefix: str
    max_allotment_quintals: float

    model_config = ConfigDict(from_attributes=True)

class AuthenticatedUser(BaseModel):
    id: str
    phone: str
    email: Optional[str] = None
    full_name: str
    role: UserRole
    is_active: bool = True
    farmer_profile: Optional[FarmerProfileSchema] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class UserProfileResponseData(BaseModel):
    user: AuthenticatedUser
