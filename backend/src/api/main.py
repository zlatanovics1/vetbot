from fastapi import APIRouter
from src.api.routers import appointment_router, faq_router

router = APIRouter(prefix="/api/v1")

router.include_router(appointment_router.router)
router.include_router(faq_router.router)

# should probably be used out of api/v1, but used here for less main file clutter
@router.get("/health")
async def health():
    return {"message": "OK"}