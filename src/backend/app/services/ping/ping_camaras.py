
from app.models.camara import Camara
from app.models.ping import Ping
from app import db
import time
from datetime import datetime
from app.utils.shared_config import shared_config
# Importar la clase MQTTClient y Config
from app.services.mqtt.mqtt import MQTTClient
from app.config import Config
import json
from .ping_class import ping


def ping_camaras():
    cameras = Camara.query.filter_by(activo='true', alarma='true').all()

    cameras_dict = []

    for camera in cameras:
        response_time = ping(camera.ip, 3)
        camera.ms = response_time
        
        # Determinar el color del icono basado en el valor de ms
        icon_color = '#993366' if camera.ms == 0 else '#0000FF'
        
        # Crear un diccionario con todos los atributos de la cámara
        camera_dict = {
            'idCamara': camera.idCamara,
            'sector': camera.sector,
            'name': camera.name,
            'tipo': camera.tipo,
            'cantidad': camera.cantidad,
            'descripcion': camera.descripcion,
            'layer': camera.layer,
            'capa': camera.capa,
            'cont': camera.cont,
            'activo': camera.activo,
            'alarma': camera.alarma,
            'icon': camera.icon,
            'iconColor': icon_color,  # Asignar el color del icono
            'angulo': camera.angulo,
            'lat': camera.lat,
            'lon': camera.lon,
            'onu': camera.onu,
            'ups': camera.ups,
            'modelo': camera.modelo,
            'numSerie': camera.numSerie,
            'ip': camera.ip,
            'energia': camera.energia,
            'ms': camera.ms  # Agregar el nuevo atributo ms
        }
        cameras_dict.append(camera_dict)

    
    current_time = int(time.time())
    cameras_dict_with_time = {
        'time': current_time,
        'camaras': cameras_dict
    }
    shared_config.update_ping_camaras(cameras_dict_with_time)  # Actualizar la configuración compartida
    # Enviar datos por MQTT
    enviar_datos_mqtt("/911/camara", cameras_dict)
    grabar_datos_mysql(cameras_dict_with_time)  

# Función para enviar datos MQTT
def enviar_datos_mqtt(topic, datos):
    mqtt_client = MQTTClient(Config.MQTT_BROKER, Config.MQTT_PORT, Config.MQTT_TOPIC, Config.MQTT_USERNAME, Config.MQTT_PASSWORD)
    mqtt_client.start()
    mqtt_client.enviar_mensaje_mqtt(topic, json.dumps(datos))
    mqtt_client.stop()   

def grabar_datos_mysql(cameras_data):
    global contador
    if 'contador' not in globals():
        contador = 0
    
    try:
        if contador >= 10:
            # Obtener el tiempo actual
            contador = 0
            tiempo_actual = datetime.now()
            
            # Iterar sobre los datos de las cámaras
            for camera in cameras_data:
                # Crear una nueva instancia de Ping
                nuevo_ping = Ping(
                    idCamara=camera['idCamara'],
                    idPredio=None,
                    idCliente=None,
                    idComisaria=None,
                    ms=camera['ms'],
                    ms_mkt=None,
                    tiempo=tiempo_actual
                )
                
                # Agregar la nueva instancia a la sesión de la base de datos
                db.session.add(nuevo_ping)
            
            # Confirmar los cambios
            db.session.commit()
            
            print(f"Datos grabados exitosamente en MySQL")
        else:
            contador += 1
            print(f"Iteración {contador}")
        
    except Exception as error:
        print(f"Error al grabar datos en MySQL: {error}")
        db.session.rollback()
