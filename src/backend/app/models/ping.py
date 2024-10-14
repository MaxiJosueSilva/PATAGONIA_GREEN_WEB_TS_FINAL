from app import db
from datetime import datetime

class Ping(db.Model):
    __tablename__ = 'ping'

    idping = db.Column(db.Integer, primary_key=True, autoincrement=True)
    idCamara = db.Column(db.Integer)
    idPredio = db.Column(db.Integer)
    idCliente = db.Column(db.Integer)
    idComisaria = db.Column(db.Integer)
    ms = db.Column(db.Float)
    ms_mkt = db.Column(db.Float)
    tiempo = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, idCamara, idPredio, idCliente, idComisaria, ms, ms_mkt, tiempo=None):
        self.idCamara = idCamara
        self.idPredio = idPredio
        self.idCliente = idCliente
        self.idComisaria = idComisaria
        self.ms = ms
        self.ms_mkt = ms_mkt
        self.tiempo = tiempo if tiempo else datetime.utcnow()

    def __repr__(self):
        return f'<Ping {self.idping}>'