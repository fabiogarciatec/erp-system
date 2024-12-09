from flask import Flask
from config.database import init_db, db
from models import User, Role, Company
import uuid
from dotenv import load_dotenv

def create_app():
    app = Flask(__name__)
    init_db(app)
    return app

def create_admin_user():
    # Criar role de admin se não existir
    admin_role = Role.query.filter_by(name='admin').first()
    if not admin_role:
        admin_role = Role(
            id=str(uuid.uuid4()),
            name='admin',
            description='Administrador do sistema'
        )
        db.session.add(admin_role)
        db.session.commit()

    # Criar empresa padrão se não existir
    default_company = Company.query.filter_by(document='00000000000').first()
    if not default_company:
        default_company = Company(
            id=str(uuid.uuid4()),
            name='Empresa Padrão',
            document='00000000000',
            email='admin@sistema.com'
        )
        db.session.add(default_company)
        db.session.commit()

    # Criar usuário admin se não existir
    admin_user = User.query.filter_by(email='admin@sistema.com').first()
    if not admin_user:
        admin_user = User(
            id=str(uuid.uuid4()),
            email='admin@sistema.com',
            name='Administrador',
            company_id=default_company.id,
            role_id=admin_role.id,
            is_active=True
        )
        admin_user.set_password('admin123')
        db.session.add(admin_user)
        db.session.commit()
        print("Usuário admin criado com sucesso!")
    else:
        print("Usuário admin já existe!")

if __name__ == '__main__':
    load_dotenv()
    app = create_app()
    with app.app_context():
        create_admin_user()
