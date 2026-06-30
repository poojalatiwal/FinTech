from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

import os
import json
import traceback

import google.generativeai as genai
from groq import Groq

from rag import retrieve_context
from prompt import build_prompt

# ==========================================
# LOAD ENVIRONMENT
# ==========================================

load_dotenv()

# ==========================================
# FASTAPI
# ==========================================

app = FastAPI(
    title="FinSight AI",
    version="1.0.0"
)

# ==========================================
# GEMINI
# ==========================================

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

# ==========================================
# GROQ
# ==========================================

groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# ==========================================
# REQUEST MODEL
# ==========================================

class ChatRequest(BaseModel):

    userId: str

    message: str


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/")
def health():

    return {
        "status": "Running",
        "service": "FinSight AI"
    }


# ==========================================
# GEMINI
# ==========================================

def ask_gemini(prompt: str):

    model = genai.GenerativeModel(
        "gemini-2.5-flash"
    )

    response = model.generate_content(

        prompt,

        generation_config={

            "response_mime_type": "application/json",

            "temperature": 0.3

        }

    )

    return response.text


# ==========================================
# GROQ FALLBACK
# ==========================================

def ask_groq(prompt: str):

    response = groq_client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        temperature=0.3,

        messages=[

            {

                "role": "user",

                "content": prompt

            }

        ],

        response_format={

            "type": "json_object"

        }

    )

    return response.choices[0].message.content


# ==========================================
# CLEAN JSON
# ==========================================

def clean_json(text: str):

    if text is None:

        return ""

    text = text.strip()

    if text.startswith("```json"):

        text = text.replace("```json", "")

    if text.startswith("```"):

        text = text.replace("```", "")

    if text.endswith("```"):

        text = text[:-3]

    return text.strip()


# ==========================================
# DEFAULT RESPONSE
# ==========================================

def default_response(message):

    return {

        "message": message,

        "forecastExplanation": "",

        "trendReason": "",

        "trendExplanation": ""

    }
    
    # ==========================================
# CHAT ENDPOINT
# ==========================================

@app.post("/chat")
def chat(request: ChatRequest):

    try:

        print("\n===================================")
        print("New Chat Request")
        print("User :", request.userId)
        print("Question :", request.message)
        print("===================================\n")

        # -----------------------------------
        # Retrieve User Context
        # -----------------------------------

        context = retrieve_context(

            user_id=request.userId,

            question=request.message

        )

        if context.strip() == "":

            context = """
No financial records were found for this user.

If the question is about personal expenses,
budgets or income, politely say that no data
is available.

If the question is a general finance question,
answer normally.
"""

        print("\n========== CONTEXT ==========\n")

        print(context)

        print("\n=============================\n")

        # -----------------------------------
        # Build Prompt
        # -----------------------------------

        prompt = build_prompt(

            request.message,

            context

        )

        # -----------------------------------
        # Gemini
        # -----------------------------------

        try:

            print("Using Gemini...")

            ai_text = ask_gemini(prompt)

        except Exception as gemini_error:

            print("Gemini Error")

            print(gemini_error)

            print("Switching to Groq...")

            ai_text = ask_groq(prompt)

        # -----------------------------------
        # Clean Response
        # -----------------------------------

        ai_text = clean_json(ai_text)

        print("\n========== AI ==========\n")

        print(ai_text)

        print("\n========================\n")

        # -----------------------------------
        # Parse JSON
        # -----------------------------------

        try:

            return json.loads(ai_text)

        except Exception:

            print("JSON Parsing Failed")

            return {

                "message": ai_text,

                "forecastExplanation": "",

                "trendReason": "",

                "trendExplanation": ""

            }

    except Exception:

        traceback.print_exc()

        return {

            "message": "AI service is temporarily unavailable.",

            "forecastExplanation": "",

            "trendReason": "",

            "trendExplanation": ""

        }