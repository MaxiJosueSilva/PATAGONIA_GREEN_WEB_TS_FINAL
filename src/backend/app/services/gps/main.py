
import telebot

class TelegramBot:
    _instance = None
    
    def __init__(self, token):
        """
        Inicializa una instancia del bot de Telegram con el token proporcionado.
        
        Args:
        - token (str): Token del bot de Telegram.
        """
        if TelegramBot._instance is None:
            TelegramBot._instance = self
            self.token = token
            self.bot = telebot.TeleBot(self.token)
        else:
            raise Exception("Cannot instantiate second TelegramBot!")
    
    @staticmethod
    def get_instance(token=None):
        """
        Retorna la instancia única del bot de Telegram. Si no existe, crea una nueva instancia.
        
        Args:
        - token (str, optional): Token del bot de Telegram. Solo necesario si la instancia no existe.
        
        Returns:
        - TelegramBot: Instancia única del bot de Telegram.
        """
        if TelegramBot._instance is None:
            if token is None:
                raise ValueError("Token must be provided to create a new instance.")
            TelegramBot(token)
        return TelegramBot._instance

# Ejemplo de uso:
if __name__ == '__main__':
    TOKEN = "5240779394:AAE0PYsCLsLA6NAf495FzfRBEDt0EFzI2ok"  # Reemplazar con tu token real
    
    bot = TelegramBot.get_instance(TOKEN)
    
    @bot.bot.message_handler(commands=['start']) 
    def handle_start(message):
        bot.bot.send_message(message.chat.id, "¡Hola!")
    
    @bot.bot.message_handler(content_types=['text'])
    def handle_text(message):
        print(message.text)
    
    bot.bot.polling(none_stop=True)
