import os
import shutil
import re
from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from utils.file_extract import (
    extract_text_from_pdf_stream,
    extract_text_from_docx,
    extract_text_from_excel,
    convert_doc_to_docx
)
from utils.vectorstore import chunk_text, add_documents_to_vectorstore
from config import settings

router = APIRouter()


@router.post("/upload")
async def upload_document(user_id: str = Query(...), file: UploadFile = File(...)):
    allowed_extensions = {".pdf", ".doc", ".docx", ".xlsx", ".xls"}
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type")

    user_dir = os.path.join(settings.UPLOAD_DIR, user_id)
    os.makedirs(user_dir, exist_ok=True)

    file_path = os.path.join(user_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if file_extension == ".pdf":
        with open(file_path, "rb") as f:
            content = extract_text_from_pdf_stream(f)
    elif file_extension == ".docx":
        content = extract_text_from_docx(file_path)
    elif file_extension == ".doc":
        converted_path = file_path + "x"
        convert_doc_to_docx(file_path, converted_path)
        content = extract_text_from_docx(converted_path)
    else:  # Excel
        content = extract_text_from_excel(file_path)

    chunks = chunk_text(content, file.filename)
    add_documents_to_vectorstore(user_id, chunks)

    return {"message": f"{file.filename} uploaded"}
