from typing import Any, Optional, Generic, TypeVar
from pydantic import BaseModel
from fastapi.responses import JSONResponse

T = TypeVar("T")

class ApiResponse(BaseModel, Generic[T]):
    """Standard API Success Response Envelope matching KrishiQ frontend contracts"""
    success: bool = True
    message: Optional[str] = None
    data: T

class ApiErrorResponse(BaseModel):
    """Standard API Error Response Envelope"""
    success: bool = False
    message: str
    errors: Optional[Any] = None

def api_success(data: Any, message: Optional[str] = None, status_code: int = 200) -> JSONResponse:
    """Helper to return a standardized JSON response"""
    content = {
        "success": True,
        "message": message or "Request processed successfully",
        "data": data
    }
    return JSONResponse(status_code=status_code, content=content)

def api_error(message: str, status_code: int = 400, errors: Optional[Any] = None) -> JSONResponse:
    """Helper to return a standardized error JSON response"""
    content = {
        "success": False,
        "message": message,
        "errors": errors
    }
    return JSONResponse(status_code=status_code, content=content)
