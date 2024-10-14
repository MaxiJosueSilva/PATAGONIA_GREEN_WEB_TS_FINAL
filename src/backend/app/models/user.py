from ..extensions import db
from sqlalchemy.dialects.mysql import VARCHAR, CHAR

class User(db.Model):
    id = db.Column(db.SmallInteger, primary_key=True, autoincrement=True, nullable=False)
    username = db.Column(VARCHAR(20, collation='utf8mb3_unicode_ci'), unique=True, nullable=False)
    password = db.Column(CHAR(255, collation='utf8mb3_general_ci'), nullable=True)
    fullname = db.Column(VARCHAR(60, collation='utf8mb3_unicode_ci'), nullable=True)
    level = db.Column(db.SmallInteger, nullable=True)
    role = db.Column(VARCHAR(40, collation='utf8mb3_unicode_ci'), nullable=True)

    def __repr__(self):
        return '<User %r>' % self.username

