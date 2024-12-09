from .base import BaseModel, db

class PermissionModule(BaseModel):
    __tablename__ = 'permission_modules'
    
    name = db.Column(db.String(50), primary_key=True)
    description = db.Column(db.String(255))

class Role(BaseModel):
    __tablename__ = 'roles'
    
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255))
    company_id = db.Column(db.String(36), db.ForeignKey('companies.id'))
    
    # Relacionamentos
    company = db.relationship('Company', backref='roles')
    permissions = db.relationship('RolePermission', backref='role', lazy='dynamic')

class RolePermission(BaseModel):
    __tablename__ = 'role_permissions'
    
    role_id = db.Column(db.String(36), db.ForeignKey('roles.id'), primary_key=True)
    module_name = db.Column(db.String(50), db.ForeignKey('permission_modules.name'), primary_key=True)
    can_read = db.Column(db.Boolean, default=False)
    can_write = db.Column(db.Boolean, default=False)
    can_delete = db.Column(db.Boolean, default=False)
    
    # Relacionamento
    module = db.relationship('PermissionModule')
