from fastapi import FastAPI

from backend.api.health import router as health_router
from backend.api.upload import router as upload_router
from backend.api.jobs import router as jobs_router

from backend.api.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

#app = FastAPI(
  #  title="Addit AI API",
 #   version="0.1.0",
#   description="Backend API for Addit AI"
#)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=False,

    allow_methods=["*"],

    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(upload_router)
app.include_router(jobs_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to Addit AI 🚀",
        "status": "Running"
    }