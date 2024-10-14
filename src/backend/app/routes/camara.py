# app/routes/camaras.py
from flask import Blueprint, jsonify, request, current_app
from app.utils.shared_config import SharedConfig
from werkzeug.utils import secure_filename
from ..models import Camara
from app import db  # Asegúrate de importar db desde el módulo principal
from sqlalchemy import text

shared_config = SharedConfig()

cam_bp = Blueprint('camara', __name__)

@cam_bp.route('/get_form_camaras', methods=['GET'])
def get_form_cameras():
    try:
        # Consultar todas las cámaras
        camaras = Camara.query.all()
        camaras_list = []
        #return jsonify([camaras.to_dict() for camara in camaras])
        # Preparar los datos para la respuesta JSON
        for cam in camaras:
            cam_data = {
                "idCamara" : cam.idCamara,
                'sector': cam.sector,
                'name': cam.name,  
                'tipo': cam.tipo,
                'cantidad': cam.cantidad,
                'descripcion': cam.descripcion,
                'layer': cam.layer,
                'capa': cam.capa,
                'cont': cam.cont,
                'activo': cam.activo,
                'alarma': cam.alarma,
                'icon': cam.icon,
                'iconColor': cam.iconColor,
                'angulo': cam.angulo,
                'lat': cam.lat,
                'lon': cam.lon,
                'onu': cam.onu,
                'ups': cam.ups,
                'modelo': cam.modelo,
                'numSerie': cam.numSerie,
                'ip': cam.ip,
                'energia': cam.energia
            }
            camaras_list.append(cam_data)

        return jsonify(camaras_list), 200
    except Exception as e:
        print(f"Error al obtener la lista de cámaras: {str(e)}")
        return jsonify({"error": "Error al obtener la lista de cámaras"}), 500

@cam_bp.route('/get_camaras', methods=['GET'])
def get_cameras():
    try:
        camaras_list = shared_config.get_ping_camaras()
        return jsonify(camaras_list), 200
    except Exception as e:
        print(f"Error al obtener la lista de cámaras: {str(e)}")
        return jsonify({"error": "Error al obtener la lista de cámaras"}), 500

@cam_bp.route('/get_historial_camaras/<int:camaraId>', methods=['GET'])
def get_historial(camaraId):
    try:
        camera_id = camaraId
        Limite = 300

        # Ejecutar el procedimiento almacenado usando text()
        query = text(f"CALL GetPingOltData(:camera_id, :Limite)")
        result = db.session.execute(query, {'camera_id': camera_id, 'Limite': Limite})

        # Obtener los resultados y transformarlos para Chart.js
        Ping = []
        Potencia = []
        Temperatura = []
        labels = []

        for row in result:
            Ping.append(row[4])  # ms
            Potencia.append(abs(float(row[1].replace('dBm', ''))))  # rx_power en positivo
            Temperatura.append(row[0])  # temp_cpu
            labels.append(row[5])  # tiempo

        # Preparar los datos en el formato esperado por Chart.js
        data = {
            "labels": labels,
            "datasets": [
                {
                    "label": "Ping",
                    "data": Ping,
                    "borderColor": "rgb(75, 192, 192)",
                    "fill": False
                },
                {
                    "label": "Potencia",
                    "data": Potencia,
                    "borderColor": "rgb(255, 99, 132)",
                    "fill": False
                },
                {
                    "label": "Temperatura",
                    "data": Temperatura,
                    "borderColor": "rgb(54, 162, 235)",
                    "fill": False
                }
            ]
        }

        return jsonify(data), 200
    except Exception as e:
        print(f"Error al obtener el historial de cámaras: {str(e)}")
        return jsonify({"error": "Error al obtener el historial de cámaras"}), 500

@cam_bp.route('/get_camara/<int:camaraId>', methods=['GET'])
def get_camara(camaraId):
    try:
        camera_id = camaraId
        Limite = 300

        # Ejecutar la consulta SQL usando text()
        query = text("SELECT * FROM camaras WHERE idCamara = :camera_id LIMIT :Limite")
        result = db.session.execute(query, {'camera_id': camera_id, 'Limite': Limite}).fetchall()

        # Obtener los resultados
        historial_list = []
        for row in result:
            data = {
                # Asegúrate de que los índices coincidan con el orden de las columnas en tu tabla
                'name': row[2],
                'sector': row[1],
                'ip': row[20],
                'tipo': row[3],
                'cantidad': row[4],
                'descripcion': row[5],
                'layer': row[6],
                'onu': row[16]
            }
            historial_list.append(data)

        return jsonify(historial_list), 200
    except Exception as e:
        print(f"Error al obtener el historial de cámaras: {str(e)}")
        return jsonify({"error": "Error al obtener el historial de cámaras"}), 500