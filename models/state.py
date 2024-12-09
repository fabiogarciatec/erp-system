from .base import BaseModel, db

class State(BaseModel):
    __tablename__ = 'states'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    uf = db.Column(db.String(2), nullable=False, unique=True)
