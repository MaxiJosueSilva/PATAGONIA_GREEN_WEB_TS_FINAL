from py2neo import Graph, Node, Relationship
from geopy.distance import geodesic
import math

class SingletonGraph:
    """
    Clase Singleton para la conexión a la base de datos Neo4j.
    """
    _instance = None

    def __init__(self, uri, username, password):
        if not SingletonGraph._instance:
            SingletonGraph._instance = Graph(uri, auth=(username, password))

    @property
    def instance(self):
        return SingletonGraph._instance

def get_distance(point1, point2):
    """
    Calcula la distancia entre dos puntos geográficos utilizando geopy.
    Devuelve la distancia en metros.
    """
    return geodesic((point1['lat'], point1['lon']), (point2['lat'], point2['lon'])).meters

def get_nodes(graph, label=None):
    """
    Obtener nodos de la base de datos Neo4j, opcionalmente filtrados por etiqueta.
    """
    if label:
        query = f"MATCH (n:{label}) RETURN n"
    else:
        query = "MATCH (n) RETURN n"
    result = graph.run(query)
    return [record['n'] for record in result]

def create_or_update_relation(node1, node2, rel_type, graph):
    """
    Crea o actualiza una relación entre dos nodos en la base de datos Neo4j.
    """
    distance = get_distance(node1, node2)
    rel_name = rel_type
    pattern = (node1, node2)
    existing_rels = graph.match(pattern, r_type=rel_name)
    
    if not existing_rels:
        rel = Relationship(node1, rel_name, node2, distance=round(distance, 2), capa="FUSION")
        print(f"Relación creada entre {node1['name']} y {node2['name']} ({rel_name})")
        graph.create(rel)
    else:
        print(f"Ya existe una relación entre {node1['name']} y {node2['name']} ({rel_name}). Actualizando...")
        for rel in existing_rels:
            rel['distance'] = round(distance, 2)
            graph.push(rel)

def process_geo_data(graph, diametro):
    """
    Procesar datos geográficos y crear relaciones.
    """
    points = get_nodes(graph, label='POINT')
    fibers = get_nodes(graph, label='FIBRA')

    data_center = next((node for node in points if 'DATA_CENTER' in node['name']), None)

    if not data_center:
        print("No se encontró el nodo DATA_CENTER.")
        return

    for point in points:
        for fiber in fibers:
            if point != fiber:
                distance = get_distance(point, fiber)
                if distance <= diametro:
                    create_or_update_relation(point, fiber, 'FIBRA', graph)

    print("Proceso de creación de relaciones terminado.")

def get_unrelated_nodes(graph):
    """
    Obtener nodos que no tienen ninguna relación.
    """
    query = """
    MATCH (n)
    WHERE NOT (n)--()
    RETURN n
    """
    result = graph.run(query)
    return [record['n'] for record in result]

if __name__ == "__main__":
    uri = "bolt://172.40.20.114:7687"
    username = "neo4j"
    password = "911-System"
    graph = SingletonGraph(uri, username, password).instance
    diametro = 10
    process_geo_data(graph, diametro)
    
    unrelated_nodes = get_unrelated_nodes(graph)
    if unrelated_nodes:
        print("Nodos sin relaciones:")
        for node in unrelated_nodes:
            print(node)
    else:
        print("Todos los nodos tienen al menos una relación.")
