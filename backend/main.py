from fastapi import FastAPI, HTTPException, Depends, Body, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from sqlalchemy.orm import Session

from gmail_api import fetch_emails, mark_email_as_read, delete_email
from email_agent import summarize_email, classify_email, create_notion_task_for_email
from db import SessionLocal, Base, engine
from models import Email, Summary
import crud

# Create FastAPI app instance
app = FastAPI()

# Enable CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables if they don't exist
Base.metadata.create_all(bind=engine)

def get_db():
    """
    Dependency to get a SQLAlchemy session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class EmailTextRequest(BaseModel):
    email_text: str

class EmailInDB(BaseModel):
    id: str
    subject: str = ""
    sender: str = ""
    snippet: str = ""
    body: str = ""
    received_at: str = ""
    category: str = ""

    class Config:
        orm_mode = True

class SummaryInDB(BaseModel):
    id: int
    email_id: str
    summary: str
    created_at: str

    class Config:
        orm_mode = True

class MarkReadRequest(BaseModel):
    email_id: str

class DeleteRequest(BaseModel):
    email_id: str

@app.get("/")
def read_root():
    """
    Health check endpoint.
    Returns a simple message to confirm the backend is running.
    """
    return {"message": "Smart Email Agent backend is running!"}

@app.get("/emails", response_model=List[Dict])
def get_emails(max_results: int = 10):
    """
    Fetch a list of emails from the user's Gmail account (live fetch, not DB).
    Args:
        max_results (int): Maximum number of emails to fetch (default: 10).
    Returns:
        List[Dict]: List of email data dictionaries.
    """
    try:
        emails = fetch_emails(max_results=max_results)
        return emails
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/emails/save", response_model=EmailInDB)
def save_email(email: EmailInDB, db: Session = Depends(get_db)):
    """
    Save a fetched email to the database.
    Args:
        email (EmailInDB): Email data to save.
        db (Session): SQLAlchemy session.
    Returns:
        EmailInDB: The saved email record.
    """
    try:
        db_email = crud.create_email(db, email.dict())
        return db_email
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/emails/db", response_model=List[EmailInDB])
def list_emails_db(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """
    List emails stored in the database.
    Args:
        skip (int): Number of records to skip.
        limit (int): Max number of records to return.
        db (Session): SQLAlchemy session.
    Returns:
        List[EmailInDB]: List of emails from the database.
    """
    return crud.list_emails(db, skip=skip, limit=limit)

@app.post("/summarize")
def summarize(request: EmailTextRequest):
    """
    Summarize the provided email text using AI.
    Args:
        request (EmailTextRequest): Request body containing email_text.
    Returns:
        Dict: Summary of the email.
    """
    summary = summarize_email(request.email_text)
    return {"summary": summary}

@app.post("/summaries/save", response_model=SummaryInDB)
def save_summary(email_id: str, summary: str, db: Session = Depends(get_db)):
    """
    Save a summary for an email in the database.
    Args:
        email_id (str): ID of the email.
        summary (str): The summary text.
        db (Session): SQLAlchemy session.
    Returns:
        SummaryInDB: The saved summary record.
    """
    try:
        db_summary = crud.create_summary(db, email_id, summary)
        return db_summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/summaries/{email_id}", response_model=List[SummaryInDB])
def list_summaries(email_id: str, db: Session = Depends(get_db)):
    """
    List all summaries for a given email from the database.
    Args:
        email_id (str): ID of the email.
        db (Session): SQLAlchemy session.
    Returns:
        List[SummaryInDB]: List of summaries for the email.
    """
    return crud.list_summaries(db, email_id=email_id)

@app.post("/classify")
def classify(request: EmailTextRequest):
    """
    Classify the provided email text into a category using AI.
    Args:
        request (EmailTextRequest): Request body containing email_text.
    Returns:
        Dict: Category label for the email.
    """
    category = classify_email(request.email_text)
    return {"category": category}

@app.post("/emails/mark_read")
def mark_read(request: MarkReadRequest):
    """
    Mark an email as read in Gmail.
    Args:
        request (MarkReadRequest): Request body containing email_id.
    Returns:
        Dict: Success status.
    """
    success = mark_email_as_read(request.email_id)
    if success:
        return {"success": True}
    else:
        raise HTTPException(status_code=500, detail="Failed to mark email as read in Gmail.")

@app.post("/emails/delete")
def delete(request: DeleteRequest):
    """
    Delete an email from Gmail.
    Args:
        request (DeleteRequest): Request body containing email_id.
    Returns:
        Dict: Success status.
    """
    success = delete_email(request.email_id)
    if success:
        return {"success": True}
    else:
        raise HTTPException(status_code=500, detail="Failed to delete email in Gmail.")

@app.post("/emails/auto_process")
def auto_process_emails(background_tasks: BackgroundTasks):
    """
    Process unread emails: suggest action, create Notion task, mark as read.
    Returns a summary of processed emails and actions.
    """
    def process():
        emails = fetch_emails(max_results=50)
        results = []
        for email in emails:
            # Use OpenAI to suggest an action
            try:
                action_prompt = (
                    "You are an AI assistant. Given the following email, suggest the most appropriate action: Reply, Read, Ignore, or Other. "
                    "Reply if the email needs a response, Read if it's informational, Ignore if it's spam or not relevant. "
                    "Just reply with one word: Reply, Read, Ignore, or Other.\n\n"
                    f"Email:\nSubject: {email.get('subject', '')}\nBody: {email.get('body', email.get('snippet', ''))}"
                )
                import openai
                action_resp = openai.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": action_prompt}
                    ],
                    max_tokens=10,
                    temperature=0,
                )
                action = action_resp.choices[0].message.content.strip().capitalize()
                if action not in ["Reply", "Read", "Ignore", "Other"]:
                    action = "Other"
            except Exception as e:
                action = "Other"
            # Create Notion task
            notion_result = create_notion_task_for_email(email, action)
            # Mark as read
            mark_email_as_read(email['id'])
            results.append({
                "email_id": email['id'],
                "subject": email.get('subject', ''),
                "action": action,
                "notion_task_id": notion_result.get('id', None)
            })
        return results
    background_tasks.add_task(process)
    return {"status": "Processing started in background."}

@app.post("/emails/process_one")
def process_one_email(request: Request):
    """
    Process a single email by ID: suggest action, create Notion task, mark as read.
    Expects JSON: {"email_id": "..."}
    Returns the result for that email.
    """
    data = request.json() if hasattr(request, 'json') else None
    import asyncio
    if asyncio.iscoroutine(data):
        import asyncio
        data = asyncio.run(data)
    email_id = data.get("email_id")
    if not email_id:
        return {"error": "Missing email_id"}
    # Fetch the email
    emails = fetch_emails(max_results=100)
    email = next((e for e in emails if e['id'] == email_id), None)
    if not email:
        return {"error": "Email not found"}
    # Use OpenAI to suggest an action
    try:
        action_prompt = (
            "You are an AI assistant. Given the following email, suggest the most appropriate action: Reply, Read, Ignore, or Other. "
            "Reply if the email needs a response, Read if it's informational, Ignore if it's spam or not relevant. "
            "Just reply with one word: Reply, Read, Ignore, or Other.\n\n"
            f"Email:\nSubject: {email.get('subject', '')}\nBody: {email.get('body', email.get('snippet', ''))}"
        )
        import openai
        action_resp = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": action_prompt}
            ],
            max_tokens=10,
            temperature=0,
        )
        action = action_resp.choices[0].message.content.strip().capitalize()
        if action not in ["Reply", "Read", "Ignore", "Other"]:
            action = "Other"
    except Exception as e:
        action = "Other"
    # Create Notion task
    notion_result = create_notion_task_for_email(email, action)
    # Mark as read
    mark_email_as_read(email['id'])
    return {
        "email_id": email['id'],
        "subject": email.get('subject', ''),
        "action": action,
        "notion_task_id": notion_result.get('id', None)
    } 