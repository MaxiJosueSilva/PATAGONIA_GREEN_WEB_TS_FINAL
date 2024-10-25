from flask import Flask
from .extensions import db, migrate
from .routes.main import main_bp
from .routes.ping import ping_bp
from .routes.user import user_bp
from .routes.formulario import form_bp
from .routes.camara import cam_bp
from .routes.olt import olt_bp
from .routes.neo4j import neo4j_bp
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect
import os
from app.services.telegram.telegram_bot import init_telegram_bot
def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    app.config.from_pyfile('../instance/config.py')
    
    init_telegram_bot()

    # Configuración para la carga de archivos
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads') 
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limitar tamaño a 16 MB
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Inicialización de extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)  # Habilita CORS para toda la aplicación
    # Configuración de CSRF
    #csrf = CSRFProtect(app)

    # Registro de blueprints
    app.register_blueprint(main_bp, url_prefix='/')
    app.register_blueprint(ping_bp, url_prefix='/ping')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(form_bp, url_prefix='/formulario')
    app.register_blueprint(cam_bp, url_prefix='/camara')
    app.register_blueprint(olt_bp, url_prefix='/olt')
    app.register_blueprint(neo4j_bp, url_prefix='/neo4j')


    # Inicialización de SocketIO si es necesario
    # socketio = SocketIO(app)

    return app