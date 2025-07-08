import httpx
from app.config import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI

TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/authorize"
TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token"
SCOPES = ["chat:read", "chat:edit", "user:read:email"]  # Допиши по нужде

def build_auth_url(state: str = "xyz"):
    return (
        f"{TWITCH_AUTH_URL}?"
        f"client_id={CLIENT_ID}&"
        f"redirect_uri={REDIRECT_URI}&"
        f"response_type=code&"
        f"scope={' '.join(SCOPES)}&"
        f"state={state}"
    )

async def get_token(code: str):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            TWITCH_TOKEN_URL,
            data={
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": REDIRECT_URI,
            },
        )
        return resp.json()
