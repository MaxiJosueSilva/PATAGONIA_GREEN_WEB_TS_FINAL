from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from ..models import User  # Importa tu modelo User
from ..models import ActiveSession
from ..extensions import db

import datetime
import os

user_bp = Blueprint('user', __name__)

@user_bp.route('/usersall', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        users_list = []
        for user in users:
            user_data = {
                'id': user.id,
                'username': user.username,
                'password': user.password,  # Nota: No se recomienda devolver la contraseña
                'fullname': user.fullname,
                'level': user.level,
                'role': user.role
            }
            users_list.append(user_data)
        
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        print (data)
        new_user = User(
            username=data['username'],
            password=data['password'],
            fullname=data['fullname'],
            level=data['level'],
            role=data['role']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.get_json()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user.username = data['username']
        user.password = data['password']
        user.fullname = data['fullname']
        user.level = data['level']
        user.role = data['role']
        db.session.commit()
        return jsonify({'message': 'User updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/active_sessions', methods=['GET'])
def get_active_sessions():
    try:
        active_sessions = ActiveSession.query.all()
        sessions_list = []
        for session in active_sessions:
            session_data = {
                'id': session.id,
                'user_id': session.user_id,
                'token': session.token,
                'expires_at': session.expires_at.strftime('%Y-%m-%d %H:%M:%S'),
                'created_at': session.created_at.strftime('%Y-%m-%d %H:%M:%S') if session.created_at else None
            }
            sessions_list.append(session_data)
        
        return jsonify(sessions_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/active_sessions', methods=['POST'])
def create_session():
    try:
        data = request.get_json()
        new_session = ActiveSession(
            user_id=data['user_id'],
            token=data['token'],
            expires_at=datetime.datetime.strptime(data['expires_at'], '%Y-%m-%d %H:%M:%S')
        )
        db.session.add(new_session)
        db.session.commit()
        return jsonify({'message': 'Session created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/active_sessions/<string:token>', methods=['DELETE'])
def delete_session(token):
    try:
        session = ActiveSession.query.filter_by(token=token).first()
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        
        db.session.delete(session)
        db.session.commit()
        return jsonify({'message': 'Session deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para registrar inicios de sesión
@user_bp.route('/login_logs', methods=['POST'])
def log_login():
    try:
        data = request.get_json()
        # Aquí debes implementar la lógica para registrar el inicio de sesión
        return jsonify({'message': 'Login log created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
