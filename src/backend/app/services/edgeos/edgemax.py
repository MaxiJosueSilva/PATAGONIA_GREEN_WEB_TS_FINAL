import requests
import logging
import json
# Configura el módulo logging para registrar mensajes de depuración y errores
logging.basicConfig(level=logging.WARNING)
log = logging.getLogger(__file__)

# Desactiva las advertencias de seguridad de urllib3
requests.packages.urllib3.disable_warnings(
    requests.packages.urllib3.exceptions.InsecureRequestWarning
)

class EdgeMaxAPI:
    def __init__(self, host, port=443, name="", username="ubnt", password="ubnt", timeout=30):
        self.host = host
        self.port = port
        self.name = name
        self.username = username
        self.password = password
        self.timeout = timeout
        self.scheme = "https" if (self.port == 443) else "http"
        self.url = "{scheme}://{host}:{port}".format(
            scheme=self.scheme, host=self.host, port=self.port
        )
        self.headers = {"User-Agent": "Mozilla/5.0 Gecko/20100101 Firefox/58.0"}
        self.sessionid = None

    def login(self):
        url = self.url
        headers = self.headers
        response = requests.get(url, verify=False, headers=headers, allow_redirects=False, timeout=self.timeout)
        beaker_session_id = response.cookies.get('beaker.session.id', '')

        if not beaker_session_id:
            return False

        headers = {"Cookie": "beaker.session.id=%s" % beaker_session_id}
        response = requests.post(url, verify=False, headers=headers, timeout=self.timeout, allow_redirects=False, data={"username": self.username, "password": self.password})
        self.sessionid = "beaker.session.id=" + response.cookies['beaker.session.id']

        cookie_authenticated_flag = all([_ in response.cookies for _ in ['PHPSESSID', 'X-CSRF-TOKEN', 'beaker.session.id']])
        status = (response.status_code == 303) and cookie_authenticated_flag

        if status:
            self.headers = {'Cookie': self.sessionid}
            return True
        else:
            return False

    def get_onu_list(self):
        if not self.headers:
            return None

        url = "https://{host}/api/edge/data.json?data=gpon_onu_list".format(host=self.host)

        try:
            response = requests.get(url, headers=self.headers, verify=False)
            data = response.json()
            data['name'] = self.name
            return data
        except Exception as ex:
            print("Código de estado de la respuesta:", response.status_code)
            print("Contenido de la respuesta:", response.text)
            return None

    def get_mac_port(self, onu_serial):
        if not self.headers:
            return None

        url = "https://{host}/api/olt/get-onu-macs.json?serial={onu_serial}".format(host=self.host, onu_serial=onu_serial)
        try:
            response = requests.get(url, headers=self.headers, verify=False)
            data = response.json()
            data['name'] = self.name
            return data
        except Exception as ex:
            print("Código de estado de la respuesta:", response.status_code)
            print("Contenido de la respuesta:", response.text)
            return None

    def reboot_onu(self, onu_serial):
        if not self.headers:
            return None

        url = f"https://{self.host}/api/edge/onu/reboot.json"
        headers = {
            'accept': '*/*',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'es,es-ES;q=0.9',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'cookie': self.sessionid,
            'origin': f'https://{self.host}',
            'referer': f'https://{self.host}/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest'
        }
        payload = f"serial={onu_serial}"
        
        try:
            response = requests.post(url, headers=headers, data=payload, verify=False)
            
            if response.status_code == 200:
                print(f"Reinicio de ONU {onu_serial} exitoso")
                print(f"Respuesta del servidor: {response.json()}")
                return response.json()
            else:
                print(f"Error al reiniciar la ONU {onu_serial}")
                print(f"Código de estado: {response.status_code}")
                print(f"Respuesta del servidor: {response.text}")
                return None
        except Exception as e:
            print(f"Error al reiniciar la ONU: {e}")
            return None

    def set_onu(self, onu_serial):
        if not self.headers:
            return None

        url = f"{self.scheme}://{self.host}/api/edge/batch.json"
        headers = self.headers.copy()
        headers['Content-Type'] = 'application/json'  # Cambiar Content-Type a JSON
        
        payload = {
            "SET": {
                "onu-list": {
                    onu_serial: {
                        "disable": "false",
                        "profile": "profile-4",
                        "name": "PRUEBA",
                        "wifi": {
                            "provisioned": False,
                            "enabled": True,
                            "ssid": "UBNT-ONU",
                            "hide-ssid": False,
                            "auth-mode": "wpa2psk",
                            "wpapsk": "",
                            "channel": "auto",
                            "channel-width": "20/40",
                            "tx-power": "100"
                        },
                        "pppoe-mode": "auto",
                        "pppoe-user": "",
                        "pppoe-password": "",
                        "wan-address": "",
                        "port-forwards": []
                    }
                }
            }
        }
        
        data = json.dumps(payload)  # Convertir el diccionario a JSON
        
        response = requests.post(url, headers=headers, data=data, verify=False)
        print(response.status_code)

    def leer_logs(self, num_lineas=100):
        if not self.headers:
            return None

        url = f"{self.scheme}://{self.host}/api/edge/operation/syslog.json"
        headers = self.headers.copy()
        
        params = {
            'lines': num_lineas
        }
        
        try:
            response = requests.get(url, headers=headers, params=params, verify=False)
            
            if response.status_code == 200:
                logs = response.json()
                print(f"Logs obtenidos exitosamente:")
                for log in logs:
                    print(log)
                return logs
            else:
                print(f"Error al obtener los logs")
                print(f"Código de estado: {response.status_code}")
                print(f"Respuesta del servidor: {response.text}")
                return None
        except Exception as e:
            print(f"Error al leer los logs: {e}")
            return None