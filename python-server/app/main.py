import os
from fastapi import FastAPI
from dotenv import load_dotenv
from app.api.router import router as api_router

load_dotenv()

app = FastAPI(title=os.getenv("APP_NAME", "EasyPhoto Server"))
app.include_router(api_router)
