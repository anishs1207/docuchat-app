import os
from fastapi import APIRouter, Query
from config import settings

router = APIRouter()


@router.get("/documents")
async def list_documents(user_id: str = Query(...)):
    user_dir = os.path.join(settings.UPLOAD_DIR, user_id)
    if not os.path.exists(user_dir):
        return {"available_documents": []}
    return {"available_documents": os.listdir(user_dir)}
