from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import faiss
import pickle

from sentence_transformers import SentenceTransformer
import google.generativeai as genai

load_dotenv()


app = FastAPI()

genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

index = faiss.read_index(
    "faiss_index/index.bin"
)

with open(
        "faiss_index/docs.pkl",
        "rb"
) as f:

    docs = pickle.load(f)


class ChatRequest(
    BaseModel
):
    question: str


@app.post("/chat")
def chat(request: ChatRequest):

    question = request.question

    query_embedding = model.encode(
        [question]
    )

    distances, indices = index.search(
        query_embedding,
        3
    )

    context = ""

    for idx in indices[0]:
        context += docs[idx]
        context += "\n"

    prompt = f"""
You are FinSight AI.

You help users with:

- Budgeting
- Savings
- Debt Management
- Investments
- Financial Planning
- Expense Tracking

Context:
{context}

Question:
{question}

Return answer in this format:

## Summary
Short explanation

## Recommendations
- point 1
- point 2
- point 3

## Action Plan
1. Step one
2. Step two
3. Step three

Keep answer under 120 words.
"""

    gemini = genai.GenerativeModel(
        "gemini-2.5-flash"
    )

    response = gemini.generate_content(
        prompt
    )

    return {
        "answer": response.text
    }