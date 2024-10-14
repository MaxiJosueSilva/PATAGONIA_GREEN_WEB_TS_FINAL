def analizar_archivo(dat_file):
    try:
        with open(dat_file, 'r', encoding='utf-8') as file:
            for i, line in enumerate(file):
                if i < 10:  # Muestra las primeras 10 líneas para inspeccionar
                    print(f"Línea {i + 1}: {line.strip()}")
                else:
                    break
    except Exception as e:
        print(f"Error al leer el archivo: {e}")

# Reemplaza 'archivo.dat' con el nombre de tu archivo .dat

def analizar_archivo_binario(dat_file):
    try:
        with open(dat_file, 'rb') as file:
            contenido = file.read(5000)  # Lee los primeros 100 bytes
            print(contenido)
    except Exception as e:
        print(f"Error al leer el archivo: {e}")

#analizar_archivo_binario(r"patagonia_web\backend-flask\app\services\CECOCO\GranParana_2024.dat")

analizar_archivo_binario(r"patagonia_web\backend-flask\app\services\CECOCO\SauceLuna02.dat")