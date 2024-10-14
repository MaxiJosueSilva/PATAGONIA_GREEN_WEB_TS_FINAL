# app/models.py (o donde tengas definidas tus clases de modelos)

from app.extensions import db

class Camara(db.Model):
    __tablename__ = 'camaras'
    
    idCamara = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sector = db.Column(db.String(10))
    name = db.Column(db.String(100))
    tipo = db.Column(db.String(30))
    cantidad = db.Column(db.Integer)
    descripcion = db.Column(db.String(200))
    layer = db.Column(db.String(20))
    capa = db.Column(db.String(20))
    cont = db.Column(db.Integer)
    activo = db.Column(db.String(6))
    alarma = db.Column(db.String(10))
    icon = db.Column(db.String(20))
    iconColor = db.Column(db.String(20))
    angulo = db.Column(db.Integer)
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    onu = db.Column(db.String(20))
    ups = db.Column(db.String(20))
    modelo = db.Column(db.String(50))
    numSerie = db.Column(db.String(50))
    ip = db.Column(db.String(20))
    energia = db.Column(db.String(10))

    def __repr__(self):
        return f'<Camara {self.ip}>'
