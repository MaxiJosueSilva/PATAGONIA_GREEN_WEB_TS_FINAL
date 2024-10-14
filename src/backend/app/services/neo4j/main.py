from py2neo import Graph, Node, Relationship
from app.utils.shared_config import shared_config
from collections import defaultdict

class SingletonGraph:
    _instance = None

    def __init__(self, uri, username, password):
        if not SingletonGraph._instance:
            try:
                SingletonGraph._instance = Graph(uri, auth=(username, password))
            except Exception as e:
                print(f"Error al conectar a Neo4j: {e}")
                SingletonGraph._instance = None

    @property
    def instance(self):
        return SingletonGraph._instance

def crear_o_actualizar_relacion(nodo1, nodo2, tipo_relacion, grafo, **propiedades):
    try:
        relacion = Relationship(nodo1, tipo_relacion, nodo2, **propiedades)
        grafo.merge(relacion)
    except Exception as e:
        print(f"Error al crear/actualizar la relación: {e}")

class RelacionesEnMemoria:
    def __init__(self):
        self.relaciones = defaultdict(lambda: defaultdict(dict))
        self.contador = 0

    def agregar_relacion(self, olt_name, olt_port, onu_name, distance, **propiedades):
        self.relaciones[olt_name][olt_port][onu_name] = {"distance": distance, "propiedades": propiedades}
        self.contador += 1

    def obtener_relaciones(self):
        return self.relaciones

    def reiniciar(self):
        self.relaciones.clear()
        self.contador = 0

relaciones_memoria = RelacionesEnMemoria()

def relacionar_datos_onus():
    global relaciones_memoria

    datos_onus = shared_config.get_data_onus()
    if not datos_onus:
        print("Error: No se obtuvieron datos de ONUs")
        return

    for onu in datos_onus.get('onus', []):
        if onu.get('online') != "true":
            continue
        
        olt_name = onu.get('olt')
        olt_port = onu.get('olt_port')
        onu_name = onu.get('name')
        onu_serial = onu.get('serial_number')
        distance = float(onu.get('distance', 0)) / 1000  # Convertir a kilómetros

        if not olt_name or not olt_name.strip():
            print(f"Advertencia: ONU {onu_name} tiene un nombre de OLT no válido o vacío.")
            continue

        onu_copy = onu.copy()
        onu_copy.pop('olt_port', None)
        onu_copy.pop('distance', None)
        
        for key, value in onu_copy.items():
            if isinstance(value, str):
                try:
                    onu_copy[key] = float(value.rstrip('dBm').rstrip('mA'))
                except ValueError:
                    pass
        
        relaciones_memoria.agregar_relacion(olt_name, olt_port, onu_name, distance, **onu_copy)

        # Procesar relaciones con cámaras, comisarías, predios y clientes
        for tipo_elemento in ['camaras', 'comisarias', 'predios', 'clientes']:
            elementos = getattr(shared_config, f'get_ping_{tipo_elemento}')()
            if elementos:
                elementos_relacionados = [elemento for elemento in elementos.get(tipo_elemento, []) if elemento.get('onu') == onu_serial]
                for elemento in elementos_relacionados:
                    relaciones_memoria.agregar_relacion(onu_name, tipo_elemento, elemento.get('name', f'{tipo_elemento.capitalize()} sin nombre'), 0, **elemento)

    relaciones = relaciones_memoria.obtener_relaciones()
    shared_config.update_relaciones_onus(relaciones)
    guardar_datos_json("Relaciones de Onus.json", relaciones, True)

    if relaciones_memoria.contador >= 10:
        guardar_en_neo4j()
        relaciones_memoria.reiniciar()

def guardar_en_neo4j():
    uri = "bolt://172.40.20.114:7687"
    username = "neo4j"
    password = "911-System"
    grafo = SingletonGraph(uri, username, password).instance

    if not grafo:
        print("Error: No se pudo conectar a Neo4j")
        return

    relaciones = relaciones_memoria.obtener_relaciones()
    print("Relaciones a guardar en Neo4j:")

    for olt_name, puertos in relaciones.items():
        if not olt_name or not olt_name.strip():
            print(f"Advertencia: Se encontró un nombre de OLT no válido o vacío: {olt_name}")
            continue

        olt_validos = ["OLT 1", "OLT 2", "OLT 3", "OLT 4"]  # Lista de OLTs válidos
        if olt_name in olt_validos:
            olt_node = Node("OLT", name=olt_name)
            grafo.merge(olt_node, "OLT", "name")

            for olt_port, onus in puertos.items():
                port_node = Node("Puerto", numero=olt_port, olt=olt_name)
                grafo.merge(port_node, "Puerto", ("numero", "olt"))

                crear_o_actualizar_relacion(olt_node, port_node, "TIENE_PUERTO", grafo)

                for onu_name, datos in onus.items():
                    if onu_name in ['camara', 'comisaria', 'predio', 'cliente']:
                        for elemento_name, elemento_datos in datos['propiedades'].items():
                            if 'name' in elemento_datos and isinstance(elemento_datos['name'], str):
                                elemento_node = Node(onu_name.capitalize(), **elemento_datos)
                                grafo.merge(elemento_node, onu_name.capitalize(), "name")
                                onu_node = Node("ONU", name=onu_name)
                                grafo.merge(onu_node, "ONU", "name")
                                crear_o_actualizar_relacion(onu_node, elemento_node, "TRANSMITE_A", grafo)
                    else:
                        propiedades_onu = {}
                        for key, value in datos['propiedades'].items():
                            if isinstance(value, str):
                                try:
                                    propiedades_onu[key] = float(value.rstrip('dBm').rstrip('mA'))
                                except ValueError:
                                    propiedades_onu[key] = value
                            else:
                                propiedades_onu[key] = value
                        
                        for key, value in propiedades_onu.items():
                            if not isinstance(value, (int, float, str, bool)):
                                propiedades_onu[key] = str(value)
                        
                        if 'name' in propiedades_onu and isinstance(propiedades_onu['name'], str) and propiedades_onu['name'] != olt_name:
                            onu_node = Node("ONU", **propiedades_onu)
                            grafo.merge(onu_node, "ONU", "name")
                            distancia_km = round(datos['distance'], 2)
                            crear_o_actualizar_relacion(port_node, onu_node, f"{distancia_km}Km", grafo)

    for tipo_elemento in ['camaras', 'comisarias', 'predios', 'clientes']:
        elementos = getattr(shared_config, f'get_ping_{tipo_elemento}')()
        if elementos and isinstance(elementos, dict) and tipo_elemento in elementos:
            for elemento in elementos[tipo_elemento]:
                if isinstance(elemento, dict) and 'name' in elemento and isinstance(elemento['name'], str):
                    elemento_node = Node(tipo_elemento.capitalize()[:-1], **elemento)
                    grafo.merge(elemento_node, tipo_elemento.capitalize()[:-1], "name")
                    
                    onu_serial = elemento.get('onu')
                    if onu_serial:
                        onu_node = grafo.nodes.match("ONU", serial_number=onu_serial).first()
                        if onu_node:
                            crear_o_actualizar_relacion(onu_node, elemento_node, "CONECTADO_A", grafo)

    print("Relaciones de ONUs, cámaras, comisarías, predios, clientes y puertos guardadas en Neo4j")


relacionar_datos_onus()

# Nota: El problema de agregar OLTs donde no hay podría estar en la función relacionar_datos_onus()
# Específicamente, en la línea donde se obtiene el olt_name:
# olt_name = onu.get('olt')
# Asegúrate de que todos los datos de ONU tengan un campo 'olt' válido.
# También podrías agregar una verificación adicional antes de crear el nodo OLT:
# if olt_name and olt_name.strip():
#     olt_node = Node("OLT", name=olt_name)   
#     grafo.merge(olt_node, "OLT", "name")
# Esto evitaría crear nodos OLT con nombres vacíos o solo espacios.
def guardar_datos_json(nombre_archivo, datos, sobrescribir=False):
    import json
    import os

    # Obtener la ruta del directorio actual
    directorio_actual = os.path.dirname(os.path.abspath(__file__))

    # Ruta completa del archivo
    ruta_archivo = os.path.join(directorio_actual, nombre_archivo)

    # Verificar si el archivo ya existe
    if not os.path.exists(ruta_archivo) or sobrescribir:
        try:
            # Guardar los datos en formato JSON, sobrescribiendo si el archivo ya existe y se permite sobrescribir
            with open(ruta_archivo, 'w', encoding='utf-8') as archivo_json:
                json.dump(datos, archivo_json, ensure_ascii=False, indent=4)
            print(f"Datos guardados en: {ruta_archivo}")
        except Exception as e:
            print(f"Error al guardar los datos en JSON: {e}")
    else:
        print(f"El archivo {nombre_archivo} ya existe y no se sobrescribió.")