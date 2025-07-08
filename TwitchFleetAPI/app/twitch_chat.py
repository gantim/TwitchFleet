import socket
import time

def send_message_to_chat(oauth_token: str, username: str, channel: str, message: str):
    """
    Отправляет сообщение в Twitch чат через IRC
    :param oauth_token: OAuth token с приставкой oauth:
    :param username: логин Twitch-аккаунта
    :param channel: канал, например 'quenlmx'
    :param message: текст сообщения
    """
    server = 'irc.chat.twitch.tv'
    port = 6667
    nickname = username.lower()
    token = f'oauth:{oauth_token}'  # важно!

    sock = socket.socket()
    sock.connect((server, port))
    sock.send(f"PASS {token}\r\n".encode('utf-8'))
    sock.send(f"NICK {nickname}\r\n".encode('utf-8'))
    sock.send(f"JOIN #{channel}\r\n".encode('utf-8'))

    time.sleep(1)  # чуть подождем

    sock.send(f"PRIVMSG #{channel} :{message}\r\n".encode('utf-8'))

    sock.close()
