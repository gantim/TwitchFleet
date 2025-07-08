from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.bots.manager import init_all_bots, bots
import asyncio
import random

class MessageRequest(BaseModel):
    username: str
    message: str

app = FastAPI()

@app.on_event("startup")
async def startup():
    await init_all_bots(channel="zhume211")  # ← Замени на свой канал

@app.post("/send")
async def send_message(data: MessageRequest):
    bot = bots.get(data.username)
    if not bot:
        raise HTTPException(status_code=404, detail="Бот не найден")
    await bot.send_message(data.message)
    return {"status": "sent", "from": data.username}

class MessageRequest(BaseModel):
    message: str

@app.post("/send_all")
async def send_message_all(req: MessageRequest):
    if not bots:
        raise HTTPException(status_code=500, detail="Боты не инициализированы")
    
    # каждому боту по очереди отправляем сообщение
    for bot in bots.values():
        await bot.send_message(req.message)
        await asyncio.sleep(random.uniform(2, 4))  # интервал между ботами
    
    return {"status": "sent", "bots": list(bots.keys())}