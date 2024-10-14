import os
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import Tool
from sqlalchemy import inspect
from app import db

# Configurar el agente de Groq
os.environ["GROQ_API_KEY"] = "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"
os.environ["SERPAPI_API_KEY"] = "64ed17b0265316c086abfa5833f954ba5bf4fa96"

# Inicializar el modelo de lenguaje de Groq
llm = ChatGroq(model_name="mixtral-8x7b-32768", temperature=0)

# # Configurar el token de Hugging Face
# from huggingface_hub import HfApi, HfFolder
# HfFolder.save_token("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")

# Inicializar el cliente de Hugging Face
# api = HfApi()

# Ahora puedes usar 'api' para interactuar con Hugging Face
# Por ejemplo:
# modelo = api.model_info("nombre_del_modelo")

estructura_modelos = {
    "camaras": {
        "columnas": [
            {"nombre": "idCamara", "tipo": "Integer", "nullable": False},
            {"nombre": "sector", "tipo": "String(10)", "nullable": True},
            {"nombre": "name", "tipo": "String(100)", "nullable": True},
            {"nombre": "tipo", "tipo": "String(30)", "nullable": True},
            {"nombre": "cantidad", "tipo": "Integer", "nullable": True},
            {"nombre": "descripcion", "tipo": "String(200)", "nullable": True},
            {"nombre": "layer", "tipo": "String(20)", "nullable": True},
            {"nombre": "capa", "tipo": "String(20)", "nullable": True},
            {"nombre": "cont", "tipo": "Integer", "nullable": True},
            {"nombre": "activo", "tipo": "String(6)", "nullable": True},
            {"nombre": "alarma", "tipo": "String(10)", "nullable": True},
            {"nombre": "icon", "tipo": "String(20)", "nullable": True},
            {"nombre": "iconColor", "tipo": "String(20)", "nullable": True},
            {"nombre": "angulo", "tipo": "Integer", "nullable": True},
            {"nombre": "lat", "tipo": "Float", "nullable": True},
            {"nombre": "lon", "tipo": "Float", "nullable": True},
            {"nombre": "onu", "tipo": "String(20)", "nullable": True},
            {"nombre": "ups", "tipo": "String(20)", "nullable": True},
            {"nombre": "modelo", "tipo": "String(50)", "nullable": True},
            {"nombre": "numSerie", "tipo": "String(50)", "nullable": True},
            {"nombre": "ip", "tipo": "String(20)", "nullable": True},
            {"nombre": "energia", "tipo": "String(10)", "nullable": True}
        ],
        "relaciones": []  # Si tienes relaciones entre tablas, puedes agregarlas aquí
    }
}

# Función para obtener la estructura de todos los modelos
def obtener_estructura_modelos():
    return estructura_modelos

# Función para buscar en los modelos con base en la consulta
def buscar_en_modelos(consulta, modelo=None, filtro=None):
    resultados = {}
    if modelo:
        clase = db.Model._decl_class_registry.get(modelo)
        if not clase:
            return f"No se encontró el modelo: {modelo}"
        query = clase.query
        if filtro:
            for columna, condicion in filtro.items():
                query = query.filter(getattr(clase, columna) == condicion)  # Aquí se añaden las condiciones
        resultado = query.all()
        if resultado:
            resultados[modelo] = [item.to_dict() if hasattr(item, 'to_dict') else str(item) for item in resultado]
    return resultados

# Crear herramientas para el agente
estructura_modelos = obtener_estructura_modelos()

def describir_estructura():
    return estructura_modelos

tools = [
    Tool(
        name="Buscar en Base de Datos",
        func=buscar_en_modelos,
        description="Útil para buscar información en la base de datos usando SQL dinámico."
    ),
    Tool(
        name="Describir Estructura de Base de Datos",
        func=describir_estructura,
        description="Devuelve la estructura de las tablas y columnas de la base de datos."
    )
]

# Obtener los nombres de las herramientas
tool_names = [tool.name for tool in tools]

# Crear un PromptTemplate con las variables necesarias
prompt_template = PromptTemplate(
    input_variables=["tool_names", "estructura_modelos", "input", "tools", "agent_scratchpad"],
    template=(
        "Eres un asistente inteligente que puede realizar consultas SQL dinámicas y buscar información "
        "en una base de datos con las siguientes tablas y columnas:\n\n"
        "{estructura_modelos}\n\n"
        "Usa el siguiente formato para tus respuestas:\n"
        "Pregunta: la pregunta de entrada que debes responder\n"
        "Pensamiento: siempre debes pensar sobre qué hacer\n"
        "Acción: la acción a tomar, debe ser una de [{tool_names}]\n"
        "Entrada de acción: la entrada a la acción\n"
        "Observación: el resultado de la acción\n"
        "Pensamiento: Ahora conozco la respuesta final\n"
        "Respuesta final: la respuesta final a la pregunta de entrada\n\n"
        "Pregunta: {input}\n"
        "Pensamiento: {agent_scratchpad}\n"
        "Herramientas: {tools}"
    )
)

# Inicializar el agente con el prompt correcto
agent = create_react_agent(
    llm=llm,
    tools=tools,
    prompt=prompt_template
)

# Crear el ejecutor del agente
agent_executor = AgentExecutor.from_agent_and_tools(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True)

def procesar_consulta_ai(consulta, modelo=None, filtro=None):
    try:
        if modelo:
            respuesta = agent_executor.invoke({
                "input": consulta,
                "modelo": modelo,
                "filtro": filtro,
                "tools": tools
            })
        else:
            respuesta = agent_executor.invoke({
                "input": consulta,
                "tools": tools
            })
        return respuesta['output']
    except AttributeError as e:
        return f"Error de atributo: {str(e)}"
    except Exception as e:
        return f"Error inesperado: {str(e)}"

# Ejemplo de uso
if __name__ == "__main__":
    consulta_ejemplo = "¿Cuántas cámaras están activas?"
    filtro_ejemplo = {"activo": "si"}
    resultado = procesar_consulta_ai(consulta_ejemplo, modelo="Camara", filtro=filtro_ejemplo)
    print(f"Respuesta: {resultado}")
