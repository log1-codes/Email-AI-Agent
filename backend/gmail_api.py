# gmail_api.py
# Handles Gmail API integration

from typing import List, Dict
import os
from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Load environment variables from .env file
load_dotenv()

# TODO: In the future, support batch fetching, filtering, and pagination for large mailboxes.

def get_gmail_creds() -> Credentials:
    """
    Load Gmail OAuth2 credentials from environment variables.
    Returns:
        Credentials: Google OAuth2 credentials object.
    Raises:
        ValueError: If any required credential is missing.
    """
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    refresh_token = os.getenv("GOOGLE_REFRESH_TOKEN")
    token_uri = "https://oauth2.googleapis.com/token"
    if not all([client_id, client_secret, refresh_token]):
        raise ValueError("Missing Google OAuth2 credentials in .env file.")
    creds = Credentials(
        None,
        refresh_token=refresh_token,
        token_uri=token_uri,
        client_id=client_id,
        client_secret=client_secret,
        scopes = ["https://mail.google.com/"]

    )
    return creds

def fetch_emails(user_id: str = 'me', max_results: int = 10) -> List[Dict]:
    """
    Fetch unread emails from Gmail using the Gmail API.
    Args:
        user_id (str): Gmail user ID (default is 'me' for authenticated user).
        max_results (int): Maximum number of emails to fetch.
    Returns:
        List[Dict]: List of unread email data dictionaries (id, snippet, headers, body, etc.).
    Raises:
        Exception: If Gmail API call fails or credentials are missing.
    """
    try:
        creds = get_gmail_creds()
        service = build('gmail', 'v1', credentials=creds)
        # List only unread messages
        results = service.users().messages().list(userId=user_id, maxResults=min(max_results, 100), q='is:unread').execute()
        messages = results.get('messages', [])
        if not messages:
            return []
        emails = []
        for msg in messages:
            msg_detail = service.users().messages().get(userId=user_id, id=msg['id'], format='full').execute()
            headers = msg_detail.get('payload', {}).get('headers', [])
            subject = ''
            sender = ''
            received_at = ''
            for header in headers:
                if header.get('name', '').lower() == 'subject':
                    subject = header.get('value', '')
                elif header.get('name', '').lower() == 'from':
                    sender = header.get('value', '')
                elif header.get('name', '').lower() == 'date':
                    received_at = header.get('value', '')
            email_data = {
                'id': msg_detail['id'],
                'subject': subject,
                'sender': sender,
                'received_at': received_at,
                'snippet': msg_detail.get('snippet', ''),
                'body': extract_body(msg_detail),
            }
            emails.append(email_data)
        return emails
    except Exception as e:
        raise Exception(f"Failed to fetch emails: {e}")

def extract_body(msg_detail: Dict) -> str:
    """
    Extract the plain text body from a Gmail message payload.
    Args:
        msg_detail (Dict): The full message detail from Gmail API.
    Returns:
        str: The plain text body of the email, if available.
    """
    try:
        payload = msg_detail.get('payload', {})
        parts = payload.get('parts', [])
        if parts:
            for part in parts:
                if part.get('mimeType') == 'text/plain':
                    data = part.get('body', {}).get('data', '')
                    if data:
                        import base64
                        return base64.urlsafe_b64decode(data).decode('utf-8')
        # Fallback to snippet if no plain text part
        return msg_detail.get('snippet', '')
    except Exception:
        return ''

def mark_email_as_read(email_id: str, user_id: str = 'me') -> bool:
    """
    Mark an email as read in Gmail by removing the 'UNREAD' label.
    Args:
        email_id (str): The Gmail message ID.
        user_id (str): Gmail user ID (default is 'me').
    Returns:
        bool: True if successful, False otherwise.
    """
    try:
        creds = get_gmail_creds()
        service = build('gmail', 'v1', credentials=creds)
        service.users().messages().modify(
            userId=user_id,
            id=email_id,
            body={"removeLabelIds": ["UNREAD"]}
        ).execute()
        return True
    except Exception as e:
        print(f"Failed to mark email as read: {e}")
        return False

def delete_email(email_id: str, user_id: str = 'me') -> bool:
    """
    Delete an email from Gmail by message ID.
    Args:
        email_id (str): The Gmail message ID.
        user_id (str): Gmail user ID (default is 'me').
    Returns:
        bool: True if successful, False otherwise.
    """
    try:
        creds = get_gmail_creds()
        service = build('gmail', 'v1', credentials=creds)
        service.users().messages().delete(userId=user_id, id=email_id).execute()
        return True
    except Exception as e:
        print(f"Failed to delete email: {e}")
        return False 