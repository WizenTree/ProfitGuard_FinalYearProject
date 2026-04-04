from fastapi import FastAPI
from app.routes import upload, analyze, health
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Profit Guard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/upload")
app.include_router(analyze.router, prefix="/analyze")
app.include_router(health.router, prefix="/health")

@app.get("/")
def root():
    return {
        "service": "Profit Guard API",
        "status": "running",
        "version": "1.0.0"
    }