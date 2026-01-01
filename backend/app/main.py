from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router
from app.core.database import engine, Base
from app.core.config import settings
from app.models import db as db_models, user as user_models # Register models

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

from fastapi import Request
from fastapi.responses import JSONResponse
from app.core.exceptions import NoTranscriptError

@app.exception_handler(NoTranscriptError)
async def no_transcript_exception_handler(request: Request, exc: NoTranscriptError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.message, "code": "NO_TRANSCRIPT"},
    )

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify backend status.
    """
    return {"status": "ok", "service": "chefstream-backend"}
