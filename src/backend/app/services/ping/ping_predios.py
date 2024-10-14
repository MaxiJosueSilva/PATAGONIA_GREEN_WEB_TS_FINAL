
from app.models.predio import Predio
import ping3  # Importar la biblioteca ping3
from flask_socketio import SocketIO, emit
import time
from app.utils.shared_config import shared_config
from .ping_class import ping


def ping_predios():
    predios = Predio.query.filter_by(activo='true').all()

    predios_dict = []

    for predio in predios:

        response_time = ping(predio.ip,3)
        predio.ms = response_time
        
        # Determinar el color del icono basado en el valor de ms
        icon_color = '#993366' if predio.ms == 0 else '#0000FF'
        # Crear un diccionario con todos los atributos del predio
        predio_dict = {
            'idPredio': predio.idPredio,
            'name': predio.name,
            'nombre': predio.nombre,
            'capa': predio.capa,
            'ciudad': predio.ciudad,
            'lat': predio.lat,
            'lon': predio.lon,
            'proveedor': predio.proveedor,
            'layer': predio.layer,
            'cont': predio.cont,
            'activo': predio.activo,
            'icon': predio.icon,
            'iconColor': icon_color,
            'tecnologia': predio.tecnologia,
            'mb': predio.mb,
            'ip': predio.ip,
            'ip_mkt': predio.ip_mkt,
            'onu': predio.onu,
            'ms': predio.ms
        }
        predios_dict.append(predio_dict)

    current_time = int(time.time())
    predios_dict_with_time = {
        'time': current_time,
        'predios': predios_dict
    }
    shared_config.update_ping_predios(predios_dict_with_time)  # Actualizar la configuración compartida

