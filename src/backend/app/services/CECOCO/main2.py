import struct

def read_dat_file(filename):
    with open(filename, 'rb') as file:
        # Leer los primeros bytes para detectar un posible encabezado
        header = file.read(10)  # Cambia la cantidad de bytes según el tamaño del encabezado
        print(f"Encabezado: {header}")
        
        # Después de leer el encabezado, lee el resto del archivo normalmente
        data = []
        while True:
            record = file.read(186)  # Cambia 186 según el tamaño de tus registros
            if not record:
                break
            fields = struct.unpack('iif100siicsicf50s', record)
            data.append(fields)
        return data
# Ejemplo de uso
filename = r"patagonia_web\backend-flask\app\services\CECOCO\GranParana_2024.dat"
data = read_dat_file(filename)

# Mostrar los datos recuperados
for record in data:
    print(record)
