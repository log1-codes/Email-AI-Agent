# email_agent.py
# Handles AI logic: summarization and classification

import os
import openai
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

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
