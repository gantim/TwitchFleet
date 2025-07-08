from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.bots.manager import init_all_bots, bots
import asyncio

class MessageRequest(BaseModel):
    username: str
    message: str

app = FastAPI()

@app.on_event("startup")
async def startup():
    await init_all_bots(channel="quenimx")  # ← Замени на свой канал

@app.post("/send")
async def send_message(data: MessageRequest):
    bot = bots.get(data.username)
    if not bot:
        raise HTTPException(status_code=404, detail="Бот не найден")
    await bot.send_message(data.message)
    return {"status": "sent", "from": data.username}
