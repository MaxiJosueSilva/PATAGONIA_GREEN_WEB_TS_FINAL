import os
import json
from py2neo import Graph, Node, Relationship
from geojson_neo4j import GeoJSONProcessor, SingletonGraph  # Asegúrate de que este sea el nombre correcto del módulo

# Configuración de conexión a Neo4j
uri = "bolt://172.40.20.114:7687"
username = "neo4j"
password = "911-System"
graph = SingletonGraph(uri, username, password).instance
folder_path = "GEOJSON"

processor = GeoJSONProcessor(graph, folder_path)
processor.process_folder()