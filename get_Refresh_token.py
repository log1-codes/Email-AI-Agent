import os
from google_auth_oauthlib.flow import InstalledAppFlow

# Replace with your client_id and client_secret or use a downloaded credentials.json
CLIENT_ID = "214947096821-uv979ktkbrthg453cf5al6m3dni3rp6v.apps.googleusercontent.com"
CLIENT_SECRET = "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"
# SCOPES = ["https://www.googleapis.com/auth/gmail.modify", "https://www.googleapis.com/auth/gmail.readonly"]
SCOPES = ["https://mail.google.com/"]


flow = InstalledAppFlow.from_client_config(
    {
        "installed": {
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token"
        }
    },
    SCOPES
)

creds = flow.run_local_server(port=8080)
print("Refresh token:", creds.refresh_token)