import DSSClient
import sys
from getpass import getpass

# Configuración inicial
dss_username = 'maxisilva'
dss_password = 'maxipata911'
schedule_name = '172.40.30.240'  # Nombre del horario o programa a consultar
file_type = "all"  # Tipo de archivo a descargar ("all", "note", "ric", "data")
aws_download = False  # Indica si se va a usar descarga directa a AWS

# Instancia del cliente DSS
dss_client = DSSClient.DSSClient()

def autenticar_y_obtener_token():
    try:
        dss_client.login(dss_username, dss_password)
        print("Login exitoso")
    except Exception as ex:
        print(f"Error en el login: {ex}")
        sys.exit(1)

def listar_y_mostrar_horarios():
    try:
        schedules = dss_client.list_all_schedules()
        if schedules and "value" in schedules:
            for schedule in schedules["value"]:
                print(f"Nombre del horario: {schedule['Name']}")
                print(f"Tipo de activación: {schedule['Trigger']['@odata.type']}")
                print("-----------------------------")
    except Exception as ex:
        print(f"Error al listar horarios: {ex}")

def obtener_ultimo_extraido():
    try:
        schedule = dss_client.get_schedule_by_name(schedule_name)
        print(f"ID del horario '{schedule_name}': {schedule['ScheduleId']} ({schedule['Trigger']['@odata.type']})")
        last_extraction = dss_client.get_last_extraction(schedule)
        print(f"Última extracción realizada el: {last_extraction['ExtractionDateUtc']} GMT")
    except Exception as ex:
        print(f"Error al obtener última extracción: {ex}")

def descargar_archivos_extraidos():
    try:
        schedule = dss_client.get_schedule_by_name(schedule_name)
        last_extraction = dss_client.get_last_extraction(schedule)
        
        if file_type == "all":
            extracted_files = dss_client.get_all_files(last_extraction)
            if "value" in extracted_files:
                for file in extracted_files["value"]:
                    print(f"Archivo extraído: {file['ExtractedFileName']} ({file['Size']} bytes)")
                    print("Descargando...")
                    dss_client.download_file(file, aws_download)
                    print("Descarga completada")
        else:
            extracted_file = dss_client.get_file(last_extraction, file_type)
            print(f"Archivo extraído: {extracted_file['ExtractedFileName']} ({extracted_file['Size']} bytes)")
            print("Descargando...")
            dss_client.download_file(extracted_file, aws_download)
            print("Descarga completada")
    except Exception as ex:
        print(f"Error al descargar archivos extraídos: {ex}")

# Ejecutar las operaciones
autenticar_y_obtener_token()
listar_y_mostrar_horarios()
obtener_ultimo_extraido()
descargar_archivos_extraidos()
