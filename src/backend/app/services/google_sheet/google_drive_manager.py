import os
import io
import google.auth
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import gspread
import requests
from oauth2client.service_account import ServiceAccountCredentials

class GoogleDriveManager:
    def __init__(self, credentials_path):
        self.credentials_path = credentials_path
        self.scopes = ['https://www.googleapis.com/auth/drive']
        self.creds = None
        self.service = None
        self.authenticate()

    def authenticate(self):
        if os.path.exists('token.json'):
            self.creds = Credentials.from_authorized_user_file('token.json', self.scopes)
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(self.credentials_path, self.scopes)
                self.creds = flow.run_local_server(port=0)
            with open('token.json', 'w') as token:
                token.write(self.creds.to_json())

        self.service = build('drive', 'v3', credentials=self.creds)

    def list_files(self, query=None):
        results = self.service.files().list(q=query, pageSize=10, fields="files(id, name)").execute()
        items = results.get('files', [])
        return items

    def download_file(self, file_id, file_path):
        request = self.service.files().get_media(fileId=file_id)
        fh = io.FileIO(file_path, 'wb')
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while not done:
            status, done = downloader.next_chunk()
            print(f"Download {int(status.progress() * 100)}%.")
        print("Download complete.")

class GoogleSheetsManager:
    def __init__(self, credentials_path, spreadsheet_id):
        self.credentials_path = credentials_path
        self.spreadsheet_id = spreadsheet_id
        self.client = self.authenticate()
        self.sheet = self.client.open_by_key(self.spreadsheet_id)

    def authenticate(self):
        scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
        print(f"Credentials path: {self.credentials_path}")
        if not os.path.exists(self.credentials_path):
            raise FileNotFoundError(f"File not found: {self.credentials_path}")
        creds = ServiceAccountCredentials.from_json_keyfile_name(self.credentials_path, scope)
        return gspread.authorize(creds)

    def get_cells(self, range_name, worksheet_name):  # Eliminamos el valor por defecto para worksheet_name
        worksheet = self.sheet.worksheet(worksheet_name)  # Accede a la hoja especificada
        return worksheet.get(range_name)
    
    def download_image(self, url, save_path):
        response = requests.get(url)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return save_path
        else:
            raise Exception(f"Failed to download image from {url}")

# Uso de la clase
credentials_path = r'C:\Users\Maxim\OneDrive\Documentos\GitHub\PATAGONIA_GREEN_WEB\patagonia_web\backend-flask\app\clases\credentials.json'  # Ruta al archivo credentials.json
spreadsheet_id = '18kaygUrgdS57agUmnmdLM5goj5dch30QVsKyKV3e9JE'
worksheet_name = 'Listado'  # Nombre de la hoja de cálculo
range_name = 'A1:J350'  # Rango de celdas

try:
    sheets_manager = GoogleSheetsManager(credentials_path, spreadsheet_id)
    data = sheets_manager.get_cells(range_name, worksheet_name)  # Pasamos worksheet_name explícitamente

    # Imprime los datos recuperados
    for row in data:
        print(row)
except FileNotFoundError as e:
    print(e)
except gspread.exceptions.APIError as e:
    print(f"API Error: {e}")