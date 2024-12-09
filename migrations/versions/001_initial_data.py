"""Initial data

Revision ID: 001
Revises: 
Create Date: 2024-12-09 00:30:00

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime
import uuid
from werkzeug.security import generate_password_hash

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Criar role admin
    op.execute("""
        INSERT INTO roles (id, name, description, created_at, updated_at)
        VALUES (
            '{}',
            'admin',
            'Administrador do sistema',
            NOW(),
            NOW()
        )
    """.format(str(uuid.uuid4())))

    # Criar empresa padrão
    company_id = str(uuid.uuid4())
    op.execute("""
        INSERT INTO companies (id, name, document, email, created_at, updated_at)
        VALUES (
            '{}',
            'Empresa Padrão',
            '00000000000',
            'admin@sistema.com',
            NOW(),
            NOW()
        )
    """.format(company_id))

    # Obter ID da role admin
    role_id = op.get_bind().execute("SELECT id FROM roles WHERE name = 'admin'").scalar()

    # Criar usuário admin
    op.execute("""
        INSERT INTO users (id, email, password_hash, name, company_id, role_id, is_active, created_at, updated_at)
        VALUES (
            '{}',
            'admin@sistema.com',
            '{}',
            'Administrador',
            '{}',
            '{}',
            1,
            NOW(),
            NOW()
        )
    """.format(
        str(uuid.uuid4()),
        generate_password_hash('admin123'),
        company_id,
        role_id
    ))

def downgrade():
    op.execute("DELETE FROM users WHERE email = 'admin@sistema.com'")
    op.execute("DELETE FROM companies WHERE document = '00000000000'")
    op.execute("DELETE FROM roles WHERE name = 'admin'")
