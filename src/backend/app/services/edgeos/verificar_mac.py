import json

def load_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def verify_mac_addresses(cameras_file, onu_files):
    # Cargar datos del archivo cameras_mac.json
    cameras_data = load_json_file(cameras_file)
    
    # Crear un diccionario para almacenar las MACs de cada name en los archivos datos_onus
    onu_mac_dict = {}

    for onu_file in onu_files:
        onu_data = load_json_file(onu_file)
        for onu in onu_data:
            name = onu['name']
            mac_addresses = onu.get('mac_addresses', [])
            if name in onu_mac_dict:
                onu_mac_dict[name].extend(mac_addresses)
            else:
                onu_mac_dict[name] = mac_addresses
    
    # Verificar las MACs en cameras_mac.json
    for camera in cameras_data:
        camera_name = camera['sector']
        camera_mac = camera['MAC'].strip()
        if camera_name in onu_mac_dict:
            if camera_mac in onu_mac_dict[camera_name]:
                print(f"La MAC {camera_mac} para la cámara {camera_name} está correcta.")
            else:
                print(f"La MAC {camera_mac} para la cámara {camera_name} está incorrecta. MACs esperadas: {onu_mac_dict[camera_name]}")
        else:
            print(f"No se encontró el nombre {camera_name} en los datos de ONUs.")

# Rutas de los archivos
cameras_file = r"patagonia_web\backend-flask\app\services\edgeos\cameras_mac.json"
onu_files = [r'patagonia_web\backend-flask\app\services\edgeos\datos_onus_1.json', 
             r'patagonia_web\backend-flask\app\services\edgeos\datos_onus_2.json', 
             r'patagonia_web\backend-flask\app\services\edgeos\datos_onus_3.json', 
             r'patagonia_web\backend-flask\app\services\edgeos\datos_onus_4.json']

# Verificar las direcciones MAC
verify_mac_addresses(cameras_file, onu_files)
