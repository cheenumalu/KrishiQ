import time
from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings
from app.db.database import check_db_connectivity
from app.services.redis_service import redis_service
from app.utils.response import api_success

router = APIRouter(prefix="/health", tags=["Health"])

START_TIME = time.time()

@router.get("", summary="System Health & Infrastructure Diagnostics")
async def health_check():
    db_connected, db_message = check_db_connectivity()
    redis_connected = await redis_service.ping()
    
    status_str = "healthy" if (db_connected or settings.ENV == "development") else "degraded"
    
    data = {
        "status": status_str,
        "uptime_seconds": round(time.time() - START_TIME, 2),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "environment": settings.ENV,
        "version": settings.APP_VERSION,
        "infrastructure": {
            "database": {
                "connected": db_connected,
                "detail": db_message
            },
            "redis": {
                "connected": redis_connected,
                "detail": "Connected to Redis" if redis_connected else "Redis offline / unavailable (optional)"
            }
        }
    }
    return api_success(data=data, message="KrishiQ Backend Operational")
