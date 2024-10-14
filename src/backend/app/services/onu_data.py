import time
from app.utils.shared_config import shared_config

def unir_onus():
    result = []  # Inicializamos el resultado dentro de la función
    data_onus = shared_config.get_data_onus()
    data_camaras = shared_config.get_ping_camaras()
    data_comisarias = shared_config.get_ping_comisarias()
    data_predios = shared_config.get_ping_predios()
    data_clientes = shared_config.get_ping_clientes()
  
    # Verificamos que los datos de ONUs no estén vacíos
    if data_onus:
        # Creamos un diccionario que mapea el serial_number de las ONUs con la información completa de la ONU
        onus_dict = {onu['serial_number']: onu for onu in data_onus['onus']}
        
        # 1. Mapeo de ONUs a las cámaras
        if data_camaras:
            for camara in data_camaras['camaras']:
                # Aquí asumimos que camara['onu'] es un string que contiene el serial_number
                serial = camara.get('onu', None)  # Usamos el valor directamente como serial_number
                if serial and serial in onus_dict:
                    camara['onu_info'] = onus_dict[serial]  # Añadimos la información completa de la ONU a la cámara
                result.append(camara)

        # 2. Mapeo de ONUs a las comisarías
        if data_comisarias:
            for comisaria in data_comisarias['comisarias']:
                serial = comisaria.get('onu', None)  # Suponiendo que 'onu' es el campo relevante
                if serial in onus_dict:
                    comisaria['onu_info'] = onus_dict[serial]  # Añadimos la información de la ONU a la comisaría
                result.append(comisaria)

        # 3. Mapeo de ONUs a los predios
        if data_predios:
            for predio in data_predios['predios']:
                serial = predio.get('onu', None)  # Suponiendo que 'onu' es el campo relevante
                if serial in onus_dict:
                    predio['onu_info'] = onus_dict[serial]  # Añadimos la información de la ONU al predio
                result.append(predio)

        # 4. Mapeo de ONUs a los clientes
        if data_clientes:
            for cliente in data_clientes['clientes']:
                serial = cliente.get('onu', None)  # Suponiendo que 'onu' es el campo relevante
                if serial in onus_dict:
                    cliente['onu_info'] = onus_dict[serial]  # Añadimos la información de la ONU al cliente
                result.append(cliente)

    shared_config.update_all_onus_data(result)
    return result  # Colocamos el return fuera del bloque condicional
