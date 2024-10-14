"""
from ftplib import FTP
import cv2
import numpy as np
import io

# Conectarse al servidor FTP
ftp = FTP('172.40.20.114')
ftp.login(user='maxi', passwd='maxi2021$')

# Cambiar al directorio donde se encuentran las imágenes
ftp.cwd('/ftp/maxi')

# Obtener la lista de archivos en el directorio
files = ftp.nlst()

for file in files:
    # Crear un objeto BytesIO para almacenar los datos de la imagen
    r = io.BytesIO()
    ftp.retrbinary('RETR ' + file, r.write)

    # Leer la imagen con OpenCV
    r.seek(0)
    image = cv2.imdecode(np.frombuffer(r.read(), np.uint8), 1)

    # Mostrar la imagen
    cv2.imshow('Image', image)
    cv2.waitKey(0)

# Cerrar la conexión FTP
ftp.quit()

"""

"""

from ftplib import FTP

# Conectarse al servidor FTP
ftp = FTP('172.40.20.114')
ftp.login(user='maxi', passwd='maxi2021$')

# Cambiar al directorio donde se encuentran las imágenes
ftp.cwd('/ftp/maxi/172.40.33.214/20240409/')

# Cambiar el modo de transferencia a binario
ftp.voidcmd('TYPE I')

# Obtener la lista de archivos en el directorio
files = ftp.nlst()

# Calcular el tamaño total del directorio
total_size = 0
for file in files:
    try:
        total_size += ftp.size(file)
    except Exception as e:
        print("Error al obtener el tamaño del archivo ", file, ": ", e)

print("El tamaño total del directorio es: ", total_size)

# Si el tamaño total supera un límite, eliminar los archivos más antiguos
SIZE_LIMIT = 500 * 1024 * 1024  # 500 MB en bytes
if total_size > SIZE_LIMIT:
    # Ordenar los archivos por fecha de modificación
    files.sort(key=lambda x: ftp.sendcmd('MDTM ' + x))

    # Eliminar archivos hasta que el tamaño total esté por debajo del límite
    while total_size > SIZE_LIMIT and files:
        file = files.pop(0)
        try:
            ftp.delete(file)
            total_size -= ftp.size(file)
        except Exception as e:
            print("Error al eliminar el archivo ", file, ": ", e)

# Cerrar la conexión FTP
ftp.quit()

"""


from ftplib import FTP
import re

def obtener_contenido_directorio(ftp, directorio):
    """Obtiene el contenido (archivos y subcarpetas) de un directorio."""
    contenido = []
    try:
        ftp.cwd(directorio)
        ftp.dir(contenido.append)
    except Exception as e:
        print("Error al obtener el contenido de", directorio, ":", e)
    return contenido

def eliminar_archivos_recursivamente(ftp, directorio):
    """Elimina recursivamente archivos y subcarpetas dentro de un directoriowinsc."""
    contenido = obtener_contenido_directorio(ftp, directorio)
    archivos = []
    subcarpetas = []

    for elemento in contenido:
        match = re.match(r'^\S+\s+\S+\s+\S+\s+\S+\s+\S+\s+\S+\s+\S+\s+(.*)$', elemento)
        if match:
            nombre = match.group(1)
            if nombre.startswith("d"):
                subcarpetas.append(nombre[4:])
            else:
                archivos.append(nombre)

    # Eliminar archivos dentro del directorio actual
    for archivo in archivos:
        try:
            ftp.delete(archivo)
            print("Archivo eliminado:", archivo)
        except Exception as e:
            print("Error al eliminar el archivo", archivo, ":", e)

    # Eliminar subcarpetas de manera recursiva
    for subcarpeta in subcarpetas:
        if subcarpeta in ('.', '..'):
            continue  # Ignorar las referencias de directorio actual y padre
        eliminar_archivos_recursivamente(ftp, f"{directorio}/{subcarpeta}")
    
    # Después de eliminar todos los archivos y subcarpetas, eliminar la carpeta actual
    try:
        ftp.cwd('..')  # Cambiar al directorio padre
        ftp.rmd(directorio)
        print("Carpeta eliminada:", directorio)
    except Exception as e:
        print("Error al eliminar la carpeta", directorio, ":", e)

# Conectarse al servidor FTP
ftp = FTP('172.40.20.114')
ftp.login(user='maxi', passwd='maxi2021$')

# Llamar a la función para eliminar archivos y subcarpetas de forma recursiva
eliminar_archivos_recursivamente(ftp, '/ftp/maxi/172.40.33.214')

# Cerrar la conexión FTP
ftp.quit()