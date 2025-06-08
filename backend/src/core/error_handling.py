from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from src.core.logger import logger


def init_error_handling(app: FastAPI):
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        logger.warning(
            f"HTTP {exc.status_code} error during {request.method} {request.url.path}",
            extra={
                "headers": dict(request.headers),
                "detail": exc.detail
            }
        )  
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
    
    @app.exception_handler(RequestValidationError)
    async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={"detail": exc.errors()}
        )
    
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={
                "detail": "An unexpected error occurred",
                "path": request.url.path
            }
        )

