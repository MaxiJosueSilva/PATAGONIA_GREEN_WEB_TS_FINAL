import telebot
from typing import Optional
from app.config import Config
import time

import threading

        
class TelegramBot:
    _instance: Optional['TelegramBot'] = None
    
    def __init__(self):
        if TelegramBot._instance is not None:
            raise Exception("No se puede instanciar un segundo TelegramBot!")
        TelegramBot._instance = self
        self.token: str = ""
        self.bot: Optional[telebot.TeleBot] = None
        self.thread = None

    def set_token(self, token: str) -> None:
        """Configura el token y crea una instancia del bot."""
        self.token = token
        self.bot = telebot.TeleBot(self.token)
    
    def get_token(self) -> str:
        """Retorna el token actual."""
        return self.token


    def start_listening(self) -> None:
        """Inicia el bot en un hilo separado."""
        def run():
            if self.bot:
                self.bot.message_handler(commands=['start'])(handle_start)
                self.bot.message_handler(content_types=['text'])(handle_message)
                print("Iniciando el bot en segundo plano...")
                self.bot.polling(none_stop=True)

        self.thread = threading.Thread(target=run)
        self.thread.daemon = True
        self.thread.start()

    def send_message(self, chat_id: str, text: str) -> telebot.types.Message:
        """Envía un mensaje y devuelve el ID del mensaje."""
        return self.bot.send_message(chat_id, text)
            
    @classmethod
    def get_instance(cls) -> 'TelegramBot':
        """Retorna la instancia única de TelegramBot."""
        if cls._instance is None:
            cls()
        return cls._instance
