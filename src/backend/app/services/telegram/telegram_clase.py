
import requests
import time

class TelegramBot:
    def __init__(self, api_token: str, chat_id: str):
        """Inicializa el bot con el token y el chat_id."""
        self.api_token = api_token
        self.chat_id = chat_id
        self.base_url = f"https://api.telegram.org/bot{api_token}"
        self.last_update_id = None
        self.session = requests.Session()

    def send_message(self, text: str) -> dict:
        """Envía un mensaje al chat especificado."""
        url = f"{self.base_url}/sendMessage"
        data = {"chat_id": self.chat_id, "text": text}
        response = self.session.post(url, data=data)
        return response.json()

    def edit_message(self, message_id: int, text: str) -> dict:
        """Edita un mensaje ya enviado."""
        url = f"{self.base_url}/editMessageText"
        data = {"chat_id": self.chat_id, "message_id": message_id, "text": text}
        response = self.session.post(url, data=data)
        return response.json()

    def delete_message(self, message_id: int) -> None:
        """Elimina un mensaje específico."""
        url = f"{self.base_url}/deleteMessage"
        data = {"chat_id": self.chat_id, "message_id": message_id}
        self.session.post(url, data=data)

    def get_updates(self, offset: int = None) -> dict:
        """Obtiene las actualizaciones (mensajes, eventos, etc.) del bot."""
        url = f"{self.base_url}/getUpdates"
        params = {"offset": offset}
        response = self.session.get(url, params=params)
        return response.json()

    def get_chat_members_count(self) -> dict:
        """Obtiene el número de miembros del chat."""
        url = f"{self.base_url}/getChatMembersCount"
        params = {"chat_id": self.chat_id}
        response = self.session.get(url, params=params)
        return response.json()

    def get_chat_info(self) -> dict:
        """Obtiene información sobre el chat actual."""
        url = f"{self.base_url}/getChat"
        params = {"chat_id": self.chat_id}
        response = self.session.get(url, params=params)
        return response.json()

    def reply_to_message(self, message_id: int, text: str) -> dict:
        """Responde a un mensaje específico."""
        url = f"{self.base_url}/sendMessage"
        data = {"chat_id": self.chat_id, "text": text, "reply_to_message_id": message_id}
        response = self.session.post(url, data=data)
        return response.json()

    def send_photo(self, photo_path: str, caption: str = None) -> dict:
        """Envía una foto al chat."""
        url = f"{self.base_url}/sendPhoto"
        data = {"chat_id": self.chat_id, "caption": caption}
        with open(photo_path, "rb") as photo:
            files = {"photo": photo}
            response = self.session.post(url, data=data, files=files)
        return response.json()

    def send_document(self, document_path: str, caption: str = None) -> dict:
        """Envía un documento al chat."""
        url = f"{self.base_url}/sendDocument"
        data = {"chat_id": self.chat_id, "caption": caption}
        with open(document_path, "rb") as document:
            files = {"document": document}
            response = self.session.post(url, data=data, files=files)
        return response.json()

    def get_bot_info(self) -> dict:
        """Obtiene información sobre el bot actual."""
        url = f"{self.base_url}/getMe"
        response = self.session.get(url)
        return response.json()

    def pin_message(self, message_id: int) -> None:
        """Fija un mensaje en el chat."""
        url = f"{self.base_url}/pinChatMessage"
        data = {"chat_id": self.chat_id, "message_id": message_id}
        self.session.post(url, data=data)

    def unpin_message(self, message_id: int) -> None:
        """Desfija un mensaje del chat."""
        url = f"{self.base_url}/unpinChatMessage"
        data = {"chat_id": self.chat_id, "message_id": message_id}
        self.session.post(url, data=data)

    def get_user_profile_photos(self, user_id: int) -> dict:
        """Obtiene las fotos de perfil de un usuario."""
        url = f"{self.base_url}/getUserProfilePhotos"
        params = {"user_id": user_id}
        response = self.session.get(url, params=params)
        return response.json()

    def set_webhook(self, webhook_url: str) -> None:
        """Configura un webhook para recibir actualizaciones."""
        url = f"{self.base_url}/setWebhook"
        data = {"url": webhook_url}
        self.session.post(url, data=data)