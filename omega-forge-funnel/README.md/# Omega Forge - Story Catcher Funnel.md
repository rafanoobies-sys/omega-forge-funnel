# Omega Forge - Story Catcher Funnel

AI-powered lead generation funnel that extracts client stories and delivers personalized hook pages.

## Tech Stack
- Frontend: Next.js 14 (React)
- Backend: FastAPI (Python)
- AI: Groq (primary) + Gemini (fallback)
- Database: Airtable
- Hosting: Vercel

## Setup
1. Copy `.env.example` to `.env` and fill in your API keys
2. Install dependencies: `npm install` (frontend) + `pip install -r backend/requirements.txt` (backend)
3. Run locally: `npm run dev` (frontend) + `uvicorn backend.main:app --reload` (backend)
4. Deploy to Vercel with environment variables

## Environment Variables
- `GROQ_API_KEY`: Groq API key (free tier)
- `GEMINI_API_KEY`: Google Gemini API key (fallback)
- `AIRTABLE_API_TOKEN`: Airtable personal access token
- `AIRTABLE_BASE_ID`: Airtable base ID