from app import db
from datetime import datetime

class ReinicioONU(db.Model):
    __tablename__ = 'reinicios_onu'
    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    usuario = db.Column(db.String(100), nullable=False)
    numero_onu = db.Column(db.String(100), nullable=False)

    def __init__(self, usuario, numero_onu):
        self.usuario = usuario
        self.numero_onu = numero_onu

def register_reinicio_orm(user, onu_serial):
    print(f"Reinicio realizado por {user}")
    new_reinicio = ReinicioONU(usuario=user, numero_onu=onu_serial)
    db.session.add(new_reinicio)
    db.session.commit()