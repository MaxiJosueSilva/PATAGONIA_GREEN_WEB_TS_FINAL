
from app.models.cliente import Cliente
import ping3  # Importar la biblioteca ping3
import time
from app.utils.shared_config import shared_config
from .ping_class import ping


def ping_clientes():
    clientes = Cliente.query.filter_by(activo='true').all()

    clientes_dict = []

    for cliente in clientes:
        response_time = ping(cliente.ip,3)
        cliente.ms = response_time

        # Determinar el color del icono basado en el valor de ms
        icon_color = '#993366' if cliente.ms == 0 else '#0000FF'
        # Crear un diccionario con todos los atributos del cliente
        cliente_dict = {
            'idCliente': cliente.idCliente,
            'name': cliente.name,
            'descripcion': cliente.descripcion,
            'TIPO': cliente.TIPO,
            'activo': cliente.activo,
            'capa': cliente.capa,
            'layer': cliente.layer,
            'icon': cliente.icon,
            'iconColor': icon_color,
            'lat': cliente.lat,
            'lon': cliente.lon,
            'onu': cliente.onu,
            'ip': cliente.ip,
            'port': cliente.port,
            'ms': cliente.ms
        }
        clientes_dict.append(cliente_dict)

    current_time = int(time.time())
    clientes_dict_with_time = {
        'time': current_time,
        'clientes': clientes_dict
    }
    shared_config.update_ping_clientes(clientes_dict_with_time)  # Actualizar la configuración compartida
