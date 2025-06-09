from fastapi import FastAPI
from dotenv import load_dotenv
load_dotenv()
from fastapi.openapi.docs import get_swagger_ui_html
from src.consts import APP_ENV, SENTRY_DSN
from src.api.main import router as api_router
from src.core.middlewares import init_middlewares
from src.core.error_handling import init_error_handling
import sentry_sdk

if APP_ENV == "production":
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        send_default_pii=True,
        enable_tracing=True
    )


app = FastAPI(title="VetBot API",openapi_url="/api/v1/openapi.json",docs_url=None,redoc_url=None)

@app.get("/api/v1/docs", include_in_schema=False)
def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title="VetBot API Docs",
    )

init_middlewares(app)
init_error_handling(app)

app.include_router(api_router) 
