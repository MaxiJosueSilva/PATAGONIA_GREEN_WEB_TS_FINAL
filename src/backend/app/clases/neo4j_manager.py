from neo4j import GraphDatabase
from typing import List, Dict, Any, Optional
import uuid

class Neo4jManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Neo4jManager, cls).__new__(cls)
            cls._instance.initialize()
        return cls._instance

    def initialize(self):
        self.uri = "bolt://172.40.20.114:7687"
        self.username = "neo4j"
        self.password = "911-System"
        self.driver = None

    def connect(self):
        if not self.driver:
            self.driver = GraphDatabase.driver(self.uri, auth=(self.username, self.password))
    
    def close(self):
        if self.driver:
            self.driver.close()
    
    def run_query(self, query, parameters=None):
        self.connect()
        with self.driver.session() as session:
            result = session.run(query, parameters)
            return [{'start': record['start'], 'end': record['end'], 'type': record['type'], 'properties': record['properties']} for record in result]

    def execute_query(self, query: str, parameters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Ejecuta una consulta Cypher y devuelve los resultados.
        
        :param query: La consulta Cypher a ejecutar.
        :param parameters: Parámetros opcionales para la consulta.
        :return: Una lista de diccionarios con los resultados de la consulta.
        """
        self.connect()
        with self.driver.session() as session:
            result = session.run(query, parameters or {})
            return [dict(record) for record in result]

    def create_node(self, label: str, properties: Dict[str, Any]) -> str:
        """
        Crea un nuevo nodo con la etiqueta y propiedades especificadas.
        
        :param label: Etiqueta para el nuevo nodo.
        :param properties: Diccionario de propiedades para el nuevo nodo.
        :return: El UUID del nodo creado.
        """
        if 'uuid' not in properties:
            properties['uuid'] = str(uuid.uuid4())
        query = f"CREATE (n:{label} {{"
        query += ", ".join([f"{key}: ${key}" for key in properties.keys()])
        query += "}) RETURN n.uuid as uuid"
        result = self.execute_query(query, properties)
        return result[0]['uuid']

    def create_relationship(self, start_node_uuid: str, end_node_uuid: str, rel_type: str, properties: Dict[str, Any] = None) -> bool:
        """
        Crea una relación entre dos nodos existentes.
        
        :param start_node_uuid: UUID del nodo de inicio.
        :param end_node_uuid: UUID del nodo de fin.
        :param rel_type: Tipo de relación.
        :param properties: Propiedades opcionales de la relación.
        :return: True si la relación se creó con éxito, False en caso contrario.
        """
        query = f"""
        MATCH (a {{uuid: $start_uuid}}), (b {{uuid: $end_uuid}})
        CREATE (a)-[r:{rel_type} $props]->(b)
        RETURN r
        """
        params = {
            "start_uuid": start_node_uuid,
            "end_uuid": end_node_uuid,
            "props": properties or {}
        }
        result = self.execute_query(query, params)
        return len(result) > 0

    def find_node_by_uuid(self, node_uuid: str) -> Optional[Dict[str, Any]]:
        """
        Busca un nodo por su UUID.
        
        :param node_uuid: El UUID del nodo a buscar.
        :return: Un diccionario con las propiedades del nodo, o None si no se encuentra.
        """
        query = "MATCH (n {uuid: $node_uuid}) RETURN n"
        result = self.execute_query(query, {"node_uuid": node_uuid})
        return result[0]['n'] if result else None

    def find_nodes_by_label(self, label: str) -> List[Dict[str, Any]]:
        """
        Busca todos los nodos con una etiqueta específica.
        
        :param label: La etiqueta de los nodos a buscar.
        :return: Una lista de diccionarios con las propiedades de los nodos encontrados.
        """
        query = f"MATCH (n:{label}) RETURN n"
        result = self.execute_query(query)
        return [record['n'] for record in result]

    def update_node(self, node_uuid: str, properties: Dict[str, Any]) -> bool:
        """
        Actualiza las propiedades de un nodo existente.
        
        :param node_uuid: El UUID del nodo a actualizar.
        :param properties: Un diccionario con las nuevas propiedades.
        :return: True si la actualización fue exitosa, False en caso contrario.
        """
        query = "MATCH (n {uuid: $node_uuid}) SET "
        query += ", ".join([f"n.{key} = ${key}" for key in properties.keys()])
        query += " RETURN n"
        result = self.execute_query(query, {"node_uuid": node_uuid, **properties})
        return len(result) > 0

    def delete_node(self, node_uuid: str) -> bool:
        """
        Elimina un nodo y todas sus relaciones.
        
        :param node_uuid: El UUID del nodo a eliminar.
        :return: True si el nodo fue eliminado, False en caso contrario.
        """
        query = "MATCH (n {uuid: $node_uuid}) DETACH DELETE n"
        result = self.execute_query(query, {"node_uuid": node_uuid})
        return result is not None

    def delete_relationship(self, relationship_id: int) -> bool:
        """
        Elimina una relación específica.
        
        :param relationship_id: El ID de la relación a eliminar.
        :return: True si la relación fue eliminada, False en caso contrario.
        """
        query = "MATCH ()-[r]->() WHERE id(r) = $relationship_id DELETE r"
        result = self.execute_query(query, {"relationship_id": relationship_id})
        return result is not None

    def get_relationships(self, node_uuid: str) -> List[Dict[str, Any]]:
        """
        Recupera todas las relaciones de un nodo.
        
        :param node_uuid: El UUID del nodo del que se quieren recuperar las relaciones.
        :return: Una lista de diccionarios con las relaciones y sus propiedades.
        """
        query = """
        MATCH (n {uuid: $node_uuid})-[r]-(m)
        RETURN type(r) as type, properties(r) as properties, m.uuid as connected_node_uuid, labels(m) as connected_node_labels
        """
        return self.execute_query(query, {"node_uuid": node_uuid})

    def get_all_nodes(self) -> List[Dict[str, Any]]:
        """
        Recupera todos los nodos en la base de datos.
        
        :return: Una lista de diccionarios con las propiedades de todos los nodos encontrados.
        """
        query = "MATCH (n) RETURN n"
        result = self.execute_query(query)
        return [record['n'] for record in result]

    def get_all_relationships(self) -> List[Dict[str, Any]]:
        """
        Recupera todas las relaciones en la base de datos.
        
        :return: Una lista de diccionarios con las relaciones y sus propiedades.
        """
        query = """
        MATCH ()-[r]->()
        RETURN id(r) as id, type(r) as type, properties(r) as properties, startNode(r) as start_node, endNode(r) as end_node
        """
        result = self.execute_query(query)
        return [{
            'id': record['id'],
            'type': record['type'],
            'properties': record['properties'],
            'start_node': record['start_node'],
            'end_node': record['end_node']
        } for record in result]

    def get_nodes_for_d3(self) -> List[Dict[str, Any]]:
        """
        Recupera todos los nodos en la base de datos y los convierte al formato D3.js.

        :return: Una lista de diccionarios con los nodos en el formato {'id': 'node_uuid', 'group': group_number, 'name': 'node_name'}.
        """
        all_nodes = self.get_all_nodes()
        nodes_for_d3 = []
        for node in all_nodes:
            # Asignar un grupo basado en un criterio, por ejemplo, el índice en la lista
            # Aquí puedes personalizar la lógica para asignar los grupos según tus necesidades
            group = 1  # Asigna un grupo estático o puedes agregar lógica para diferentes grupos
            nodes_for_d3.append({
                'id': node.get('name', 'Unnamed'),  # Extraer el UUID del nodo
                'group': group,
            })
        return nodes_for_d3

    def get_edges_for_d3(self) -> List[Dict[str, Any]]:
        """
        Recupera todas las relaciones en la base de datos y las convierte al formato D3.js.

        :return: Una lista de diccionarios con las relaciones en el formato {'source': 'start_node_uuid', 'target': 'end_node_uuid', 'source_name': 'start_node_name', 'target_name': 'end_node_name', 'value': relationship_count}.
        """
        query = '''
        MATCH (start)-[r]->(end)
        RETURN start, end, type(r) as type, properties(r) as properties
        '''
        all_relationships = self.run_query(query)
        edges_for_d3 = []
        for relationship in all_relationships:
            start_node = relationship['start']
            end_node = relationship['end']
            edges_for_d3.append({
                'source': start_node.get('name', 'Unnamed'),  # Extraer el nombre del nodo de inicio
                'target': end_node.get('name', 'Unnamed'),    # Extraer el nombre del nodo de fin
                'value': 1  # Puedes ajustar este valor basado en las propiedades de la relación
            })
        return edges_for_d3

# Ejemplo de uso
if __name__ == "__main__":
    neo4j_manager = Neo4jManager()
    
    try:
        # Crear un nodo
        #person_uuid = neo4j_manager.create_node('Person', {'name': 'Alice', 'age': 30})
        #print(f"Nodo creado con UUID: {person_uuid}")
        
        # Buscar el nodo creado
        #node = neo4j_manager.find_node_by_uuid(person_uuid)
        #print(f"Nodo encontrado: {node}")
        
        # Actualizar el nodo
        #neo4j_manager.update_node(person_uuid, {'age': 31})
        
        # Crear otro nodo y una relación
        #friend_uuid = neo4j_manager.create_node('Person', {'name': 'Bob', 'age': 32})
        #neo4j_manager.create_relationship(person_uuid, friend_uuid, 'KNOWS', {'since': 2020})
        
        # Obtener relaciones
        #relationships = neo4j_manager.get_relationships(person_uuid)
        #print(f"Relaciones de Alice: {relationships}")
        
        # Eliminar nodos
        #neo4j_manager.delete_node(person_uuid)
        #neo4j_manager.delete_node(friend_uuid)
        all_nodes = neo4j_manager.get_nodes_for_d3()
        print(f"Todos los nodos: {all_nodes}")
        
        # Recuperar todas las relaciones
        #all_relationships = neo4j_manager.get_edges_for_d3()
        #print(f"Todas las relaciones: {all_relationships}")

    finally:
        neo4j_manager.close()
