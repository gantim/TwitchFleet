from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse, JSONResponse
from app.oauth import build_auth_url, get_token

router = APIRouter()

@router.get("/twitch/login")
def twitch_login():
    return RedirectResponse(build_auth_url())

@router.get("/twitch/callback")
async def twitch_callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        return JSONResponse({"error": "Нет кода авторизации"}, status_code=400)
    
    token_data = await get_token(code)
    return JSONResponse(token_data)
