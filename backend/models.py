# models.py
# SQLAlchemy models for emails and summaries

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base

class Email(Base):
    """
    SQLAlchemy model for storing email metadata and content.
    """
    __tablename__ = 'emails'

    id = Column(String, primary_key=True, index=True)
    subject = Column(String, index=True)
    sender = Column(String, index=True)
    snippet = Column(Text)
    body = Column(Text)
    received_at = Column(DateTime, default=datetime.utcnow)
    category = Column(String, index=True)
    # Relationship to summaries
    summaries = relationship("Summary", back_populates="email")

class Summary(Base):
    """
    SQLAlchemy model for storing AI-generated summaries of emails.
    """
    __tablename__ = 'summaries'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email_id = Column(String, ForeignKey('emails.id'))
    summary = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    # Relationship to email
    email = relationship("Email", back_populates="summaries") 