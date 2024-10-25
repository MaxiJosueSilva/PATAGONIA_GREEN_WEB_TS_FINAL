

import threading
import time
from app.config import Config
from app.services.ping.ping_camaras import ping_camaras
from app.services.mqtt.mqtt import MQTTClient
from app.services.ping.ping_comisarias import ping_comisarias
from app.services.ping.ping_clientes import ping_clientes
from app.services.ping.ping_predios import ping_predios
from app.services.edgeos.edgeos import edgemax_manager
from app.services.neo4j.main import relacionar_datos_onus
from app.services.onu_data import unir_onus
from app import create_app
from app.utils.shared_config import shared_config
from app.services.telegram.telegram_clase import TelegramBot


def start_background_task():
    def task():
        app = create_app()
        with app.app_context():
            while True:
                print("Background task running...")
                time.sleep(10)

    thread = threading.Thread(target=task)
    thread.daemon = True
    thread.start()

def inicializar_telegram_bot():
    def tarea():
        app = create_app()
        with app.app_context():
            # Configura el bot con el token directamente
            bot_instance = TelegramBot(api_token=Config.TELEGRAM_BOT_TOKEN, chat_id=Config.CHAT_ID)

            # Puedes realizar aquí otras acciones como iniciar el escuchador de mensajes
            print("Bot de Telegram configurado e iniciado.")

    hilo = threading.Thread(target=tarea)
    hilo.daemon = True
    hilo.start()
    

def inicializar_mqtt_client():
    def mqtt():
        while True:
            app = create_app()
            with app.app_context():
                try:
                    
                    cliente_mqtt = MQTTClient(Config.MQTT_BROKER, Config.MQTT_PORT, Config.MQTT_TOPIC, Config.MQTT_USERNAME, Config.MQTT_PASSWORD)
                    cliente_mqtt.start()
                    print("Cliente MQTT iniciado. Esperando mensajes...")
                    
                    # Mantener el cliente en ejecución
                    while True:
                        time.sleep(60)  # Esperar 60 segundos antes de verificar la conexión
                        if not cliente_mqtt.client.is_connected():
                            print("Conexión MQTT perdida. Intentando reconectar...")
                            raise Exception("Conexión perdida")
                        
                except Exception as e:
                    print(f"Error en el cliente MQTT: {e}")
                    print("Intentando reiniciar el cliente MQTT en 60 segundos...")
                    time.sleep(60)

    hilo = threading.Thread(target=mqtt)
    hilo.daemon = True
    hilo.start()
    print("Tarea de inicialización del cliente MQTT iniciada en segundo plano.")


def start_ping_camaras_task():
    def task_camaras():
        app = create_app()
        with app.app_context():
            while True:
                ping_camaras()
                #print(shared_config.get_shared_variable('camaras'))
                guardar_datos_json(f'ping_camaras.json', shared_config.get_ping_camaras(), False)
                time.sleep(30)  # Ejecutar cada 30 segundos
    thread = threading.Thread(target=task_camaras)
    thread.daemon = True
    thread.start()

def start_ping_comisarias_task():
    def task_comisarias():
        app = create_app()
        with app.app_context():
            while True:
                ping_comisarias()
                #print(shared_config.get_shared_variable('comisarias'))
                guardar_datos_json(f'ping_comisarias.json', shared_config.get_ping_comisarias(), False)
                time.sleep(30)  # Ejecutar cada 30 segundos
    thread = threading.Thread(target=task_comisarias)
    thread.daemon = True
    thread.start()

def start_ping_clientes_task():
    def task_clientes():
        app = create_app()
        with app.app_context():
            while True:
                ping_clientes()
                #print(shared_config.get_shared_variable('clientes'))
                guardar_datos_json(f'ping_clientes.json', shared_config.get_ping_clientes(), False)
                time.sleep(30)  # Ejecutar cada 30 segundos
    thread = threading.Thread(target=task_clientes)
    thread.daemon = True
    thread.start()

def start_ping_predios_task():
    def task_predios():
        app = create_app()
        with app.app_context():
            while True:
                ping_predios()
                #print(shared_config.get_shared_variable('predios'))
                guardar_datos_json(f'ping_predios.json', shared_config.get_ping_predios(), False)
                time.sleep(30)  # Ejecutar cada 30 segundos
    thread = threading.Thread(target=task_predios)
    thread.daemon = True
    thread.start()

def start_onus_task():
    def task_onus():
        app = create_app()
        with app.app_context():
            while True:
                try:
                    manager = edgemax_manager
                    data = manager.onus()
                    # Aplanar el array de datos
                    flattened_data = [item for sublist in data for item in sublist]
                    current_time = int(time.time())
                    onus_dict_with_time = {
                        'time': current_time,
                        'onus': flattened_data
                    }   
                    #print(onus_dict_with_time)
                    shared_config.update_data_onus(onus_dict_with_time)
                    
                    guardar_datos_json(f'onus_data.json', onus_dict_with_time, False)
                    time.sleep(30)
                except Exception as e:
                    print(f"Error en la tarea de ONUs: {e}")
                    time.sleep(30)
    thread = threading.Thread(target=task_onus)
    thread.daemon = True
    thread.start()

def start_union_onus():
    def task_union():
        app = create_app()
        with app.app_context():
            while True:
                resulta = unir_onus()
                guardar_datos_json("dato_onu.json", resulta, True)
                time.sleep(30)
    thread = threading.Thread(target=task_union)
    thread.daemon = True
    thread.start()

def start_relacion_task():
    def task_relacion():
        app = create_app()
        with app.app_context():
            while True:
                relacionar_datos_onus()
                time.sleep(30)

    thread = threading.Thread(target=task_relacion)
    thread.daemon = True
    thread.start()

    # Definir la función para guardar datos en formato JSON
def guardar_datos_json(nombre_archivo, datos, sobrescribir=False):
    import json
    import os

    # Obtener la ruta del directorio actual
    directorio_actual = os.path.dirname(os.path.abspath(__file__))

    # Ruta completa del archivo
    ruta_archivo = os.path.join(directorio_actual, nombre_archivo)

    # Verificar si el archivo ya existe
    if not os.path.exists(ruta_archivo) or sobrescribir:
        # Guardar los datos en formato JSON, sobrescribiendo si el archivo ya existe y se permite sobrescribir
        with open(ruta_archivo, 'w', encoding='utf-8') as archivo_json:
            json.dump(datos, archivo_json, ensure_ascii=False, indent=4)
        print(f"Datos guardados en: {ruta_archivo}")
    else:
        print(f"El archivo {nombre_archivo} ya existe y no se sobrescribió.")

