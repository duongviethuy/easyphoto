from fastapi import APIRouter
from app.api.endpoints.health import router as health_router
from app.api.endpoints.remove_bg import router as rmbg_router

router = APIRouter()
router.include_router(health_router)
router.include_router(rmbg_router)
