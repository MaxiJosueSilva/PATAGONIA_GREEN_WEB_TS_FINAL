# app/routes/ping.py
from flask import Blueprint, jsonify, request, current_app
from app.utils.shared_config import shared_config
from werkzeug.utils import secure_filename
import datetime
import os
from app.services.edgeos.edgemax import EdgeMaxAPI
import time

olt_bp = Blueprint('olt', __name__)


@olt_bp.route('/onus', methods=['GET'])
def get_onus():
    try:
        return jsonify(shared_config.get_data_onus())
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@olt_bp.route('/get_all_onus', methods=['GET'])
def get_all_onus():
    try:
        return jsonify(shared_config.get_all_onus_data())
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@olt_bp.route('/reboot_onu', methods=['POST'])
def reset_onus():
    try:
        data = request.get_json()
        olt = data['onu']['olt']
        user = data['username']
        if olt == 'OLT 1':
            ip = '10.10.110.211'
        elif olt == 'OLT 2':
            ip = '10.10.110.212'
        elif olt == 'OLT 3':
            ip = '10.10.110.213'
        elif olt == 'OLT 4':
            ip = '10.10.110.214'
        else:
            ip = None
        
        api = EdgeMaxAPI(host=ip, username="maxi", password="maxi2021$")
        if api.login():
            onu_serial = data['onu']['serial_number']      
            try:
                # Intentar reiniciar la ONU usando el método de EdgeMaxAPI 30 veces
                for intento in range(3):
                    resultado = api.reboot_onu(onu_serial)
                    time.sleep(1)  # Esperar 1 segundo entre intentos
                print(f"Reinicio realizado por {user}")
                # Guardar los datos en la base de datos
                fecha_reinicio = datetime.datetime.now()
                db = current_app.db
                db.execute("INSERT INTO reinicios_onu (fecha, usuario, numero_onu) VALUES (?, ?, ?)", (fecha_reinicio, user, onu_serial))
                db.commit()
                
            except Exception as e:
                print(f"Error al reiniciar la ONU: {e}")
                print(f"ALARMA: Excepción al intentar reiniciar la ONU {onu_serial}")
        else:
            print("Error al iniciar sesión para reboot_onu")
            print("ALARMA: No se pudo iniciar sesión para reiniciar la ONU")
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": str(e)}), 500