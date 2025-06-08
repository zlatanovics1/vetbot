from fastapi import APIRouter
from src.api.routers import appointment_router, faq_router

router = APIRouter(prefix="/api/v1")

router.include_router(appointment_router.router)
router.include_router(faq_router.router)

@router.get("/health")
async def health():
    return {"message": "OK"}