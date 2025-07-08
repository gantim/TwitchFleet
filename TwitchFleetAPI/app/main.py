# app/main.py
from fastapi import FastAPI, Request
import httpx
import os
from urllib.parse import urlencode
from app.twitch_chat import send_message_to_chat

app = FastAPI()

CLIENT_ID = "j953ss5qkxno644s864hcvd8cps4ll"
CLIENT_SECRET = "a6urmnrs4mry3j9xcyfgomhl7thzet"
REDIRECT_URI = "http://localhost:8000/auth"

TOKEN_URL = "https://id.twitch.tv/oauth2/token"

@app.get("/")
def root():
    return {"msg": "Twitch OAuth2 Active"}

@app.get("/send-test")
def send_test():
    send_message_to_chat(
        oauth_token="pyg6b7capy4b9yj0i5b7ir6wgt4bka",
        username="quenimx",
        channel="zhume211",
        message="Привет с FastAPI! 😎"
    )
    return {"status": "ok"}

@app.get("/auth")
async def auth(request: Request):
    code = request.query_params.get("code")
    if not code:
        return {"error": "No code in callback"}

    # Запрашиваем токен у Twitch
    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(TOKEN_URL, data=data)
        if response.status_code != 200:
            return {"error": "Failed to get token", "details": response.text}

        tokens = response.json()
        # 👉 Здесь ты можешь сохранить access_token и refresh_token
        return {
            "access_token": tokens["access_token"],
            "refresh_token": tokens.get("refresh_token"),
            "scope": tokens["scope"],
            "token_type": tokens["token_type"]
        }
