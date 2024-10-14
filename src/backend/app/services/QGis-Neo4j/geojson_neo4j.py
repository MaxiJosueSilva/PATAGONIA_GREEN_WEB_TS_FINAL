

from py2neo import Graph, Node, Relationship
from geopy.distance import geodesic
import json
import os

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

class GeoJSONProcessor:
    def __init__(self, graph, folder_path):
        self.graph = graph
        self.folder_path = folder_path

    def process_geojson_file(self, file_name):
        # Extraer el nombre deseado del archivo
        base_name = os.path.basename(file_name)
        name_without_extension = os.path.splitext(file_name)[0]
        folder_name, name = os.path.split(name_without_extension)

        with open(file_name, 'r') as f:
            data = json.load(f)
            dato = data[0]

        for i in range(len(dato['features'])):
            feature = dato['features'][i]
            properties = feature['properties']
            geometry = feature['geometry']
            if geometry['type'] == 'Point':
                self.process_point(geometry, properties, name)
            elif geometry['type'] == 'LineString':
                self.process_line_string(geometry, properties, name)

    def process_point(self, geometry, properties, name):
        lon, lat, alt = geometry['coordinates']
        existing_node = self.graph.nodes.match('POINT', lon=lon, lat=lat).first()
        if not existing_node:
            node = Node('POINT', lon=lon, lat=lat, name=properties['name'], capa=name)
            print(f"Nodo creado {node['name']}.")
            self.graph.create(node)

    def process_line_string(self, geometry, properties, name):
        coords = geometry['coordinates']
        nodes = []
        for i, coord in enumerate(coords):
            lon, lat, alt = coord
            existing_node = self.graph.nodes.match('FIBRA', lon=lon, lat=lat).first()
            if not existing_node:
                node = Node('FIBRA', lon=lon, lat=lat, name=properties['name'], capa=name)
                self.graph.create(node)
            else:
                node = existing_node
            nodes.append(node)
            if i > 0:
                prev_node = nodes[i-1]
                distance = geodesic((prev_node['lat'], prev_node['lon']), (lat, lon)).meters
                rel_name = 'FIBRA'
                pattern = (prev_node, node)
                existing_rel = self.graph.match(pattern, r_type=rel_name)
                if not existing_rel:
                    rel = Relationship(prev_node, rel_name, node, distance=round(distance, 2), capa=name)
                    print(f"Relación creada entre {prev_node['name']} y {node['name']}.")
                    self.graph.create(rel)

    def process_folder(self):
        for file_name in os.listdir(self.folder_path):
            if file_name.endswith('.geojson'):
                full_path = os.path.join(self.folder_path, file_name)
                self.process_geojson_file(full_path)


if __name__ == "__main__":
    # Uso de la clase
    uri = "bolt://172.40.20.114:7687"
    username = "neo4j"
    password = "911-System"
    graph = SingletonGraph(uri, username, password).instance
    folder_path = r"C:\Users\maxim\OneDrive\Documentos\GitHub\PATAGONIA_GREEN_WEB\patagonia_web\backend-flask\app\services\QGis-Neo4j\GEOJSON"

    processor = GeoJSONProcessor(graph, folder_path)
    processor.process_folder()