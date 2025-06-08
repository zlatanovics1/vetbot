from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()

from .consts import APP_ENV
from src.api.main import router as api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000" if APP_ENV == "local" else "https://pet-care-frontend.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins="*", #todo change to only allow the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router)