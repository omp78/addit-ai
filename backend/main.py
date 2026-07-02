from fastapi import FastAPI

app = FastAPI(
    title="Addit AI API",
    version="0.1.0",
    description="Backend API for Addit AI"
)

@app.get("/")
def root():
    return {
        "message": "Welcome to Addit AI 🚀",
        "status": "Running"
    }