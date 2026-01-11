# Backend Server of DocuChat

- This backend powers **DocuChat**, a document-based AI chat system built with **FastAPI** and **LangChain**.

- It implements **RAG (Retrieval Augmented Generation)** over user-uploaded documents, allowing users to chat with their PDFs, Word files, and Excel sheets using Google Gemini models.

### Key Features

- Upload and process **PDF, DOC, DOCX** files
- Text chunking and vector storage using **ChromaDB**
- Multi-user document isolation
- Source-aware querying using `@filename` mentions
- Google Gemini embeddings and chat models
- Fast, scalable **FastAPI** backend

## Setup

```bash
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
