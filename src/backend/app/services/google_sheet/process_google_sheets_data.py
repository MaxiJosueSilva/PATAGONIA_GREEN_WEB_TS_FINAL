import os
import datetime
from flask import current_app
from werkzeug.utils import secure_filename
from app.extensions import db
from app.models import Mantenimiento
from .google_drive_manager import GoogleSheetsManager
from app.clases.ftp_manager import FTPServerManager
from sqlalchemy.exc import SQLAlchemyError

def process_google_sheets_data():
    credentials_path = r'C:\Users\Maxim\OneDrive\Documentos\GitHub\PATAGONIA_GREEN_WEB\patagonia_web\backend-flask\app\clases\credentials.json'
    spreadsheet_id = '18kaygUrgdS57agUmnmdLM5goj5dch30QVsKyKV3e9JE'
    worksheet_name = 'Listado'
    range_name = 'A1:J350'

    # Inicializar GoogleSheetsManager y FTPServerManager
    sheets_manager = GoogleSheetsManager(credentials_path, spreadsheet_id)
    ftp_manager = FTPServerManager('172.40.20.114', 21, 'maxi', 'maxi2021$')
    ftp_manager.connect()

    # Obtener los datos de Google Sheets
    data = sheets_manager.get_cells(range_name, worksheet_name)

    for row in data:
        if len(row) < 10:
            continue

        camara_id, descripcion, status, tipo, full_desc, num, color, img_url1, img_url2, img_url3 = row

        imagenes = {}
        for i, img_url in enumerate([img_url1, img_url2, img_url3], start=1):
            if img_url:
                filename = secure_filename(os.path.basename(img_url))
                timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
                new_filename = f"{timestamp}_{filename}"
                local_path = os.path.join(current_app.config['UPLOAD_FOLDER'], new_filename)

                try:
                    # Descargar la imagen
                    sheets_manager.download_image(img_url, local_path)

                    # Subir la imagen al servidor FTP
                    ftp_manager.save_image(local_path, '/ftp/maxi/Form_Imagenes/', new_filename)

                    # Guardar la URL de la imagen en el diccionario
                    imagenes[f'imagen_{i}'] = f'/ftp/maxi/Form_Imagenes/{new_filename}'
                except Exception as e:
                    current_app.logger.error(f"Failed to save image {new_filename} to /ftp/maxi/Form_Imagenes: {e}")
                    imagenes[f'imagen_{i}'] = None

        # Crear una instancia del modelo Mantenimiento y guardar en la base de datos
        mantenimiento_entry = Mantenimiento(
            fecha=datetime.datetime.now(),  # Ajusta según los datos disponibles
            usuario='admin',  # Ajusta según los datos disponibles
            nombre=camara_id,
            tipo_servicio=tipo,
            sector='Default Sector',  # Ajusta según los datos disponibles
            camara=camara_id,
            cinta='N/A',  # Ajusta según los datos disponibles
            tension='N/A',  # Ajusta según los datos disponibles
            ups_tiempo='N/A',  # Ajusta según los datos disponibles
            cooler_1='N/A',  # Ajusta según los datos disponibles
            cooler_2='N/A',  # Ajusta según los datos disponibles
            filtro=False,  # Ajusta según los datos disponibles
            dado=False,  # Ajusta según los datos disponibles
            candado=False,  # Ajusta según los datos disponibles
            pintura=False,  # Ajusta según los datos disponibles
            descripcion=descripcion,
            imagen_camara=imagenes.get('imagen_1'),
            imagen_gabinete=imagenes.get('imagen_2'),
            imagen_ups=imagenes.get('imagen_3'),
            imagen_poste=None,
            imagen_filtro=None
        )

        try:
            db.session.add(mantenimiento_entry)
            db.session.commit()
        except SQLAlchemyError as db_error:
            current_app.logger.error(f"Error al guardar en la base de datos: {str(db_error)}")
            db.session.rollback()


