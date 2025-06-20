# email_agent.py
# Handles AI logic: summarization and classification

from typing import List, Dict
import openai
import os
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

# TODO: In the future, support batch summarization/classification for multiple emails at once.

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

# Placeholder for AI classification

def classify_email(email_text: str) -> str:
    """
    Classify the email into categories using OpenAI.
    Args:
        email_text (str): The full text of the email to classify.
    Returns:
        str: The predicted category label.
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an email classifier. Categories: work, personal, spam, other."},
                {"role": "user", "content": f"Classify this email:\n{email_text}\nJust reply with the category."}
            ],
            max_tokens=10,
            temperature=0,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"[Category error: {e}]" 