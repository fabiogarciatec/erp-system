from uuid import uuid4
from .base import BaseModel, db

class Customer(BaseModel):
    __tablename__ = 'customers'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    company_id = db.Column(db.String(36), db.ForeignKey('companies.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(255))
    city = db.Column(db.String(100))
    state = db.Column(db.String(2))
