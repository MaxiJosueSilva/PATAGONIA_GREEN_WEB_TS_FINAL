import ping3  # Importar la biblioteca ping3
import time

def ping(target, num_repetitions=3, max_retries=2):
    total_response_time = 0
    successful_pings = 0
    
    for _ in range(max_retries):
        for _ in range(num_repetitions):
            try:
                response = ping3.ping(target, timeout=4, unit='ms')
                if response is not None and response > 0:
                    total_response_time += response
                    successful_pings += 1
                    break  # Salir del bucle interno si el ping es exitoso
            except Exception as e:
                print(f"Error al hacer ping a {target}: {str(e)}")
            time.sleep(0.05)  # Aumentar el delay entre repeticiones
        
        if successful_pings > 0:
            break
        time.sleep(0.5)  # Esperar medio segundo antes de intentar de nuevo
    
    if successful_pings == 0:
        print(f"No se pudo hacer ping a {target} después de {max_retries} intentos")
        return 0
    
    average_response_time = total_response_time / successful_pings
    return round(average_response_time, 2)  # Redondear a dos decimales