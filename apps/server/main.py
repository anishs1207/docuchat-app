# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from routes import upload, chat, documents

# app = FastAPI(title="DocChat RAG API (Multi-User)")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Register routers
# app.include_router(upload.router)
# app.include_router(chat.router)
# app.include_router(documents.router)


# # uvicorn app.main:app --reload


import subprocess
from typing import List, Optional
import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document
from fastapi import FastAPI, UploadFile, File, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import warnings
import shutil
import re
from docx import Document as DocxDocument
import pandas as pd

warnings.filterwarnings('ignore')

# Load environment variables
load_dotenv()


def extract_text_from_excel(file_path: str) -> str:
    """Extracts text from all sheets in an Excel file."""
    try:
        excel_file = pd.ExcelFile(file_path)
        sheet_texts = []
        for sheet in excel_file.sheet_names:
            df = pd.read_excel(file_path, sheet_name=sheet)
            # Convert DataFrame to string without index for cleaner output
            sheet_texts.append(f"Sheet: {sheet}\n{df.to_string(index=False)}")
        return "\n\n".join(sheet_texts)
    except Exception as e:
        raise RuntimeError(f"Error extracting Excel: {e}")


def convert_doc_to_docx(doc_path: str, docx_path: str):
    subprocess.run(["soffice", "--headless", "--convert-to", "docx", "--outdir",
                    os.path.dirname(docx_path), doc_path], check=True)

# --- Configuration ---


class Settings:
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    LANGCHAIN_API_KEY = os.getenv("LANGCHAIN_API_KEY")
    LANGCHAIN_PROJECT = os.getenv("LANGCHAIN_PROJECT")
    CHUNK_SIZE = 1000
    CHUNK_OVERLAP = 200
    UPLOAD_DIR = "./uploaded_pdfs"
    CHROMA_PERSIST_DIR = "./chroma_store"


settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_API_KEY"] = settings.LANGCHAIN_API_KEY
os.environ["LANGCHAIN_PROJECT"] = settings.LANGCHAIN_PROJECT

# --- Models ---
chat_model = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    convert_system_message_to_human=True,
    google_api_key=settings.GOOGLE_API_KEY
)

embedding_model = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=settings.GOOGLE_API_KEY
)

# --- Utils ---


def extract_text_from_pdf_stream(file_stream) -> str:
    reader = PdfReader(file_stream)
    return " ".join([page.extract_text() or "" for page in reader.pages])


def extract_text_from_docx(file_path: str) -> str:
    """Extracts text from a .docx file."""
    doc = DocxDocument(file_path)
    return " ".join([paragraph.text for paragraph in doc.paragraphs])


def chunk_text(text: str, source_filename: str):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP
    )
    documents = splitter.create_documents([text])
    for doc in documents:
        doc.metadata["source"] = source_filename
    return documents


def get_vectorstore_for_user(user_id: str):
    user_vectorstore_dir = os.path.join(settings.CHROMA_PERSIST_DIR, user_id)
    os.makedirs(user_vectorstore_dir, exist_ok=True)

    return Chroma(
        persist_directory=user_vectorstore_dir,
        embedding_function=embedding_model,
        collection_name="doc_chunks"
    )


def add_documents_to_vectorstore(user_id: str, documents: List[Document]):
    vectorstore = get_vectorstore_for_user(user_id)
    vectorstore.add_documents(documents)
    vectorstore.persist()
    print(
        f"User '{user_id}' -> Added {len(documents)} chunks. Total: {vectorstore._collection.count()}")


def convert_doc_to_docx(doc_path: str, docx_path: str):
    # Requires LibreOffice installed
    subprocess.run([
        "soffice", "--headless", "--convert-to", "docx",
        "--outdir", os.path.dirname(docx_path), doc_path
    ], check=True)


def extract_mentioned_docs(query: str) -> List[str]:
    # Capture full filename for .pdf, .doc, and .docx without grouping that breaks results
    return re.findall(r'@([\w\-. ]+\.(?:pdf|doc|docx))', query, flags=re.IGNORECASE)


def build_rag_chain(vectorstore, filter_sources: Optional[List[str]] = None):
    retriever_args = {
        "search_type": "similarity",
        "search_kwargs": {"k": 5}
    }
    if filter_sources:
        retriever_args["search_kwargs"]["filter"] = {
            "source": {"$in": filter_sources}
        }

    retriever = vectorstore.as_retriever(**retriever_args)

    prompt = ChatPromptTemplate.from_template("""
    Use the following context to answer the user's question.
    If you don't know the answer, just say you don't know.
    Do NOT use Markdown formatting like *, **, or bullet points.
    Respond in plain, readable sentences.
    Summarize in simple, clear language.
    
    Input the answer in simple plain text format only
                                              
    Context:
    {context}

    Question:
    {input}
    """)

    document_chain = create_stuff_documents_chain(chat_model, prompt)
    return create_retrieval_chain(retriever, document_chain)


app = FastAPI(title="DocChat RAG API (Multi-User)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload")
async def upload_document(
    user_id: str = Query(...),
    file: UploadFile = File(...)
):
    allowed_extensions = {".pdf", ".doc", ".docx", ".xlsx", ".xls"}
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400, detail=f"Only {', '.join(allowed_extensions)} files allowed.")

    user_dir = os.path.join(settings.UPLOAD_DIR, user_id)
    os.makedirs(user_dir, exist_ok=True)

    file_path = os.path.join(user_dir, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        content = ""

        if file_extension == ".pdf":
            with open(file_path, "rb") as f:
                content = extract_text_from_pdf_stream(f)
        elif file_extension == ".docx":
            content = extract_text_from_docx(file_path)
        elif file_extension == ".doc":
            converted_path = file_path + "x"  # adds 'x' to make .docx
            convert_doc_to_docx(file_path, converted_path)
            content = extract_text_from_docx(converted_path)
        elif file_extension in {".xlsx", ".xls"}:
            content = extract_text_from_excel(file_path)

        chunks = chunk_text(content, file.filename)
        add_documents_to_vectorstore(user_id, chunks)

        return {"message": f"{file.filename} uploaded "}
    except Exception as e:
        print(f"Error during file processing: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {e}")
    # finally:
        # not dleeting the uplaoded pdf here
        # if os.path.exists(file_path):
        #     os.remove(file_path)


@app.get("/chat")
async def chat_with_document(
    user_id: str = Query(...),
    query: str = Query(...),
    sources: Optional[List[str]] = Query(None)
):
    vectorstore = get_vectorstore_for_user(user_id)

    if vectorstore._collection.count() == 0:
        raise HTTPException(
            status_code=404, detail="No documents found for this user."
        )

    try:
        # Step 1: Extract @mentions from query
        mentioned_docs = extract_mentioned_docs(query)

        # Step 2: Combine with explicit sources
        all_sources = set(sources or []) | set(mentioned_docs)

        # Step 3: Remove mentions from query text

        clean_query = re.sub(
            r'@[\w\-. ]+\.(?:pdf|docx|doc)', '', query, flags=re.IGNORECASE).strip()

        # Step 4: Build and run RAG chain with filtered docs
        rag_chain = build_rag_chain(
            vectorstore, filter_sources=list(all_sources))
        result = rag_chain.invoke({"input": clean_query})

        # Step 5: Extract and return result
        answer = result.get("answer", result)
        used_sources = set()

        if "context" in result:
            for doc in result["context"]:
                if "source" in doc.metadata:
                    used_sources.add(doc.metadata["source"])

        return {
            "answer": answer,
            "sources": list(used_sources)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {e}")


# @app.get("/chat")
# async def chat_with_document(
#     user_id: str = Query(...),
#     query: str = Query(...),
#     sources: Optional[List[str]] = Query(None)
# ):
#     vectorstore = get_vectorstore_for_user(user_id)

#     if vectorstore._collection.count() == 0:
#         raise HTTPException(
#             status_code=404, detail="No documents found for this user."
#         )

#     try:
#         # Step 1: Extract @mentions from query
#         mentioned_docs = extract_mentioned_docs(query)

#         # Step 2: Combine with explicit sources
#         all_sources = set(sources or []) | set(mentioned_docs)

#         # Step 3: Remove mentions from query text
#         clean_query = re.sub(
#             r'@[\w\-. ]+\.(?:pdf|docx|doc)', '', query, flags=re.IGNORECASE).strip()

#         # Step 4: Build retriever and get docs directly for source tracking
#         retriever_args = {
#             "search_type": "similarity",
#             "search_kwargs": {"k": 5}
#         }
#         if all_sources:
#             retriever_args["search_kwargs"]["filter"] = {
#                 "source": {"$in": list(all_sources)}
#             }

#         retriever = vectorstore.as_retriever(**retriever_args)
#         retrieved_docs = retriever.get_relevant_documents(clean_query)
#         used_sources = sorted(set(doc.metadata.get(
#             "source", "unknown") for doc in retrieved_docs))

#         # Step 5: Build and run RAG chain
#         rag_chain = build_rag_chain(
#             vectorstore, filter_sources=list(all_sources))
#         result = rag_chain.invoke({"input": clean_query})

#         # Step 6: Return answer with sources
#         answer = result.get("answer", result)
#         # Step 6: Normalize answer
#         print(answer)

#         return {
#             "answer": answer,
#             "sources": used_sources
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Query failed: {e}")


@app.get("/documents")
async def list_documents(user_id: str = Query(...)):
    user_dir = os.path.join(settings.UPLOAD_DIR, user_id)
    if not os.path.exists(user_dir):
        return {"available_documents": []}
    return {"available_documents": os.listdir(user_dir)}


# POST / upload?user_id = anish
# Body: PDF file

# GET / chat?user_id=anish&query=What is the refund policy?
# GET /chat?user_id=anish&query=What is the refund period?&sources=refund_policy.pdf
# GET /chat?user_id=anish&query=Compare return and refund policies.&sources=refund_policy.pdf&sources=return_policy.pdf
# GET /documents?user_id=anish
