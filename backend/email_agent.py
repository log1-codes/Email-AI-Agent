# email_agent.py
# Handles AI logic: summarization and classification

import os
import openai
from dotenv import load_dotenv
from notion_client import Client
import email.utils
from datetime import datetime, timezone

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY
NOTION_TOKEN = os.getenv("NOTION_TOKEN")
NOTION_DATABASE_ID = os.getenv("NOTION_DATABASE_ID")
notion = Client(auth=NOTION_TOKEN)

# --- Summarization ---

def summarize_email(email_text: str) -> str:
    """
    Summarize the email text using OpenAI GPT-3.5/4.

    Args:
        email_text (str): The full text of the email to summarize.

    Returns:
        str: The summarized version of the email.
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an email summarizer."},
                {"role": "user", "content": f"Summarize this email:\n{email_text}"}
            ],
            max_tokens=100,
            temperature=0.5,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"[Summary error: {e}]"

# --- Classification ---

def classify_email(email_text: str) -> str:
    """
    Classify the email into categories using OpenAI.

    Args:
        email_text (str): The full text of the email to classify.

    Returns:
        str: One of: 'important', 'moderate', or 'other'
    """
    try:
        classification_prompt = (
            "You are a Smart Email Classifier AI Agent.\n"
            "Analyze the email content and classify it into one of the following categories:\n"
            "- important: High-priority, time-sensitive, or directly relevant to the user's tasks.\n"
            "- moderate: Informational or somewhat relevant but not urgent.\n"
            "- other: Low relevance, spam, promotional, or unrelated.\n"
            "Reply with only one word: important, moderate, or other."
        )

        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": classification_prompt},
                {"role": "user", "content": f"Classify this email:\n{email_text}"}
            ],
            max_tokens=10,
            temperature=0,
        )
        return response.choices[0].message.content.strip().lower()
    except Exception as e:
        return f"[Category error: {e}]"

def to_iso8601(date_str):
    # Parse RFC 2822 date string to datetime object
    try:
        dt = email.utils.parsedate_to_datetime(date_str)
        # Ensure it's in UTC and ISO 8601 format
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).isoformat()
    except Exception:
        return None

def create_notion_task_for_email(email, action_type, status="To Do"):
    """
    Create a task in Notion for the given email.
    Args:
        email (dict): Email details (subject, sender, received_at, snippet, etc.)
        action_type (str): Suggested action (Reply, Read, Ignore, etc.)
        status (str): Task status (default: To Do)
    Returns:
        The created Notion page object.
    """
    iso_date = to_iso8601(email.get('received_at', ''))
    properties = {
        "Name": {"title": [{"text": {"content": f"{action_type}: {email.get('subject', '(No Subject)')}"}}]},
        "Status": {"select": {"name": status}},
        "Email Subject": {"rich_text": [{"text": {"content": email.get('subject', '')}}]},
        "Email Sender": {"rich_text": [{"text": {"content": email.get('sender', '')}}]},
        "Email Date": {"date": {"start": iso_date if iso_date else None}},
        "Email Snippet": {"rich_text": [{"text": {"content": email.get('snippet', '')}}]},
        "Action Type": {"select": {"name": action_type}},
        # Add more properties as needed
    }
    return notion.pages.create(parent={"database_id": NOTION_DATABASE_ID}, properties=properties)
