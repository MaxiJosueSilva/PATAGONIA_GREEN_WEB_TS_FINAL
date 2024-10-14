class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:secret@172.40.20.114:33060/db911'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    #Telegram
    TELEGRAM_BOT_TOKEN = "7535785526:AAE6B6YdVXeHRTWgGwT6XO9cqBhLNCIQmMs"
    TELEGRAM_CHAT_ID = "953993883"
    
    # Configuración MQTT
    MQTT_BROKER = "172.40.20.114"
    MQTT_PORT = 1883
    MQTT_TOPIC = "/#"
    MQTT_ID = "Maxi"
    MQTT_USERNAME = "msilva"
    MQTT_PASSWORD = "msilva$911$"
    
    # Configuración OLT
    OLT_USERNAME = "maxi"
    OLT_PASSWORD = "maxi2021$"
    OLT_IPS = [
        {"IP": "10.10.110.211", "NAME": "OLT 1"},
        {"IP": "10.10.110.212", "NAME": "OLT 2"},
        {"IP": "10.10.110.213", "NAME": "OLT 3"},
        {"IP": "10.10.110.214", "NAME": "OLT 4"}
    ]
