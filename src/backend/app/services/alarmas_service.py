import time
import threading
from app import create_app
from datetime import datetime, timedelta
import json
from app.utils.shared_config import shared_config
import os
from app.services.telegram.telegram_clase import TelegramBot
from app.services.edgeos.edgeos import edgemax_manager

# Se cambia el nombre de la instancia de bot para mayor claridad
telegram_bot_instance = TelegramBot.get_instance()

# Archivo para guardar las alarmas persistentes
ALARMAS_FILE = 'alarmas.json'
# Obtener la ruta del directorio actual
directorio_actual = os.path.dirname(os.path.abspath(__file__))

# Ruta completa del archivo
ruta_archivo = os.path.join(directorio_actual, ALARMAS_FILE)

# Cargar alarmas desde el archivo
def cargar_alarmas():
    if not os.path.exists(ruta_archivo):
        with open(ruta_archivo, 'w') as file:
            json.dump({}, file)
    with open(ruta_archivo, 'r') as file:
        return json.load(file)

# Guardar alarmas en el archivo
def guardar_alarmas(alarmas):
    with open(ruta_archivo, 'w') as file:
        json.dump(alarmas, file)

# Diccionario para mantener las últimas alarmas y el ID del mensaje de Telegram
ultimas_alarmas = cargar_alarmas()

# Función que decide si generar una nueva alarma (cada 30 minutos)
def debe_generar_alarma(tipo):
    ahora = datetime.now()
    if tipo in ultimas_alarmas:
        ultima_alarma = ultimas_alarmas[tipo]
        if ahora - datetime.fromtimestamp(ultima_alarma['timestamp']) < timedelta(minutes=30):
            return False
    return True

# Función para generar una alarma y enviar notificaciones de Telegram
def generar_alarma(tipo, mensaje):
    if debe_generar_alarma(tipo):
        alarma = {        
            'tipo': tipo,
            'mensaje': mensaje,
            'timestamp': time.time()
        }
        print(f"ALARMA: {tipo} - {mensaje} - {time.strftime('%d/%m/%Y %H:%M:%S')}")
        
        # Guardar alarma en el sistema y archivo
        alarmas_actuales = shared_config.get_alarmas()
        alarmas_actuales.append(alarma)
        shared_config.update_alarmas(alarmas_actuales)
        ultimas_alarmas[tipo] = alarma
        guardar_alarmas(ultimas_alarmas)  # Guardamos en archivo
        
        # Enviar mensaje de alarma por Telegram y guardar el ID del mensaje
        if telegram_bot_instance:
            mensaje_telegram = f"ALARMA: {tipo} - {mensaje} - {time.strftime('%d/%m/%Y %H:%M:%S')}"
            msg = telegram_bot_instance.send_message(chat_id='953993883', text=mensaje_telegram)
            # Guardamos el ID del mensaje de Telegram
            ultimas_alarmas[tipo]['telegram_message_id'] = msg.message_id
            guardar_alarmas(ultimas_alarmas)

# Verificar si un servicio se ha recuperado y notificar por Telegram
def servicio_recuperado(alarma):
    datos = shared_config.get_ping_camaras()
    for dato in datos:
        if dato['sector'] == alarma['tipo'].split(' - ')[1] and dato['name'] == alarma['tipo'].split(' - ')[2]:
            if dato['ms'] > 0:
                mensaje_recuperacion = f"Servicio restaurado: {alarma['tipo']} - {time.strftime('%d/%m/%Y %H:%M:%S')}"
                print(mensaje_recuperacion)
                
                # Enviar mensaje de recuperación en respuesta al mensaje original de la alarma
                if telegram_bot_instance and 'telegram_message_id' in alarma:
                    telegram_bot_instance.send_message(chat_id='953993883', text=mensaje_recuperacion, reply_to_message_id=alarma['telegram_message_id'])

                return True
    return False

# Función para verificar si se han recuperado servicios y actualizar alarmas
def verificar_recuperacion():
    alarmas_actuales = shared_config.get_alarmas()
    alarmas_actualizadas = []
    
    for alarma in alarmas_actuales:
        if not servicio_recuperado(alarma):
            alarmas_actualizadas.append(alarma)
        else:
            # Eliminar la alarma persistente si el servicio se ha recuperado
            tipo = alarma['tipo']
            if tipo in ultimas_alarmas:
                del ultimas_alarmas[tipo]
            guardar_alarmas(ultimas_alarmas)  # Actualizamos el archivo de alarmas
    
    shared_config.update_alarmas(alarmas_actualizadas)

# Función para analizar las ONUs
def analizar_onus_ping():
    datos = shared_config.get_all_onus_data()
    try:
        for dato in datos:
            ms = dato.get('ms', None)
            capa = dato.get('capa', None)
            
            if ms == 0:
                if capa == "CAMARAS":
                    generar_alarma(f"Cámara {dato.get('sector', 'Desconocido')} - {dato.get('name', 'Desconocido')}", "No responde")
                elif capa == "COMISARIA":
                    generar_alarma(f"Comisaria {dato.get('name', 'Desconocido')}", "No responde")
                elif capa == "CLIENTE":
                    generar_alarma(f"Cliente {dato.get('name', 'Desconocido')}", "No responde")
                elif capa == "EDUCAR":
                    generar_alarma(f"Predio {dato.get('name', 'Desconocido')} - {dato.get('nombre', 'Desconocido')}", "No responde")

        verificar_recuperacion()
    except Exception as e:
        generar_alarma("Error en análisis de ONUs Ping", str(e))  # Generar alarma en caso de error


def analisis_onus():
    def task_analisis():
        app = create_app()
        with app.app_context():
            while True:
                datos = shared_config.get_all_onus_data()
                
                for dato in datos:
                    if dato.get('onu_info'):
                        analizar_onu(dato)
                # Pausa de 30 segundos después de procesar todas las ONUs
                time.sleep(30)

    def analizar_onu(dato):
        try:
            onu_info = dato.get('onu_info', {})
            nombre_onu = onu_info.get('name', 'Desconocida')
            tiempo_reinicio = int(onu_info.get('connection_time', 0))  # Valor por defecto 0 si no existe
            potencia_rx = onu_info.get('optics', {}).get('rx_power_onu', '0dBm')
            temperatura_cpu = onu_info.get('system', {}).get('temps', {}).get('cpu', '0')

            potencia_rx = float(potencia_rx.replace("dBm", "").strip())
            temperatura_cpu = float(temperatura_cpu)

            puerto_4_info = onu_info.get('port', {}).get('4', {})
            puerto_4_activo = puerto_4_info.get("speed") != "unknown"
            if onu_info.get('online') == True:
                # Generar alarmas basado en las condiciones
                if tiempo_reinicio <= 30: 
                    generar_alarma(f"Reinicio de Onu {nombre_onu}", f"{tiempo_reinicio} seg.")
                if potencia_rx < -28: 
                    generar_alarma(f"Potencia baja {nombre_onu}", f"{potencia_rx} dBm")
                if temperatura_cpu >= 70: 
                    generar_alarma(f"Temperatura elevada en cpu {nombre_onu}", f"{temperatura_cpu} °C")
                if dato.get('alarma') and not puerto_4_activo: 
                    generar_alarma(f"Sin energía en Onu {nombre_onu}", dato['onu_info']['name'])
                verificar_recuperacion()
        except Exception as e:
            print(f"Error en la función analizar_onus: {e}")

    # Iniciar el análisis en un hilo separado
    thread = threading.Thread(target=task_analisis)
    thread.daemon = True
    thread.start()


# Iniciar el análisis periódico
def start_analizar_metricas():
    def task_alarmas():
        app = create_app()
        with app.app_context():
            while True:
                print("Analisis de Metricas")
                analizar_onus_ping()
                analisis_onus()
                time.sleep(30)  # Ejecutar cada 30 segundos

    thread = threading.Thread(target=task_alarmas)
    thread.daemon = True
    thread.start()