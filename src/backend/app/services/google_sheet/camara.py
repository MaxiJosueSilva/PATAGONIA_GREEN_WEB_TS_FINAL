import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import mysql.connector
import requests
from PIL import Image
from io import BytesIO
import os
import uuid
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import re

def getgoogleSheet():
    credentials = {
        "type": "service_account",
        "project_id": "mantenimiento911",
        "private_key_id": "dd50d1bbc098667c76f057ab74370ecf45a14379",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLOvcQqcyb8MVY\nP68K2LHZcWzJ1vlkub3iNKPLKT6HldCGQv1j05BycU7vhj0kwXEZK5ERT7Q3osta\nn2Rj56oZWCL7q8tM5EOr4zttKAbASjoU6bFFrHg+mlVb3IFajzna0U2X4lUScRWx\nwDB4ppYUe0FV9632QV+bDj5owbuUzByWnHYCySLQyJwY63Z35NyfKKJ2OnmuFOHS\nQ/NE+/yFoEHZzdccV9FT36ek+PLTa2zxnG299JYxhtQm1fM+tb35iPglFQyRl/ym\nkwU7bqnUJMzgfh/RwQgGNU5LtVytMLiv61+IvikgfmtymsJdy34Ipl41TfB1LX7s\nld5WsHI1AgMBAAECggEABOM0spABD2BZh4c8G6sA5bybzpyiXFup3Jy0JCqL323F\nfNNXYyUZ8eFPDo/XWURjeHpFozJjLpkg5b8mBl3yeTAB/189T2qkmf0ZyRok/of8\nPPBLKlZZZKAIcik5+dSR94Mc4PAc2hfpBcQcQsGoo+RYuq7g+rSU47L2G0W8lwfM\nbN9RmfJh82rRjX5UnMotAzFfMM6rV1YveFk5zVDcpxeYvuV3VffU2lUu6qFzPy1l\npz3orfTiE133G4UFDnQxYXJoQJS1Q8+ovBO5dla5b1+pTocM7lwfnooUACsPHXpH\noDSxVb4PXr9sDO2XOnNo9AMI7RQmLzMd9zehbFs6QQKBgQDoea5bS5piiqtR2248\ncbv10090piU+YTGJ/zAWX0lnDCzD0FRZACLkWq4lk4U0tA06MTCCwmW6tTx/f6XT\nLQPFII96tVnzZUxV7QGIiFEUZxpvirUbWgRoBXBCR8UhaebfpEpL4ciKjhRTpFBz\nRCIWFvXQMa9df/mhkTmUV5565QKBgQDfy6/azaLPt/5qgxkn1LoIjpHZH8jCa0Qp\naRl4GxBO6s0oxiRcuXYRtX4KwIXdK421QXVMFJ/e5FN1KumAzCxAOo3nt/G7+6cL\nRdQ6eV7FXIw2Uohn8xlNCl2oJ/gSdguaquFhp2HwTY/YL8R7PK2QP0tyOJNqCs9w\n6S/lp+eVEQKBgDwO64d0ca8Rig78tG7zJw7sB3PoVGjYLTcscRzmgw0XLR1tXc0c\nZuc9sg3NHbWu6lflS1YMqMFifv2lWY7D61xq/AZEgbeKrPzp3OKL7P5rYH3+hKlL\nSSYieYz2A6yNMnMGe5c8/lUlPYUaRxpwOKoiRmEB5P8vx6sA3LJBLJUtAoGBAJJ7\nL893aWmsdMoipQR9KIcRSkVjmHQo4aR5NkJ29GWzKjXV+1b1zWIp+SXwfa4WI9rP\nzYbOuRWbPUUjoVK8UPp5WQiiTYdNYDjwq8jaSD3GJcAopT/kzlquvj6iaq0qts21\nq2/PrzsqiUxnd6NyQ+h2hVttzI9MJBszhjY7gEkBAoGAInP5VTDlyWsic0Uoe8w2\n1MGE6xIrgSuNl//nfrD8+rZ/ywtVTNIgmxoO5K5FAvOsUrNEi2Bv2NtY77Iu6ooR\nUPGc0X2wlZfluWldQyApUhP+vnWNwF9hcybjFptSPcoko4zlzhfN5apYDM1KwG2c\nxTUAXKH/UD7GQMt04dNqo/g=\n-----END PRIVATE KEY-----\n",
        "client_email": "node-red@mantenimiento911.iam.gserviceaccount.com",
        "client_id": "105600858654799890672",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/node-red%40mantenimiento911.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
        }
    # Usa las credenciales para crear una sesión de cliente
    scope = ['https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_dict(credentials, scope)
    client = gspread.authorize(creds)

    # Abre la hoja de cálculo y obtén la primera hoja
    spreadsheet_id = '18kaygUrgdS57agUmnmdLM5goj5dch30QVsKyKV3e9JE'


    spreadsheet = client.open_by_key(spreadsheet_id)
    worksheet = spreadsheet.worksheet('Respuestas')
    records = worksheet.get_all_records()

    #Imprime los datos
    #for cell in records:
    #       print(cell)

    return records

def guardar_imagen(imagen):
    if imagen:
        image_url = imagen.replace('/open?id=', '/uc?export=view&id=')
        response = requests.get(image_url)
        img = Image.open(BytesIO(response.content))

        # Genera un nombre de archivo único y seguro
        filename = secure_filename(str(uuid.uuid4()) + '.jpg')

        # Define la ruta del directorio donde se guardarán las imágenes
        dir_path = 'imagenes/'
        #dir_path = 'src/static/images/'
        # Si el directorio no existe, créalo
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)

        # Define la ruta completa del archivo de destino
        destination = os.path.join(dir_path, filename)

        # Guarda la imagen en el directorio
        img.save(destination)

        # Devuelve el nombre del archivo guardado
        return filename
    return None

def obtener_id_camara(cursor, nombre_camara):
    # Consulta para obtener el idCamara basado en el nombre de la cámara
    nombre_limpio = re.sub(r'\|.*\| ', '', nombre_camara)
    cursor.execute("SELECT idCamara FROM camaras WHERE name = %s", (nombre_limpio,))
    resultado = cursor.fetchone()
    cursor.fetchall()
    return resultado[0] if resultado else None

def descargar_google_sheet(cells):
    try:
        # Conexión a la base de datos MySQL
        cnx = mysql.connector.connect(user='root', password='secret',
                                      host='172.40.20.114',
                                      port=33060,
                                      database='db911')
        cursor = cnx.cursor()

        for record in cells:
            fecha_servicio_str = record.get('Fecha Servicio', '')

            # Verificar si la cadena de fecha está vacía antes de intentar convertirla
            if fecha_servicio_str:
                try:
                    fecha = datetime.strptime(fecha_servicio_str, '%d/%m/%Y')
                except ValueError:
                    # Manejar el caso en que la conversión falle (puedes imprimir un mensaje o asignar una fecha predeterminada)
                    fecha = "01-10-2000"
                    fecha = datetime.strptime(fecha, '%d/%m/%Y')
            else:
                # Asignar una fecha predeterminada en caso de que la cadena esté vacía
                fecha = "01-10-2000"
                fecha = datetime.strptime(fecha, '%d/%m/%Y')

            nombre = record['CAMARA']
            # Verificar si el registro ya existe
            cursor.execute("SELECT COUNT(*) FROM mantenimiento WHERE fecha = %s AND camara = %s", (fecha, nombre))

            existe_registro = cursor.fetchone()[0] > 0
            cursor.fetchall()

            if not existe_registro:
                # Recorre los registros e inserta en la base de datos 
                fecha = datetime.strptime(record['Fecha Servicio'], '%d/%m/%Y')
                nombre = record['Personal']
                tipo_servicio = record['Tipo Servicio']
                id_camara = obtener_id_camara(cursor, record['CAMARA'])
                camara = record['CAMARA']
                cinta = record['CINTA']
                try:
                    tension = int(record['TENSION'])
                except (ValueError, TypeError):
                    # Si la conversión a entero falla, establecer tension en 0
                    tension = 0
                ups_tiempo = record['CHEQUEO [UPS ( MANTIENE CARGA )]']
                cooler_1 = record['CHEQUEO [COOLERS]']
                cooler_2 = record['CHEQUEO [COOLERS_2]']
                filtro = record['CHEQUEO [FILTROS]']
                dado = record['CHEQUEO [DADO]']
                candado = record['CHEQUEO [CANDADO]']
                pintura = record['CHEQUEO [PINTURA]']
                descripcion = record['DESCRIPCION']
                imagen_camara = guardar_imagen(record['Foto Cámara'])
                imagen_gabinete = guardar_imagen(record['Foto Gabinete'])
                imagen_poste = guardar_imagen(record['Foto Poste Referenciado'])
                imagen_ups = guardar_imagen(record['Foto UPS'])
                imagen_filtro = guardar_imagen(record['Foto Filtro (Opcional)'])

                cursor.execute("INSERT INTO mantenimiento (fecha, idCamara, nombre, tipo_servicio, camara, cinta, tension, "
                            "ups_tiempo, cooler_1, cooler_2, filtro, dado, candado, pintura, descripcion, "
                            "imagen_camara, imagen_gabinete, imagen_poste, imagen_ups, imagen_filtro) "
                            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                            (fecha, id_camara, nombre, tipo_servicio, camara, cinta, tension,
                                ups_tiempo, cooler_1, cooler_2, filtro, dado, candado, pintura, descripcion,
                                imagen_camara, imagen_gabinete, imagen_poste, imagen_ups, imagen_filtro))

                # Confirma los cambios en la base de datos y cierra la conexión
                cnx.commit()

        cursor.close()
        cnx.close()
    except Exception as e:
        print(f"Ocurrió un error: {e}")



cells = getgoogleSheet()
descargar_google_sheet(cells)
