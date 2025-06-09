# See `Dockerfile` for details.
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

# Disable Python downloads, because we want to use the system interpreter
# across both images. If using a managed Python version, it needs to be
# copied from the build image into the final image
ENV UV_PYTHON_DOWNLOADS=0
# ENV PORT=8080

WORKDIR /app
COPY pyproject.toml uv.lock ./

RUN uv sync --frozen --no-install-project --no-dev

COPY . /app

# Then, use a final image without uv
FROM python:3.12-slim-bookworm
# It is important to use the image that matches the builder (python:3.12-slim-bookworm)

# Copy the application from the builder
COPY --from=builder /app /app

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app"

CMD ["uvicorn", "main:app", "--port", "8080", "--host", "0.0.0.0"]
# CMD ["sleep", "infinity"]