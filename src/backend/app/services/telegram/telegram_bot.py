# telegram_bot.py
from app.services.telegram.telegram_clase import TelegramBot
from app. config import Config

# Instancia global del bot, inicializada con el token y el chat_id
telegram_bot_instance = None

def init_telegram_bot():
    global telegram_bot_instance
    if telegram_bot_instance is None:
        # Crear una instancia global del bot con el token y chat_id
        telegram_bot_instance = TelegramBot(api_token=Config.TELEGRAM_BOT_TOKEN, chat_id=Config.TELEGRAM_CHAT_ID)
        print("Bot de Telegram inicializado.")
    return telegram_bot_instance

def get_telegram_bot():
    """Devuelve la instancia global del bot de Telegram."""
    if telegram_bot_instance is None:
        raise Exception("El bot de Telegram no ha sido inicializado. Llama a init_telegram_bot() primero.")
    return telegram_bot_instance