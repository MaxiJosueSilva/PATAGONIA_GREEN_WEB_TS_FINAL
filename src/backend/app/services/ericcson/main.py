import requests
import urllib3

# Suprimir solo la advertencia de InsecureRequestWarning
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Crear una sesión para manejar cookies y redireccionamientos
session = requests.Session()

# URL de autenticación
auth_url = "https://10.10.110.60/auth.cgi"

# Datos de autenticación (ajusta estos datos según sea necesario)
auth_data = {
    "user": "oss",  # Cambiado a 'user' en lugar de 'username' para coincidir con el formulario
    "password": "default"
}

# Función para autenticarse
def authenticate(session, auth_url, auth_data):
    response = session.post(auth_url, data=auth_data, verify=False)
    if response.status_code == 200:
        print("Autenticación exitosa.")
        # Obtener cookies de la respuesta
        cookies = session.cookies
        if cookies:
            for cookie in cookies:
                print(f"{cookie.name}: {cookie.value}")
        else:
            print("No se recibieron cookies.")
    else:
        print(f"Error al autenticarse: {response.status_code}")
        response.raise_for_status()

# Función para hacer solicitudes a URLs protegidas
def get_protected_data(session, url):
    response = session.get(url, verify=False)
    print(f"Estado de la URL protegida {url}: {response.status_code}")
    if response.status_code == 200:
        return response.json()  # Asumiendo que la respuesta es JSON
    else:
        print(f"Error al acceder a {url}: {response.status_code}")
        return None

# Autenticar
authenticate(session, auth_url, auth_data)

# Consultar múltiples URLs protegidas
urls = [
    "https://10.10.110.60/json.cgi?getalarm",
    "https://10.10.110.60/json.cgi?getconf={%22mo%22:%22SDN=0,PowerManager=ERS,PowerSystem=M530B%22}",
    "https://10.10.110.60/json.cgi?getconf={%22mo%22:%22SDN=0,PowerManager=ERS,Battery=1%22}"
    # Agrega más URLs según sea necesario
]

for url in urls:
    data = get_protected_data(session, url)
    if data:
        print(f"Datos de {url}: {data}")


