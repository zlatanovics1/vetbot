import uuid
from fastapi import FastAPI, Request
# from src.core.logger import logger
from src.consts import APP_ENV
from fastapi.middleware.cors import CORSMiddleware

def init_middlewares(app: FastAPI):
    @app.middleware("http")
    async def correlation_id_middleware(request: Request, call_next):
        correlation_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        request.state.correlation_id = correlation_id

        response = await call_next(request)
        response.headers["X-Correlation-ID"] = correlation_id
        return response

    origins = [
    "http://localhost:3000" if APP_ENV == "local" else "https://vetbot-jade.vercel.app"
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
