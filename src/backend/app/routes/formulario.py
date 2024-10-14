from flask import Blueprint, jsonify, request, current_app
from werkzeug.datastructures import MultiDict
import json
import datetime
import os
from werkzeug.utils import secure_filename
from ..models import Mantenimiento
from ..extensions import db
from ..clases.ftp_manager import FTPServerManager
from sqlalchemy.exc import SQLAlchemyError
import tempfile

ftp_manager = FTPServerManager('172.40.20.114', 21, 'maxi', 'maxi2021$')
ftp_manager.connect()

form_bp = Blueprint('form', __name__)

@form_bp.route('/submit_mantenimiento', methods=['POST'])
def submit_mantenimiento():
    form_data = request.form
    file_data = request.files

    try:
        # Convertir MultiDict a dict regular
        data = {}
        for key in form_data:
            try:
                # Intentar decodificar JSON
                data[key] = json.loads(form_data[key])
            except json.JSONDecodeError:
                # Si no es JSON, usar el valor tal cual
                data[key] = form_data[key]

        # Obtener los datos del formulario
        fecha_str = data.get('fecha')
        fecha = datetime.datetime.fromisoformat(fecha_str.strip('"'))  # Ajustar el formato si es necesario
        usuario = data.get('usuario')
        nombre = data.get('nombre')
        tipo_servicio = data.get('tipo_servicio')
        camara_data = data.get('camara')
        sector = camara_data['value']['sector']
        camara = camara_data['value']['name']
        cinta = data.get('cinta')
        tension = data.get('tension')
        ups_tiempo = data.get('ups_tiempo')
        cooler_1 = data.get('cooler_1')
        cooler_2 = data.get('cooler_2')
        filtro = data.get('filtro') == 'true'  # Comparar con cadena 'true'
        dado = data.get('dado') == 'true'
        candado = data.get('candado') == 'true'
        pintura = data.get('pintura') == 'true'
        descripcion = data.get('descripcion')

        # Manejar las imágenes
        imagenes = {}
        for campo in ['imagen_camara', 'imagen_gabinete', 'imagen_ups', 'imagen_poste', 'imagen_filtro']:
            if campo in file_data:
                file = file_data[campo]
                if file.filename != '':
                    filename = secure_filename(file.filename)
                    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
                    new_filename = f"{timestamp}_{filename}"

                    # Guardar la imagen localmente
                    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], new_filename)
                    file.save(file_path)
                    
                    # Subir la imagen al servidor FTP
                    try:
                        ftp_manager.save_image(file_path, '/ftp/maxi/Form_Imagenes/', new_filename)
                        # Guardar la URL de la imagen en el diccionario
                        imagenes[campo] = f'/ftp/maxi/Form_Imagenes/{new_filename}'
                    except Exception as e:
                        current_app.logger.error(f"Failed to save image {new_filename} to /ftp/maxi/Form_Imagenes: {e}")
                        imagenes[campo] = None

        # Crear una instancia del modelo Mantenimiento
        mantenimiento_entry = Mantenimiento(
            fecha=fecha,
            usuario=usuario,
            nombre=nombre,
            tipo_servicio=tipo_servicio,
            sector=sector,
            camara=camara,
            cinta=cinta,
            tension=tension,
            ups_tiempo=ups_tiempo,
            cooler_1=cooler_1,
            cooler_2=cooler_2,
            filtro=filtro,
            dado=dado,
            candado=candado,
            pintura=pintura,
            descripcion=descripcion,
            imagen_camara=imagenes.get('imagen_camara'),
            imagen_gabinete=imagenes.get('imagen_gabinete'),
            imagen_ups=imagenes.get('imagen_ups'),
            imagen_poste=imagenes.get('imagen_poste'),
            imagen_filtro=imagenes.get('imagen_filtro')
        )

        # Guardar la entrada en la base de datos
        db.session.add(mantenimiento_entry)
        db.session.commit()

        return jsonify({"message": "Formulario recibido correctamente"}), 200

    except SQLAlchemyError as db_error:
        current_app.logger.error(f"Error al guardar en la base de datos: {str(db_error)}")
        db.session.rollback()
        return jsonify({"error": "Error al procesar el formulario"}), 500

    except Exception as e:
        current_app.logger.error(f"Error al procesar el formulario: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Error al procesar el formulario"}), 500
