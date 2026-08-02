import os
import json
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mangum import Mangum
from supabase import create_client, Client
from dotenv import load_dotenv   # <-- ADD THIS

load_dotenv()   # <-- ADD THIS (loads .env file)

app = FastAPI()
...

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class LeadStory(BaseModel):
    business_name: str
    origin_story: str
    products_list: str
    struggles: str
    secret_edge: str
    goal_6months: str

# Supabase client
supabase: Client = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_ANON_KEY")
)

# --- AI Call (Groq) ---
def call_groq(prompt: str) -> dict:
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {os.environ.get('GROQ_API_KEY')}",
        "Content-Type": "application/json"
    }
    payload = {
    "model": "llama-3.3-70b-versatile",  # <-- Working model
    "messages": [
        {"role": "system", "content": "You are the 'Story Catcher' AI for Omega Forge. Extract structured business intelligence. Output ONLY valid JSON with these keys: \"core_vibe\", \"hook_headline\", \"keywords\", \"value_prop\", \"lead_score\"."},
        {"role": "user", "content": prompt}
    ],
    "temperature": 0.7,
    "max_tokens": 500
}
    
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"Groq error: {response.text}")
    content = response.json()["choices"][0]["message"]["content"]
    content = content.replace("```json", "").replace("```", "").strip()
    return json.loads(content)

def extract_story(lead: LeadStory) -> dict:
    try:
        return call_groq(f"BUSINESS: {lead.business_name}\nORIGIN: {lead.origin_story}\nPRODUCTS: {lead.products_list}\nSTRUGGLES: {lead.struggles}\nEDGE: {lead.secret_edge}\nGOAL: {lead.goal_6months}")
    except:
        return {
            "core_vibe": f"{lead.business_name} - a business with a story",
            "hook_headline": "Your story matters. Let's make it heard.",
            "keywords": "business, growth, marketing",
            "value_prop": f"Helping {lead.business_name} grow.",
            "lead_score": 7
        }

# --- Endpoints ---
@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "Omega Forge"}

@app.post("/api/onboard-lead")
async def onboard_lead(lead: LeadStory):
    # 1. AI extraction
    ai_data = extract_story(lead)

    # 2. Save to Supabase
    record = {
        "business_name": lead.business_name,
        "origin_story": lead.origin_story,
        "products_list": lead.products_list,
        "struggles": lead.struggles,
        "secret_edge": lead.secret_edge,
        "goal_6months": lead.goal_6months,
        "ai_core_vibe": ai_data.get("core_vibe"),
        "ai_hook_headline": ai_data.get("hook_headline"),
        "ai_keywords": ai_data.get("keywords"),
        "ai_value_prop": ai_data.get("value_prop"),
        "lead_score": ai_data.get("lead_score", 5),
        "status": "New"
    }

    result = supabase.table("leads").insert(record).execute()
    record_id = result.data[0]["id"] if result.data else None

    return {
        "success": True,
        "record_id": record_id,
        "business_name": lead.business_name,
        **ai_data
    }

handler = Mangum(app)