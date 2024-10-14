from app.extensions import db

class Comisaria(db.Model):
    __tablename__ = 'comisarias'

    idComisaria = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(53), nullable=False)
    tipo = db.Column(db.String(11), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    descripcion = db.Column(db.String(30), nullable=True)
    layer = db.Column(db.String(11), nullable=False)
    cont = db.Column(db.Integer, nullable=False)
    activo = db.Column(db.String(5), nullable=False)
    capa = db.Column(db.String(10), nullable=False)
    icon = db.Column(db.String(7), nullable=False)
    iconColor = db.Column(db.String(4), nullable=False)
    angulo = db.Column(db.String(30), nullable=True)
    lon = db.Column(db.Float, nullable=False)
    lat = db.Column(db.Float, nullable=False)
    ip = db.Column(db.String(11), nullable=False)
    onu = db.Column(db.String(12), nullable=True)
    mac = db.Column(db.String(30), nullable=True)


    def __repr__(self):
        return f'<Comisaria {self.ip}>'