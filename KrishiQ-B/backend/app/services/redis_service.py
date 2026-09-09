import logging
from typing import Optional
import redis.asyncio as aioredis
from app.core.config import settings

logger = logging.getLogger("krishiq.redis")

class RedisService:
    """
    Redis Service Abstraction for Live/Realtime Queue Management.
    Designed with graceful degradation: if Redis is unavailable, operations
    log a warning and return fallback values without breaking read-only APIs.
    """
    def __init__(self):
        self._client: Optional[aioredis.Redis] = None
        self._is_available: bool = False

    async def get_client(self) -> Optional[aioredis.Redis]:
        if self._client is None:
            try:
                self._client = aioredis.from_url(
                    settings.REDIS_URL,
                    encoding="utf-8",
                    decode_responses=True,
                    socket_connect_timeout=2.0
                )
            except Exception as e:
                logger.warning(f"Failed to initialize Redis client: {e}")
                self._client = None
        return self._client

    async def ping(self) -> bool:
        """Verify Redis connectivity"""
        try:
            client = await self.get_client()
            if client:
                res = await client.ping()
                self._is_available = bool(res)
                return self._is_available
        except Exception as e:
            logger.debug(f"Redis ping failed (service likely offline): {e}")
            self._is_available = False
        return False

    async def get(self, key: str) -> Optional[str]:
        """Fetch cached string or queue item"""
        try:
            client = await self.get_client()
            if client:
                return await client.get(key)
        except Exception as e:
            logger.warning(f"Redis GET failed for key {key}: {e}")
        return None

    async def set(self, key: str, value: str, expire_seconds: Optional[int] = None) -> bool:
        """Store string with optional TTL"""
        try:
            client = await self.get_client()
            if client:
                await client.set(key, value, ex=expire_seconds)
                return True
        except Exception as e:
            logger.warning(f"Redis SET failed for key {key}: {e}")
        return False

    async def delete(self, key: str) -> bool:
        """Delete key from cache/queue"""
        try:
            client = await self.get_client()
            if client:
                await client.delete(key)
                return True
        except Exception as e:
            logger.warning(f"Redis DELETE failed for key {key}: {e}")
        return False

    async def close(self) -> None:
        """Gracefully close connection"""
        if self._client:
            await self._client.aclose()
            self._client = None

redis_service = RedisService()
