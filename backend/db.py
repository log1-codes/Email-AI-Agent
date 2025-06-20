# db.py
# Handles Supabase and SQLAlchemy database connection

import os
from dotenv import load_dotenv
from supabase import create_client, Client
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables from .env file
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")  # For SQLAlchemy/Postgres

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials in .env file.")

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# SQLAlchemy setup (for advanced queries or local dev)
if not DATABASE_URL:
    # Fallback: use Supabase Postgres URL if not set
    DATABASE_URL = SUPABASE_URL.replace('supabase.co', 'supabase.internal').replace('https://', 'postgresql://postgres:postgres@') + '/postgres'

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base() 