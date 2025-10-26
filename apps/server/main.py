from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, chat, documents

app = FastAPI(title="DocChat RAG API (Multi-User)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(upload.router)
app.include_router(chat.router)
app.include_router(documents.router)


# uvicorn app.main:app --reload
