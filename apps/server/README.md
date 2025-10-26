# To run this FastAPI application:

# 1. Save the code as, e.g., `main.py`.

# 2. Install uvicorn: `pip install uvicorn`

# 3. Run from your terminal in the `backend` directory:

# `uvicorn main:app --reload`

#

# Then you can access the API at:

# - Documentation (Swagger UI): http://127.0.0.1:8000/docs

# - Upload endpoint: P OST to http://127.0.0.1:8000/upload

# - Chat endpoint: GET to http://127.0.0.1:8000/chat?query=your_question

# working code in single file

# 📄 DocChat RAG API (FastAPI + Gemini + Chroma)

Chat with your uploaded documents using Retrieval-Augmented Generation (RAG).

## ⚙️ Setup

```bash
git clone <repo>
cd docchat-fastapi
pip install -r requirements.txt
cp .env.example .env  # Add keys
uvicorn app.main:app --reload
```

# RAG:

- PDF search + Excel file:
- technique to stop hallunciate (creating of false info) => thus entire context is provided here
- llm can halluncinate but can do in context learning
- leverage promtps to get better results to use info perfeclt'
- avoid llm to hallunicate (RAG) => Augmend knowlege of LLM
- system prompt or User prompt etc
- Context provider into LLM prompting
- fine tune model on a particular polciy (excessive time & computer resources)
- context provided
- Input query => ingest the query and get a response
- RAG => combines LLM + Searchbale knowlebe base from an external dataset
- store the data (knowlege) in a vector database used here
- RAG (retuevring from the context) +> document
- like a pdf or an excel file (entire context) is being converted to emebdding into a vector db
- when a prompt is given by user => simialrly search on vector bd (and fecth those chuncks of daat into the context)
- as we cannot send 200-2k pages of context to an llm (not rlevenat => to use extra ino + computer rsource here)
- you just want the rlevenat part visa simairl search visa teh db from the kneowleg db in the vector db (incontext abuity learning)
- Reteival Part is done now
- LLMS are trained on millions of internet data & billions of parmaters to capture the complexity of the langauge
- split data in shorter sequences of 100-500 sequnces (prepricessoing of the data)
- breaking into smaller parts (many algos to do this chunking process)
- Entire Pipeline (MOST IMP)
- searching over the chunk
- Data Secirty (not used to train the model) => just put in the context part
- beautilfu is used to scrape the document when an input query is taken
- gemini model used (as it is free & easy to use) => for the RAG Tasks
- for KNOWLEGE BASE Searches
  #vLangChain is an open source framework for building applications
- based on large language models (LLMs). LLMs
