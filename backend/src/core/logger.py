import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Optional: configure handlers/formatters only once
if not logger.hasHandlers():
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(name)s - %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)