from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from models import chat_model


def build_rag_chain(vectorstore, filter_sources=None):
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
    Respond in plain sentences.
    Context:
    {context}

    Question:
    {input}
    """)

    document_chain = create_stuff_documents_chain(chat_model, prompt)
    return create_retrieval_chain(retriever, document_chain)
