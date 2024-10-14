from app.extensions import db

class Cliente(db.Model):
    __tablename__ = 'cliente'

    idCliente = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, nullable=True)
    descripcion = db.Column(db.Text, nullable=True)
    TIPO = db.Column(db.Text, nullable=True)
    activo = db.Column(db.Text, nullable=True)
    capa = db.Column(db.Text, nullable=True)
    layer = db.Column(db.Text, nullable=True)
    icon = db.Column(db.Text, nullable=True)
    iconColor = db.Column(db.Text, nullable=True)
    lat = db.Column(db.Float, nullable=True)
    lon = db.Column(db.Float, nullable=True)
    onu = db.Column(db.Text, nullable=True)
    ip = db.Column(db.Text, nullable=True)
    port = db.Column(db.Text, nullable=True)


    def __repr__(self):
        return f'<Cliente {self.ip}>'