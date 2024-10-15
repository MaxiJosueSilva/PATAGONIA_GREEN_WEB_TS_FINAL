from edgemax import EdgeMaxAPI
import requests
import time

def probar_reboot_onu():
    # Crear una instancia de EdgeMaxAPI
    api = EdgeMaxAPI(host="10.10.110.213", username="maxi", password="maxi2021$")
    
    # Iniciar sesión
    if api.login():
        print("Inicio de sesión exitoso para reboot_onu")
        
        # Número de serie de la ONU a reiniciar
        onu_serial = "UBNTf9104d10"
        
        try:
            # Intentar reiniciar la ONU usando el método de EdgeMaxAPI 30 veces
            for intento in range(20):
                resultado = api.reboot_onu(onu_serial)
                time.sleep(0.5)
                
                # if resultado:
                #     print(f"Intento {intento + 1}: Reinicio de ONU {onu_serial} exitoso")
                #     print(f"Respuesta del servidor: {resultado}")
                    
                #     # Agregar alarmas basadas en la respuesta de la ONU
                #     if "error" in str(resultado).lower():
                #         print(f"ALARMA: Se detectó un error en la respuesta de la ONU {onu_serial}")
                #     if "timeout" in str(resultado).lower():
                #         print(f"ALARMA: Se detectó un timeout en la respuesta de la ONU {onu_serial}")
                #     if "offline" in str(resultado).lower():
                #         print(f"ALARMA: La ONU {onu_serial} parece estar offline")
                    
                #     # Agregar más condiciones de alarma según sea necesario
                    
                #     break  # Salir del bucle si el reinicio fue exitoso
                # else:
                #     print(f"Intento {intento + 1}: Error al reiniciar la ONU {onu_serial}")
            
            # if not resultado:
            #     print(f"ALARMA: No se pudo reiniciar la ONU {onu_serial} después de 30 intentos")
        except Exception as e:
            print(f"Error al reiniciar la ONU: {e}")
            print(f"ALARMA: Excepción al intentar reiniciar la ONU {onu_serial}")
    else:
        print("Error al iniciar sesión para reboot_onu")
        print("ALARMA: No se pudo iniciar sesión para reiniciar la ONU")




# Llamar a la función de prueba para reboot_onu
#probar_reboot_onu()
def setear_onu():
    api = EdgeMaxAPI(host="10.10.110.214", username="maxi", password="maxi2021$")
    
    # Número de serie de la ONU
    onu_serial = "UBNTb999fa46"
    
    # Payload con la configuración completa de la ONU
    payload = {
        "SET": {
            "onu-list": {
                onu_serial: {
                    "disable": "false",
                    "profile": "default",  # Perfil usado
                    "name": "PRUEBAS-ADAM6060",  # Nombre de la ONU
                    "wifi": {  # Configuración WiFi
                        "provisioned": False,
                        "enabled": True,
                        "ssid": "UBNT-ONU",
                        "hide-ssid": False,
                        "auth-mode": "wpa2psk",
                        "wpapsk": "",  # Contraseña WPA (vacía en este caso)
                        "channel": "auto",
                        "channel-width": "20/40",
                        "tx-power": "100"  # Potencia de transmisión
                    },
                    "pppoe-mode": "auto",  # Modo PPPoE
                    "pppoe-user": "",  # Usuario PPPoE
                    "pppoe-password": "",  # Contraseña PPPoE
                    "wan-address": "",  # Dirección WAN (vacía)
                    "port-forwards": []  # No hay redirecciones de puertos
                }
            }
        }
    }

    # Iniciar sesión
    if api.login():
        # Setear la ONU con el número de serie y el payload definido
        api.set_onu(onu_serial)
    else:
        print("Error al iniciar sesión en el dispositivo.")

# Llamada a la función para setear la ONU
setear_onu()
