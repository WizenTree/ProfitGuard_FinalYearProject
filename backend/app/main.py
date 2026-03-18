# from fastapi import FastAPI
# from app.routes import analyze

# app = FastAPI()

# app.include_router(analyze.router)

# @app.get("/")
# def home():
#     return {"message": "Backend running"}

from fastapi import FastAPI
from app.routes import upload, analyze, health

app = FastAPI(title="Profit Guard API")

app.include_router(upload.router, prefix="/upload")
app.include_router(analyze.router, prefix="/analyze")
app.include_router(health.router, prefix="/health")