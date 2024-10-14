
from flask import Blueprint, jsonify, request, current_app
from app.utils.shared_config import shared_config
from werkzeug.utils import secure_filename
import datetime
import os

neo4j_bp = Blueprint('neo4j', __name__)

from flask import jsonify, request
from app.services.neo4j.main import SingletonGraph

@neo4j_bp.route('/Nodes3D', methods=['GET'])
def get_all_nodes_3d():
    try:
        nodos = shared_config.get_data_3d()
        print (nodos)
        return jsonify(nodos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@neo4j_bp.route('/Nodessall', methods=['GET'])
def get_all_nodes():
    try:
        # grafo = SingletonGraph().instance
        # query = "MATCH (n) RETURN n"
        # resultado = grafo.run(query).data()
        # nodos = [dict(nodo['n']) for nodo in resultado]
        nodos = shared_config.get_relaciones_onus()
        return jsonify(nodos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@neo4j_bp.route('/create-node', methods=['POST'])
def create_node():
    try:
        datos = request.json
        grafo = SingletonGraph().instance
        query = "CREATE (n:Nodo $props) RETURN n"
        resultado = grafo.run(query, props=datos).data()
        return jsonify(dict(resultado[0]['n'])), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@neo4j_bp.route('/select-node', methods=['POST'])
def select_node():
    try:
        node_id = request.json.get('nodeId')
        grafo = SingletonGraph().instance
        query = "MATCH (n) WHERE ID(n) = $node_id RETURN n"
        resultado = grafo.run(query, node_id=int(node_id)).data()
        if resultado:
            return jsonify(dict(resultado[0]['n'])), 200
        else:
            return jsonify({"error": "Nodo no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@neo4j_bp.route('/save-relationship', methods=['POST'])
def save_relationship():
    try:
        datos = request.json
        grafo = SingletonGraph().instance
        query = """
        MATCH (a), (b)
        WHERE ID(a) = $node1_id AND ID(b) = $node2_id
        CREATE (a)-[r:RELACIONADO]->(b)
        RETURN r
        """
        resultado = grafo.run(query, node1_id=int(datos['node1Id']), node2_id=int(datos['node2Id'])).data()
        return jsonify({"message": "Relación creada exitosamente"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@neo4j_bp.route('/delete-node', methods=['POST'])
def delete_node():
    try:
        node_id = request.json.get('nodeId')
        grafo = SingletonGraph().instance
        query = "MATCH (n) WHERE ID(n) = $node_id DETACH DELETE n"
        grafo.run(query, node_id=int(node_id))
        return jsonify({"message": "Nodo eliminado exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@neo4j_bp.route('/delete-line', methods=['POST'])
def delete_line():
    try:
        relationship_id = request.json.get('relationshipId')
        grafo = SingletonGraph().instance
        query = "MATCH ()-[r]->() WHERE ID(r) = $relationship_id DELETE r"
        grafo.run(query, relationship_id=int(relationship_id))
        return jsonify({"message": "Relación eliminada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
