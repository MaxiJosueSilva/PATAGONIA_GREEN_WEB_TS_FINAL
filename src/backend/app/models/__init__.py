from flask_sqlalchemy import SQLAlchemy
from .camara import Camara
from .comisaria import Comisaria
from .cliente import Cliente
from .predio import Predio
from .user import User
from .active_session import ActiveSession
from .mantenimiento import Mantenimiento

db = SQLAlchemy()
