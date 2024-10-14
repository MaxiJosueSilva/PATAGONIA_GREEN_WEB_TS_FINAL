import requests
import time

class TelegramBot:
    def __init__(self, api_token, chat_id):
        self.api_token = api_token
        self.base_url = f"https://api.telegram.org/bot{api_token}"
        self.chat_id = chat_id
        self.last_update_id = None
        self.session = requests.Session()

    def send_message(self, text):
        url = f"{self.base_url}/sendMessage"
        data = {"chat_id": self.chat_id, "text": text}
        response = self.session.post(url, data=data)
        return response.json()

    def edit_message(self, message_id, text):
        url = f"{self.base_url}/editMessageText"
        data = {"chat_id": self.chat_id, "message_id": message_id, "text": text}
        response = self.session.post(url, data=data)
        return response.json()

    def delete_message(self, message_id):
        url = f"{self.base_url}/deleteMessage"
        data = {"chat_id": self.chat_id, "message_id": message_id}
        self.session.post(url, data=data)

    def get_updates(self, offset=None):
        url = f"{self.base_url}/getUpdates"
        params = {"offset": offset}
        response = self.session.get(url, params=params)
        return response.json()

    def get_chat_members_count(self):
        url = f"{self.base_url}/getChatMembersCount"
        params = {"chat_id": self.chat_id}
        response = self.session.get(url, params=params)
        return response.json()

    def get_chat_info(self):
        url = f"{self.base_url}/getChat"
        params = {"chat_id": self.chat_id}
        response = self.session.get(url, params=params)
        return response.json()

    def reply_to_message(self, message_id, text):
        url = f"{self.base_url}/sendMessage"
        data = {"chat_id": self.chat_id, "text": text, "reply_to_message_id": message_id}
        self.session.post(url, data=data)

    def send_photo(self, photo_path, caption=None):
        url = f"{self.base_url}/sendPhoto"
        data = {"chat_id": self.chat_id, "caption": caption}
        files = {"photo": open(photo_path, "rb")}
        self.session.post(url, data=data, files=files)

    def send_document(self, document_path, caption=None):
        url = f"{self.base_url}/sendDocument"
        data = {"chat_id": self.chat_id, "caption": caption}
        files = {"document": open(document_path, "rb")}
        self.session.post(url, data=data, files=files)

    def get_bot_info(self):
        url = f"{self.base_url}/getMe"
        response = self.session.get(url)
        return response.json()

    def pin_message(self, message_id):
        url = f"{self.base_url}/pinChatMessage"
        data = {"chat_id": self.chat_id, "message_id": message_id}
        self.session.post(url, data=data)

    def unpin_message(self, message_id):
        url = f"{self.base_url}/unpinChatMessage"
        data = {"chat_id": self.chat_id, "message_id": message_id}
        self.session.post(url, data=data)

    def get_user_profile_photos(self, user_id):
        url = f"{self.base_url}/getUserProfilePhotos"
        params = {"user_id": user_id}
        response = self.session.get(url, params=params)
        return response.json()

    def set_webhook(self, url):
        webhook_url = f"{self.base_url}/setWebhook"
        data = {"url": url}
        self.session.post(webhook_url, data=data)

# Ejemplo de uso
if __name__ == "__main__":
    # Inicialización del bot con el token y chat_id
    api_token = "6357735908:AAHyLJ86ll_M-GK1_40UubovcaHoAkpHmWA"
    chat_id = "953993883"  # Asegúrate de que el chat_id esté correcto
    bot = TelegramBot(api_token, chat_id)

    # Enviar un mensaje
    send_response = bot.send_message("Mensaje inicial")
    print("Mensaje enviado:", send_response)
    message_id = send_response.get("result", {}).get("message_id")

    # Espera 2 segundos para asegurarse de que el mensaje se envíe antes de editarlo
    time.sleep(2)

    # Editar el mensaje si se encontró el ID del mensaje
    if message_id:
        edit_response = bot.edit_message(message_id, "Mensaje editado")
        print("Mensaje editado:", edit_response)
    else:
        print("No se pudo encontrar el ID del mensaje para editar")
