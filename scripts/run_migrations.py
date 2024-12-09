import sys
import os

# Adiciona o diretório raiz ao PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from flask import Flask
from database.connection import init_db, db, migrate
from models import User, Role, Company

# Configurações do banco de dados
os.environ['MYSQL_HOST'] = '207.180.249.172'
os.environ['MYSQL_USER'] = 'root'
os.environ['MYSQL_PASSWORD'] = 'Fatec555133'
os.environ['MYSQL_DATABASE'] = 'erp_fatec'
os.environ['MYSQL_PORT'] = '3306'

app = Flask(__name__)
init_db(app)

with app.app_context():
    # Cria todas as tabelas
    db.create_all()
    
    # Cria role admin se não existir
    admin_role = Role.query.filter_by(name='admin').first()
    if not admin_role:
        admin_role = Role(
            name='admin',
            description='Administrador do sistema'
        )
        db.session.add(admin_role)
        db.session.commit()
        print("Role admin criada com sucesso!")
    
    # Cria empresa padrão se não existir
    default_company = Company.query.filter_by(document='00000000000').first()
    if not default_company:
        default_company = Company(
            name='Empresa Padrão',
            document='00000000000',
            email='admin@sistema.com'
        )
        db.session.add(default_company)
        db.session.commit()
        print("Empresa padrão criada com sucesso!")
    
    # Cria usuário admin se não existir
    admin_user = User.query.filter_by(email='admin@sistema.com').first()
    if not admin_user:
        admin_user = User(
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
