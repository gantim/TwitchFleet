# backend/bots/manager.py
from backend.data.accounts import ACCOUNTS
from backend.bots.twitch_chat import TwitchBot

bots: dict[str, TwitchBot] = {}

async def init_all_bots(channel: str):
    for acc in ACCOUNTS:
        bot = TwitchBot(acc["username"], acc["oauth"], channel)
        await bot.connect()
        bots[acc["username"]] = bot
