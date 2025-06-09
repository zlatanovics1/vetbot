from fastapi import FastAPI
from dotenv import load_dotenv
load_dotenv()


from .consts import SENTRY_DSN
from src.api.main import router as api_router
from src.core.middlewares import init_middlewares
from src.core.error_handling import init_error_handling
import sentry_sdk

sentry_sdk.init(
    dsn=SENTRY_DSN,
    send_default_pii=True,
    # environment=APP_ENV,
)

app = FastAPI()

init_middlewares(app)
init_error_handling(app)

app.include_router(api_router) 
