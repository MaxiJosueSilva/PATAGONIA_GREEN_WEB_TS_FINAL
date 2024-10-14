import paho.mqtt.client as mqtt

class MqttClient:
    def __init__(self):
        self.client = mqtt.Client()
        self.username = None
        self.password = None

    def set_username_pw(self, username, password):
        self.username = username
        self.password = password

    def connect(self, host, port, keepalive):
        if self.username is not None and self.password is not None:
            self.client.username_pw_set(self.username, self.password)
        self.client.connect(host, port, keepalive)

    def subscribe(self, topic):
        self.client.subscribe(topic)

    def publish(self, topic, payload):
        self.client.publish(topic, payload)

    def start_loop(self):
        self.client.loop_start()

    def stop_loop(self):
        self.client.loop_stop()

    def set_on_connect_callback(self, callback):
        self.client.on_connect = callback

    def set_on_disconnect_callback(self, callback):
        self.client.on_disconnect = callback

    def set_on_message_callback(self, callback):
        self.client.on_message = callback
