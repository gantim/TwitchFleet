# backend/bots/twitch_chat.py
import asyncio

class TwitchBot:
    def __init__(self, username: str, oauth: str, channel: str):
        self.username = username
        self.oauth = oauth
        self.channel = channel
        self.writer = None

    async def connect(self):
        if self.writer:
            return  # уже подключён
        self.reader, self.writer = await asyncio.open_connection('irc.chat.twitch.tv', 6667)
        self.writer.write(f"PASS {self.oauth}\r\n".encode())
        self.writer.write(f"NICK {self.username}\r\n".encode())
        self.writer.write(f"JOIN #{self.channel}\r\n".encode())
        await self.writer.drain()
        print(f"[{self.username}] Подключён к чату #{self.channel}")

    async def send_message(self, message: str):
        if not self.writer:
            await self.connect()
        msg = f"PRIVMSG #{self.channel} :{message}\r\n"
        self.writer.write(msg.encode())
        await self.writer.drain()
        print(f"[{self.username}] Отправлено: {message}")
