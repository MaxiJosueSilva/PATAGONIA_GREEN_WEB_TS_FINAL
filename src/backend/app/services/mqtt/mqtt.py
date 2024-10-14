
import paho.mqtt.client as mqtt
import logging
from app.config import Config



class MQTTClient:
    def __init__(self, broker, port, topic, username=None, password=None):
        self.broker = broker
        self.port = port
        self.topic = topic
        self.client = mqtt.Client()
        if username and password:
            self.client.username_pw_set(username, password)
        self.logger = logging.getLogger(__name__)
        self.setup_logging()

    def setup_logging(self):
        self.logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)

    def on_connect(self, client, userdata, flags, rc):
        self.logger.info(f"Conectado con el código de resultado {str(rc)}")
        client.subscribe(self.topic)

    def on_message(self, client, userdata, msg):
        self.logger.info(f"Mensaje recibido: {msg.payload.decode()} en el tema {msg.topic}")

    def start(self):  
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        try:
            self.client.connect(self.broker, self.port, 60)
            self.client.loop_start()
        except Exception as e:
            self.logger.error(f"Error al conectar: {str(e)}")

    def send_message(self, message):
        try:
            self.client.publish(self.topic, message)
            #self.logger.info(f"Mensaje enviado: {message}")
        except Exception as e:
            self.logger.error(f"Error al enviar mensaje: {str(e)}")

    def enviar_mensaje_mqtt(self, topic, mensaje):
            try:
                self.client.publish(topic, mensaje)
                #self.logger.info(f"Mensaje enviado al tema {topic}: {mensaje}")
            except Exception as e:
                self.logger.error(f"Error al enviar mensaje al tema {topic}: {str(e)}")

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()
        self.logger.info("Cliente MQTT detenido")

if __name__ == "__main__":
    client = MQTTClient(Config.MQTT_BROKER, Config.MQTT_PORT, Config.MQTT_TOPIC, Config.MQTT_USERNAME, Config.MQTT_PASSWORD)
    client.start()

    try:
        while True:
            pass
    except KeyboardInterrupt:
        client.logger.info("Deteniendo el cliente...")
        client.stop()

        