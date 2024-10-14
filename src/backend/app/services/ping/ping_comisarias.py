
from app.models.comisaria import Comisaria
import ping3  # Importar la biblioteca ping3
import time
from app.utils.shared_config import shared_config
from .ping_class import ping


def ping_comisarias():
    comisarias = Comisaria.query.filter_by(activo='true').all()

    comisarias_dict = []

    for comisaria in comisarias:
        response_time = ping(comisaria.ip,3)
        comisaria.ms = response_time
        
        # Determinar el color del icono basado en el valor de ms
        icon_color = '#993366' if comisaria.ms == 0 else '#0000FF'
        # Crear un diccionario con todos los atributos de la comisaria
        comisaria_dict = {
            'idComisaria': comisaria.idComisaria,
            'name': comisaria.name,
            'tipo': comisaria.tipo,
            'cantidad': comisaria.cantidad,
            'descripcion': comisaria.descripcion,
            'layer': comisaria.layer,
            'cont': comisaria.cont,
            'activo': comisaria.activo,
            'capa': comisaria.capa,
            'icon': comisaria.icon,
            'iconColor': icon_color,
            'angulo': comisaria.angulo,
            'lat': comisaria.lat,
            'lon': comisaria.lon,
            'ip': comisaria.ip,
            'onu': comisaria.onu,
            'mac': comisaria.mac,
            'ms': comisaria.ms
        }
        comisarias_dict.append(comisaria_dict)
    
    current_time = int(time.time())
    comisarias_dict_with_time = {
        'time': current_time,
        'comisarias': comisarias_dict
    }
    shared_config.update_ping_comisarias(comisarias_dict_with_time)  # Actualizar la configuración compartida
