from app.extensions import db

class Predio(db.Model):
    __tablename__ = 'predios'

    idPredio = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Integer, nullable=True)
    nombre = db.Column(db.Text, nullable=True)
    capa = db.Column(db.Text, nullable=True)
    ciudad = db.Column(db.Text, nullable=True)
    lat = db.Column(db.Float, nullable=True)
    lon = db.Column(db.Float, nullable=True)
    proveedor = db.Column(db.Text, nullable=True)
    layer = db.Column(db.Text, nullable=True)
    cont = db.Column(db.Integer, nullable=True)
    activo = db.Column(db.Text, nullable=True)
    icon = db.Column(db.Text, nullable=True)
    iconColor = db.Column(db.Text, nullable=True)
    tecnologia = db.Column(db.Text, nullable=True)
    mb = db.Column(db.Integer, nullable=True)
    ip = db.Column(db.Text, nullable=True)
    ip_mkt = db.Column(db.Text, nullable=True)
    onu = db.Column(db.Text, nullable=True)

def __repr__(self):
    return f'<Predio {self.ip}>'
