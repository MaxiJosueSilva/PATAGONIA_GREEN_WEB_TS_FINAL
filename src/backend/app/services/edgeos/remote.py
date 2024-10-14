import time
import threading
import json 
import os
import importlib.util
import paho.mqtt.client as mqtt


dir_path = os.path.dirname(os.path.realpath(__file__))
file_path = os.path.join(dir_path, 'edgemax.py')

spec = importlib.util.spec_from_file_location("edgemax", file_path)
edgemax = importlib.util.module_from_spec(spec)
spec.loader.exec_module(edgemax)


class EdgeMaxManager:
    def __init__(self, config):
        self.config = json.loads(json.dumps(config))
        self.logs = []
        self.data_array = []
    def log(self, ip, msg):
        self.logs.append(f"[{ip}] {msg}")

    def edgemax_login(self, ip, name):
        try:
            # Crea una instancia de EdgeMaxLogin y usa su método login
            login = edgemax.EdgeMaxLogin(ip, username=self.config['OLT']['username'], password=self.config['OLT']['password'])
            data = login.login()
            if data and 'output' in data and 'GET_ONU_LIST' in data['output']:
                #onu_list = data['output']['GET_ONU_LIST']
                #data['data'] = onu_list
                data['name'] = name
                self.data_array.append(data)
        except Exception as e:
            self.log(ip, f"Error: {e}")

    def run(self):
        while True:
            self.data_array = []
            threads = []
            for ip_dict in self.config['IPS']:
                thread = threading.Thread(target=self.edgemax_login, args=(ip_dict['IP'], ip_dict['NAME']))
                threads.append(thread)
                thread.start()
            for thread in threads:
                thread.join()
            # Antes de emitir, verifica que el objeto JSON sea válido
            try:
                json.dumps(self.data_array)
            except ValueError as e:
                print(f"El objeto JSON no es válido: {e}")
            else:
                #print (self.data_array)
                # Si el objeto JSON es válido, entonces emite
                self.socketio.emit('olt', {'data': self.data_array})
            time.sleep(30)

    def onus(self):
        try:
            self.data_array = []
            threads = []
            for ip_dict in self.config['IPS']:
                thread = threading.Thread(target=self.edgemax_login, args=(ip_dict['IP'], ip_dict['NAME']))
                threads.append(thread)
                thread.start()

            for thread in threads:
                thread.join()

            return self.data_array

        except Exception as e:
            # Manejar excepciones según tus necesidades
            print(f"Error en el método 'onus': {e}")
            return []

    def potencia(self, Pot):
        try:
            data = self.onus()
            filtered_data = []
            for data in self.data_array:
                if 'output' in data and 'GET_ONU_LIST' in data['output']:
                    onu_list = data['output']['GET_ONU_LIST']
                    filtered_data = [onu_data for onu_data in onu_list if onu_data.get("optics", {}).get("rx_power_onu") is not None and "dBm" in onu_data["optics"]["rx_power_onu"] and float(onu_data["optics"]["rx_power_onu"].replace("dBm", "")) <= Pot]                
            return filtered_data

        except Exception as e:
            # Manejar excepciones según tus necesidades
            print(f"Error en el método 'potencia': {e}")
            return []
    
    def Alarma_Energia(self):
        try:
            data = self.onus()
            filtered_data = []
            for onu_data in self.data_array:
                if 'output' in onu_data and 'GET_ONU_LIST' in onu_data['output']:
                    onu_list = onu_data['output']['GET_ONU_LIST']
                    for onu_info in onu_list:
                        if onu_info.get("port") and onu_info["port"].get("4"):
                            # Verificar si hay algo conectado en el puerto 4
                            port_4_info = onu_info["port"]["4"]
                            if port_4_info.get("speed") != "unknown":
                                filtered_data.append(onu_info)

            return filtered_data

        except Exception as e:
            # Manejar excepciones según tus necesidades
            print(f"Error en el método 'Alarma_Energia': {e}")
            return []
        
    def onu_nueva(self):
        try:
            data = self.onus()
            filtered_data = []

            for data_item in self.data_array:
                if 'output' in data_item and 'GET_ONU_LIST' in data_item['output']:
                    onu_list = data_item['output']['GET_ONU_LIST']
                    
                    # Filtrar por "serial_number" igual a "name"
                    filtered_data.extend([onu_data for onu_data in onu_list if onu_data.get("serial_number") == onu_data.get("name") and onu_data.get("optics", {}).get("rx_power_onu") is not None and "dBm" in onu_data["optics"]["rx_power_onu"]])
                        
            return filtered_data

        except Exception as e:
            # Manejar excepciones según tus necesidades
            print(f"Error en el método 'potencia': {e}")
            return []

# Uso de la clase
if __name__ == "__main__":

    f = {
        "OLT" : {
            "username" : "maxi", 
            "password" : "maxi2021$"
        },
        "IPS" : [
            {"IP" : "10.10.110.211", "NAME": "OLT 1"},
            {"IP" : "10.10.110.212", "NAME": "OLT 2"},
            {"IP" : "10.10.110.213", "NAME": "OLT 3"},
            {"IP" : "10.10.110.214", "NAME": "OLT 4"}
        ]
    }
    
    broker = "mqtt.redengas.com.ar"
    port = 11883
    topic = "/python/olt"
    sub = "/python/olt/reinicio"
    client_id = "Maxi"
    username = "redengasmqtt"
    password = "rdg..1029"
    sessionid = ""


    client = mqtt.Client()

    client.username_pw_set(username, password) 
    client.connect(broker, port, 60)

    client.subscribe(sub)
    #client.loop_forever()

    
    #data = manager.potencia(-27)
    while (True):
        manager = EdgeMaxManager(f)
        data = manager.onus()
        
        client.publish(topic, json.dumps(data))
        print (data)
        data = ''
        time.sleep(30)