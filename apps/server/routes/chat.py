import re
from fastapi import APIRouter, Query, HTTPException
from utils.file_extract import extract_mentioned_docs
from utils.vectorstore import get_vectorstore_for_user
from utils.rag_chain import build_rag_chain

router = APIRouter()


@router.get("/chat")
async def chat_with_document(user_id: str = Query(...), query: str = Query(...), sources: list[str] = Query(None)):
    vectorstore = get_vectorstore_for_user(user_id)

    if vectorstore._collection.count() == 0:
        raise HTTPException(status_code=404, detail="No documents found")

    mentioned_docs = extract_mentioned_docs(query)
    all_sources = set(sources or []) | set(mentioned_docs)

    clean_query = re.sub(r'@[\w\-. ]+\.(?:pdf|docx|doc)',
                         '', query, flags=re.IGNORECASE).strip()

    rag_chain = build_rag_chain(vectorstore, filter_sources=list(all_sources))
    result = rag_chain.invoke({"input": clean_query})
    answer = result.get("answer", result)
    used_sources = set(doc.metadata.get("source")
                       for doc in result.get("context", []))

    return {"answer": answer, "sources": list(used_sources)}
