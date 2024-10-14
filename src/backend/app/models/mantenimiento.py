from ..extensions import db

class Mantenimiento(db.Model):
    __tablename__ = 'mantenimiento'

    idmantenimiento = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fecha = db.Column(db.DateTime, nullable=False)
    usuario = db.Column(db.String(60))
    nombre = db.Column(db.String(255), nullable=False)
    tipo_servicio = db.Column(db.String(255))
    idCamara = db.Column(db.Integer)
    sector = db.Column(db.String(20))
    camara = db.Column(db.String(255))
    cinta = db.Column(db.String(255))
    tension = db.Column(db.Integer)
    ups_tiempo = db.Column(db.String(20))
    cooler_1 = db.Column(db.String(20))
    cooler_2 = db.Column(db.String(20))
    filtro = db.Column(db.Boolean)
    dado = db.Column(db.Boolean)
    candado = db.Column(db.Boolean)
    pintura = db.Column(db.Boolean)
    descripcion = db.Column(db.String(255))
    imagen_camara = db.Column(db.String(255))
    imagen_gabinete = db.Column(db.String(255))
    imagen_poste = db.Column(db.String(255))
    imagen_ups = db.Column(db.String(255))
    imagen_filtro = db.Column(db.String(255))

    def __repr__(self):
        return f'<Mantenimiento {self.idmantenimiento}>'
