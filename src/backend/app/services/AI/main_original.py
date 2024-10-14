import os
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import Tool
from langchain_community.utilities import SerpAPIWrapper

# Configurar el agente de Groq
os.environ["GROQ_API_KEY"] = "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"
os.environ["SERPAPI_API_KEY"] = "64ed17b0265316c086abfa5833f954ba5bf4fa96"

# Inicializar el modelo de lenguaje de Groq
llm = ChatGroq(model_name="mixtral-8x7b-32768", temperature=0)

# Crear herramientas para el agente
search = SerpAPIWrapper()
tools = [
    Tool(
        name="Búsqueda en Internet",
        func=search.run,
        description="Útil para cuando necesitas buscar información actualizada en internet."
    )
]

# Crear un PromptTemplate con las variables necesarias
prompt_template = PromptTemplate(
    input_variables=["tools", "tool_names", "agent_scratchpad"],
    template=(
        "Eres un asistente útil que responde preguntas basándote en la información más reciente disponible. "
        "Tienes acceso a las siguientes herramientas:\n\n"
        "{tools}\n\n"
        "Usa el siguiente formato:\n\n"
        "Pregunta: la pregunta de entrada que debes responder\n"
        "Pensamiento: siempre debes pensar sobre qué hacer\n"
        "Acción: la acción a tomar, debe ser una de [{tool_names}]\n"
        "Entrada de acción: la entrada a la acción\n"
        "Observación: el resultado de la acción\n"
        "... (este Pensamiento/Acción/Entrada de acción/Observación puede repetirse N veces)\n"
        "Pensamiento: Ahora conozco la respuesta final\n"
        "Respuesta final: la respuesta final a la pregunta de entrada\n\n"
        "Comienza!\n\n"
        "Pregunta: {input}\n"
        "Pensamiento: {agent_scratchpad}"
    )
)

# Inicializar el agente con el prompt correcto
agent = create_react_agent(
    llm=llm,
    tools=tools,
    prompt=prompt_template
)

# Crear el ejecutor del agente y pasar verbose aquí
agent_executor = AgentExecutor.from_agent_and_tools(agent=agent, tools=tools, verbose=True)

def procesar_consulta_ai(consulta):
    """
    Procesa una consulta utilizando el agente de IA.
    
    :param consulta: str, la consulta del usuario
    :return: str, la respuesta del agente
    """
    try:
        # Cambia run por invoke
        respuesta = agent_executor.invoke({"input": consulta})
        return respuesta
    except Exception as e:
        return f"Error al procesar la consulta: {str(e)}"

# Ejemplo de uso
if __name__ == "__main__":
    consulta_ejemplo = "¿Cuál es la población actual de Argentina?"
    resultado = procesar_consulta_ai(consulta_ejemplo)
    print(f"Respuesta: {resultado}")
