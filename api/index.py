from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import requests
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LeadStory(BaseModel):
    business_name: str
    origin_story: str
    products_list: str
    struggles: str
    secret_edge: str
    goal_6months: str

def call_groq(prompt: str) -> dict:
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {os.environ.get('GROQ_API_KEY')}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "system",
                "content": """You are the 'Story Catcher' AI for Omega Forge. Extract structured business intelligence. Output ONLY valid JSON with these keys: "core_vibe", "hook_headline", "keywords", "value_prop", "lead_score"."""
            },
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

def save_to_airtable(lead: LeadStory, ai_data: dict) -> str:
    url = f"https://api.airtable.com/v0/{os.environ.get('AIRTABLE_BASE_ID')}/Leads"
    headers = {
        "Authorization": f"Bearer {os.environ.get('AIRTABLE_API_TOKEN')}",
        "Content-Type": "application/json"
    }
    payload = {
        "records": [{
            "fields": {
                "Business_Name": lead.business_name,
                "Origin_Story": lead.origin_story,
                "Products_List": lead.products_list,
                "Struggles": lead.struggles,
                "Secret_Edge": lead.secret_edge,
                "Goal_6Months": lead.goal_6months,
                "AI_Core_Vibe": ai_data.get("core_vibe"),
                "AI_Hook_Headline": ai_data.get("hook_headline"),
                "AI_Keywords": ai_data.get("keywords"),
                "AI_ValueProp": ai_data.get("value_prop"),
                "Lead_Score": ai_data.get("lead_score", 5),
                "Status": "New"
            }
        }]
    }
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"Airtable error: {response.text}")
    return response.json()["records"][0]["id"]

@app.post("/api/onboard-lead")
async def onboard_lead(lead: LeadStory):
    ai_data = extract_story(lead)
    record_id = save_to_airtable(lead, ai_data)
    return {
        "success": True,
        "record_id": record_id,
        "business_name": lead.business_name,
        **ai_data
    }

@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "Omega Forge"}

# ===== IMPORTANT: VERCEL REQUIRES THIS =====
from mangum import Mangum
handler = Mangum(app)
