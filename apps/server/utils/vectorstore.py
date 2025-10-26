import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from config import settings
from models import embedding_model


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


def add_documents_to_vectorstore(user_id: str, documents: list[Document]):
    vectorstore = get_vectorstore_for_user(user_id)
    vectorstore.add_documents(documents)
    vectorstore.persist()
    return vectorstore
