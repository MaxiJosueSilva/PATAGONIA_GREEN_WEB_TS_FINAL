from ..extensions import db
from sqlalchemy.dialects.mysql import INTEGER, VARCHAR, DATETIME, TIMESTAMP

class ActiveSession(db.Model):
    __tablename__ = 'active_sessions'

    id = db.Column(INTEGER, primary_key=True, autoincrement=True, nullable=False)
    user_id = db.Column(INTEGER, nullable=False)
    token = db.Column(VARCHAR(255), unique=True, nullable=False)
    expires_at = db.Column(DATETIME, nullable=False)
    created_at = db.Column(TIMESTAMP, server_default=db.func.current_timestamp(), nullable=True)

    def __repr__(self):
        return f'<ActiveSession {self.id}>'
