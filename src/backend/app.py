

from app import create_app
from app.services.background_task import start_background_task, inicializar_telegram_bot, start_relacion_task, start_onus_task, start_union_onus, start_ping_camaras_task, start_ping_comisarias_task, start_ping_predios_task, start_ping_clientes_task

from app.services.telegram.telegram_bot import  get_telegram_bot
#from app.services.AI.main import procesar_consulta_ai

# def ejecutar_consulta_ai():
#     consulta_ejemplo = "¿Cuántas cámaras están activas?"
#     filtro_ejemplo = {"activo": "si"}
#     resultado = procesar_consulta_ai(consulta_ejemplo, modelo="Camara", filtro=filtro_ejemplo)

app = create_app()

if __name__ == "__main__":
    # Llamar a la función que inicia el bot de Telegram

    bot = get_telegram_bot()  # Obtén la instancia global del bot
    bot.send_message("¡Bienvenido al bot!")
    start_background_task()
    # Carga de Variabler
    #start_onus_task()
    #start_ping_camaras_task()
    #start_ping_comisarias_task()
    #start_ping_predios_task()
    #start_ping_clientes_task()
    
    #Union y Relacion
    #start_union_onus()
    #start_relacion_task()

    # Iniciar el servicio de alarmas en un nuevo hilo
    #start_analizar_metricas() 
    #ejecutar_consulta_ai()
    # Iniciar el servicio de AI en un nuevo hilo
    
    app.run(host='0.0.0.0', port=3000, debug=True)


    