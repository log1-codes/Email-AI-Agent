# crud.py
# CRUD operations for Email and Summary models

from sqlalchemy.orm import Session
from models import Email, Summary
from typing import List, Optional

def create_email(db: Session, email_data: dict) -> Email:
    """
    Create and store a new Email record in the database.
    Args:
        db (Session): SQLAlchemy session.
        email_data (dict): Dictionary with email fields.
    Returns:
        Email: The created Email object.
    """
    db_email = Email(**email_data)
    db.add(db_email)
    db.commit()
    db.refresh(db_email)
    return db_email

def get_email(db: Session, email_id: str) -> Optional[Email]:
    """
    Retrieve an Email by its ID.
    Args:
        db (Session): SQLAlchemy session.
        email_id (str): Email ID.
    Returns:
        Optional[Email]: The Email object if found, else None.
    """
    return db.query(Email).filter(Email.id == email_id).first()

def list_emails(db: Session, skip: int = 0, limit: int = 10) -> List[Email]:
    """
    List emails with pagination.
    Args:
        db (Session): SQLAlchemy session.
        skip (int): Number of records to skip.
        limit (int): Max number of records to return.
    Returns:
        List[Email]: List of Email objects.
    """
    return db.query(Email).offset(skip).limit(limit).all()

def create_summary(db: Session, email_id: str, summary_text: str) -> Summary:
    """
    Create and store a new Summary for an email.
    Args:
        db (Session): SQLAlchemy session.
        email_id (str): ID of the email to summarize.
        summary_text (str): The summary text.
    Returns:
        Summary: The created Summary object.
    """
    db_summary = Summary(email_id=email_id, summary=summary_text)
    db.add(db_summary)
    db.commit()
    db.refresh(db_summary)
    return db_summary

def list_summaries(db: Session, email_id: str) -> List[Summary]:
    """
    List all summaries for a given email.
    Args:
        db (Session): SQLAlchemy session.
        email_id (str): Email ID.
    Returns:
        List[Summary]: List of Summary objects.
    """
    return db.query(Summary).filter(Summary.email_id == email_id).all() 