"""
import routeros_api

# Crear una conexión con el dispositivo MikroTik
connection = routeros_api.RouterOsApiPool(
                '190.216.32.98',
                username='rootmin',
                password='p@t@fiber354',
                port=8728,
                use_ssl=False,
                ssl_verify=True,
                ssl_verify_hostname=True,
                ssl_context=None,
                plaintext_login=True
            )

# Obtener la API
api = connection.get_api()

# Obtener el recurso
resource = api.get_resource('/interface')



def bytes_to_human_readable(byte_value):
    # Definir los sufijos para cada unidad
    units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

    # Inicializar el índice de la unidad
    unit_index = 0

    # Mientras el valor sea mayor o igual a 1024 y aún queden unidades, dividir por 1024 e incrementar el índice de la unidad
    while byte_value >= 1024 and unit_index < len(units) - 1:
        byte_value /= 1024.0
        unit_index += 1

    # Devolver el valor transformado con su unidad correspondiente
    return f'{byte_value:.2f} {units[unit_index]}'

def calculate_bandwidth(current_value, previous_value, interval_in_seconds):
    # Restar el valor anterior del valor actual para obtener la diferencia
    difference = current_value - previous_value

    # Dividir la diferencia por el intervalo en segundos para obtener el ancho de banda
    bandwidth = difference / interval_in_seconds

    # Devolver el ancho de banda
    return bandwidth

def prepare_data_for_chart(current_data, previous_data, interval_in_seconds):
    chart_data = []
    for item, previous_item in zip(current_data, previous_data):
        rx_bandwidth = calculate_bandwidth(int(item['rx-byte']), int(previous_item['rx-byte']), interval_in_seconds)
        tx_bandwidth = calculate_bandwidth(int(item['tx-byte']), int(previous_item['tx-byte']), interval_in_seconds)
        chart_data.append({
            'name': item['name'],
            'rx-bandwidth': bytes_to_human_readable(rx_bandwidth) if rx_bandwidth >= 0 else '0 B',
            'tx-bandwidth': bytes_to_human_readable(tx_bandwidth) if tx_bandwidth >= 0 else '0 B'
        })
    return chart_data

if __name__ == '__main__':
    # Obtener los datos actuales
    current_data = resource.get()

    # Esperar un intervalo de tiempo (por ejemplo, 5 segundos)
    import time
    time.sleep(1)

    # Obtener los datos después del intervalo de tiempo
    previous_data = resource.get()

    # Calcular el ancho de banda y preparar los datos para el gráfico
    chart_data = prepare_data_for_chart(previous_data, current_data, interval_in_seconds=1)

    # Imprimir los datos del gráfico
    print(chart_data)
"""

import time
import routeros_api

class MikrotikMonitor:
    def __init__(self, host, username, password, port=8728, use_ssl=False, ssl_verify=True, ssl_verify_hostname=True, ssl_context=None, plaintext_login=True):
        self.connection = routeros_api.RouterOsApiPool(
            host,
            username=username,
            password=password,
            port=port,
            use_ssl=use_ssl,
            ssl_verify=ssl_verify,
            ssl_verify_hostname=ssl_verify_hostname,
            ssl_context=ssl_context,
            plaintext_login=plaintext_login
        )
        self.api = self.connection.get_api()
        self.resource = self.api.get_resource('/interface')

    @staticmethod
    def bytes_to_human_readable(byte_value):
        units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
        unit_index = 0
        while byte_value >= 1024 and unit_index < len(units) - 1:
            byte_value /= 1024.0
            unit_index += 1
        return f'{byte_value:.2f} {units[unit_index]}'

    @staticmethod
    def calculate_bandwidth(current_value, previous_value, interval_in_seconds):
        difference = current_value - previous_value
        bandwidth = difference / interval_in_seconds
        return bandwidth

    def prepare_data_for_chart(self, current_data, previous_data, interval_in_seconds):
        chart_data = []
        for item, previous_item in zip(current_data, previous_data):
            rx_bandwidth = self.calculate_bandwidth(int(item['rx-byte']), int(previous_item['rx-byte']), interval_in_seconds)
            tx_bandwidth = self.calculate_bandwidth(int(item['tx-byte']), int(previous_item['tx-byte']), interval_in_seconds)
            chart_data.append({
                'name': item['name'],
                'rx-bandwidth': self.bytes_to_human_readable(rx_bandwidth) if rx_bandwidth >= 0 else '0 B',
                'tx-bandwidth': self.bytes_to_human_readable(tx_bandwidth) if tx_bandwidth >= 0 else '0 B'
            })
        return chart_data

    def monitor(self, interval_in_seconds=1):
        current_data = self.resource.get()
        time.sleep(interval_in_seconds)
        previous_data = self.resource.get()
        chart_data = self.prepare_data_for_chart(previous_data, current_data, interval_in_seconds)
        return chart_data

if __name__ == '__main__':
    # Uso de la clase
    #monitor = MikrotikMonitor('190.216.32.98', 'rootmin', 'p@t@fiber354')
    #data = monitor.monitor()
    #print(data)

    monitor_trama = MikrotikMonitor('172.40.20.70', 'patagonia', 'Pata911$')
    data = monitor_trama.monitor()
    print(data)