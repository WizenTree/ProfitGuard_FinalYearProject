from fastapi import FastAPI
from app.routes import analyze

app = FastAPI()

app.include_router(analyze.router)

@app.get("/")
def home():
    return {"message": "Backend running"}