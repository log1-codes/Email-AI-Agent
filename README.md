# Smart Email Agent

## Project Overview
Smart Email Agent is a full-stack AI-powered tool that:
- Fetches your emails (Gmail API)
- Classifies and summarizes them using AI
- Displays them in a dashboard
- (Optional) Sends daily summaries

## Tech Stack
| Layer         | Tool/Framework                |
|--------------|-------------------------------|
| Frontend     | Next.js + Tailwind            |
| Backend API  | FastAPI (Python)              |
| AI/NLP       | OpenAI API or HuggingFace     |
| Email Access | Gmail API (OAuth 2.0)         |
| Database     | PostgreSQL or Supabase        |
| Deployment   | Vercel (frontend) + Render    |

## Directory Structure
```
smart-email-agent/
│
├── frontend/              # Next.js app
│   ├── pages/
│   ├── components/
│   └── ...
│
├── backend/               # FastAPI backend
│   ├── main.py            # Backend entrypoint
│   ├── email_agent.py     # AI logic (summarization, classification)
│   ├── gmail_api.py       # Gmail API wrapper
│   └── ...
│
├── .env                   # Secrets & API keys
├── README.md
└── requirements.txt
```

## Getting Started
Instructions for setting up the project will be added as the codebase is built. 