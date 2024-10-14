
import aiohttp 
import asyncio
import io
from PIL import Image
from client import DahuaClient
import json
import re
from mongodb import MongoDB
import datetime

from mqtt import MqttClient

broker = "172.40.20.114"
port = 1883
topic = "/python/olt"
sub = "/python/olt/reinicio"
client_id = "Maxi"
username = "msilva"
password = "msilva$911$"
sessionid = ""



async def handle_event_coroutine(data, channel, ip):
    try:
        now = datetime.datetime.now()
        now_str = now.strftime("%Y-%m-%d %H:%M:%S")
        # Encontrar la posición de "data="
        start_index = data.find(b"data=")
        if start_index != -1:
            # Extraer el fragmento JSON desde "data=" hasta el final del mensaje
            json_data = data[start_index + len(b"data="):].decode('utf-8')

            # Buscar el índice de la próxima ocurrencia de "\r\n" para delimitar el JSON
            end_index = json_data.find("\r\n")
            if end_index != -1:
                json_data = json_data[:end_index]
                try:
                    json_obj = json.loads(json_data)
                    #print(json_obj)
                    if 'Class' in json_obj:
                        if json_obj['Class'] == 'FaceDetection':
                            # Extraer los datos
                            document = {
                                "Class": json_obj['Class'],
                                "FrameSequence": json_obj['FrameSequence'],
                                "Objects": json_obj['Objects'],
                                "UTC": json_obj['UTC'],
                                "ip": ip,
                                "timestamp": now_str
                            }
                            print("FACE --> IP: {}, Time: {}".format(ip, now_str))
                            #mongo.insert_into_facedetection(document)
                        elif json_obj['Class'] == 'Traffic':
                            # Extraer los datos
                            document = {
                                "Class": json_obj['Class'],
                                "FrameSequence": json_obj['FrameSequence'],
                                "Category": json_obj["Vehicle"]['Category'],
                                "Objects": json_obj['TrafficCar'],
                                "UTC": json_obj['UTC'],
                                "ip": ip,
                                "timestamp": now_str
                            }
                            print("LPR --> IP: {}, Time: {}, Tipo {}".format(ip, now_str, json_obj["Vehicle"]['Category']))
                            #mongo.insert_into_lpr(document)
                            # Extraer los datos
                            try:
                                document = {
                                    "IP": ip,
                                    "Patente": json_obj["TrafficCar"]["PlateNumber"],
                                    "Color": json_obj["TrafficCar"]["VehicleColor"],
                                    "Velocidad": json_obj["TrafficCar"]["Speed"],
                                    "Coincidencia": json_obj["Vehicle"]["Confidence"],
                                    "Modelo": json_obj["TrafficCar"]["MachineName"],
                                    "Hora": now_str
                                }
                                document_str = json.dumps(document)
                                client_mqtt.publish(topic, document_str)
                            except KeyError as e:
                                None
                                #print("No se encontro la clave: ", e)

                            
                    else:
                        #print("El objeto JSON no contiene la clave 'Class'") 
                        #print(json_obj)
                        None
                except json.JSONDecodeError as e:
                    print(f"Error al decodificar el JSON: {e}")
            else:
                None
        else:
            None

    except json.JSONDecodeError as e:
        print(f"Error al decodificar el contenido JSON: {e}")
        print(f"Nuevo evento en canal {channel}: {data}")


def handle_event(data, channel, ip):
    asyncio.create_task(handle_event_coroutine(data, channel, ip))

async def main(ip_address):
    session = aiohttp.ClientSession()
    global client  # Declare global variable in the function
    client = DahuaClient(
        username="admin",
        password="Sussex731",
        address=ip_address,
        port=80,
        rtsp_port=554,
        session=session
    )
    events = ["All"]
    await client.stream_events(lambda data, ch: handle_event(data, ch, ip_address), events, channel=1)

    await session.close()


if __name__ == "__main__":
    # Crear una instancia de la clase MongoDB
    mongo = MongoDB(database='db911')
    # Obtener la colección "Camaras"
    camaras_collection = mongo.database['Camaras']

    client_mqtt = MqttClient()
    client_mqtt.set_username_pw(username, password)
    client_mqtt.connect(broker, port, 60)
    client_mqtt.subscribe(sub)
    #client.client.loop_forever()
    client_mqtt.client.loop_start()

    while True:
        loop = asyncio.get_event_loop()
        tasks = [loop.create_task(main(doc['ip'])) for doc in camaras_collection.find({'activo': True})]
        loop.run_until_complete(asyncio.gather(*tasks))

        #asyncio.run(main('172.40.32.123'))

        print("Todas las tareas han finalizado. Reiniciando el bucle.")

        #Ejemplo de respuesta FR
        #{'File': '/mnt/sd/2024-02-09/001/jpg/09/27/37[R][0@0][0].jpg', 'Size': 285927, 'StoragePoint': 'NULL'}
