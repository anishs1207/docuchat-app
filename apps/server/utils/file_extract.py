import subprocess
import os
import re
import pandas as pd
from PyPDF2 import PdfReader
from docx import Document as DocxDocument
from config import settings


def extract_text_from_excel(file_path: str) -> str:
    excel_file = pd.ExcelFile(file_path)
    sheet_texts = []
    for sheet in excel_file.sheet_names:
        df = pd.read_excel(file_path, sheet_name=sheet)
        sheet_texts.append(f"Sheet: {sheet}\n{df.to_string(index=False)}")
    return "\n\n".join(sheet_texts)


def extract_text_from_pdf_stream(file_stream) -> str:
    reader = PdfReader(file_stream)
    return " ".join([page.extract_text() or "" for page in reader.pages])


def extract_text_from_docx(file_path: str) -> str:
    doc = DocxDocument(file_path)
    return " ".join([p.text for p in doc.paragraphs])


def convert_doc_to_docx(doc_path: str, docx_path: str):
    subprocess.run([
        "soffice", "--headless", "--convert-to", "docx",
        "--outdir", os.path.dirname(docx_path), doc_path
    ], check=True)


def extract_mentioned_docs(query: str):
    return re.findall(r'@([\w\-. ]+\.(?:pdf|doc|docx))', query, flags=re.IGNORECASE)
