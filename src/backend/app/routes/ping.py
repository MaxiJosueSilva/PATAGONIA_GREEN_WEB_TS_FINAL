# app/routes/ping.py
from flask import Blueprint, jsonify, request, current_app
from app.utils.shared_config import shared_config
from werkzeug.utils import secure_filename
import datetime
import os

ping_bp = Blueprint('ping', __name__)


@ping_bp.route('/camaras', methods=['GET'])
def ping_camaras_route():
    return jsonify(shared_config.get_ping_camaras())

@ping_bp.route('/comisarias', methods=['GET'])
def ping_comisarias_route():
    return jsonify(shared_config.get_ping_comisarias())

@ping_bp.route('/predios', methods=['GET'])
def ping_predios_route():
    return jsonify(shared_config.get_ping_predios())

@ping_bp.route('/clientes', methods=['GET'])
def ping_clientes_route():
    return jsonify(shared_config.get_ping_clientes())

@ping_bp.route('/alarmas', methods=['GET'])
def ping_alarmas_route():
    return jsonify(shared_config.get_alarmas())

