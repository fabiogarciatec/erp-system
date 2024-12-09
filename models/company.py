from uuid import uuid4
from database.connection import db

class Company(db.Model):
    __tablename__ = 'companies'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    name = db.Column(db.String(255), nullable=False)
    document = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(255))
    city = db.Column(db.String(100))
    postal_code = db.Column(db.String(10))
    state_id = db.Column(db.Integer)  
    latitude = db.Column(db.Numeric(10, 8))
    longitude = db.Column(db.Numeric(11, 8))
    address_number = db.Column(db.String(10))
    address_complement = db.Column(db.String(100))
    neighborhood = db.Column(db.String(100))
    owner_id = db.Column(db.String(36))
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), 
                          onupdate=db.func.current_timestamp())

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'document': self.document,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'city': self.city,
            'postal_code': self.postal_code,
            'state_id': self.state_id,
            'latitude': float(self.latitude) if self.latitude else None,
            'longitude': float(self.longitude) if self.longitude else None,
            'address_number': self.address_number,
            'address_complement': self.address_complement,
            'neighborhood': self.neighborhood,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
