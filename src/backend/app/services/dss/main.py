# import urllib3
# import base64

# def autenticar_y_guardar_cookie(ip, puerto, usuario, contrasena):
#     url = f"http://{ip}/cgi-bin/global.login?userName={usuario}"
    
#     http = urllib3.PoolManager(cert_reqs='CERT_NONE')  # Desactiva la verificación del certificado
    
#     try:
#         # Realiza la solicitud GET inicial sin autenticación
#         response = http.request('GET', url)
        
#         # Verifica el código de estado de la respuesta
#         if response.status == 401:
#             # Obtén el encabezado WWW-Authenticate para obtener el método de autenticación (Basic/Digest)
#             authenticate_header = response.headers.get('WWW-Authenticate')
#             if authenticate_header and 'Basic' in authenticate_header:
#                 # Autenticación básica: Codifica usuario:contraseña en Base64 y envía la solicitud nuevamente
#                 credentials = base64.b64encode(f"{usuario}:{contrasena}".encode('utf-8')).decode('utf-8')
#                 headers = {
#                     'Authorization': f'Basic {credentials}'
#                 }
#                 response = http.request('GET', url, headers=headers)
                
#                 # Verifica el código de estado de la respuesta después de la autenticación básica
#                 if response.status == 200:
#                     # Obtén las cookies de la respuesta
#                     cookies = response.headers.get('Set-Cookie')
#                     if cookies:
#                         # Busca y guarda el valor de JSESSIONID
#                         for cookie in cookies.split(';'):
#                             if 'JSESSIONID' in cookie:
#                                 jsessionid = cookie.split('=')[1]
#                                 return jsessionid
#                     else:
#                         print("Error: No se encontró la cookie de sesión en la respuesta.")
#                         return None
#                 else:
#                     print(f"Error al autenticar después de la autenticación básica. Código de estado: {response.status}")
#                     return None
#             else:
#                 print("Error: El método de autenticación no es compatible con Basic.")
#                 return None
#         else:
#             print(f"Error al obtener el estado de autenticación inicial. Código de estado: {response.status}")
#             return None
#     except Exception as e:
#         print(f"Error en la solicitud: {e}")
#         return None

# # Ejemplo de uso
# ip_dahua = "172.40.30.240"
# puerto_dahua = 80  # Ajusta el puerto según el datasheet, generalmente el puerto HTTP es 80 para la autenticación básica
# usuario_dahua = "maxisilva"
# contrasena_dahua = "maxipata911"

# jsessionid = autenticar_y_guardar_cookie(ip_dahua, puerto_dahua, usuario_dahua, contrasena_dahua)
# if jsessionid:
#     print(f"JSESSIONID: {jsessionid}")


# import socket
# def check_port(ip, port):
#      try:
#          with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
#              sock.settimeout(2)  # Establece un tiempo de espera para la conexión
#              result = sock.connect_ex((ip, port))
#              if result == 0:
#                  print(f"El puerto {port} está abierto en {ip}")
#                  # Aquí puedes enviar una solicitud específica al puerto y analizar la respuesta
#              else:
#                  print(f"El puerto {port} no está abierto en {ip}")
#      except socket.timeout:
#          print(f"Tiempo de espera agotado para el puerto {port} en {ip}")

# # # Ejemplo de uso:
# check_port("172.40.30.247", 9320)
# #check_port("172.40.30.247", 9102)



# import requests

# def check_service_status(ip, port):
#     try:
#         response = requests.get(f"http://{ip}:{port}", timeout=5)
#         if response.status_code == 200:
#             return "Running"
#         else:
#             return "Not Running"
#     except requests.RequestException:
#         return "Error connecting"

# # Uso
# status = check_service_status("172.40.30.247", 9320)
# print(f"Service status: {status}")
