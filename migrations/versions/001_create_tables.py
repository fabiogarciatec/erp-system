"""create tables

Revision ID: 001
Revises: 
Create Date: 2024-12-09 00:30:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Criar tabela roles
    op.create_table('roles',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('description', sa.String(200)),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime, server_default=sa.text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    )

    # Criar tabela companies
    op.create_table('companies',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('document', sa.String(20), unique=True, nullable=False),
        sa.Column('email', sa.String(255)),
        sa.Column('phone', sa.String(20)),
        sa.Column('address', sa.String(255)),
        sa.Column('city', sa.String(100)),
        sa.Column('postal_code', sa.String(10)),
        sa.Column('state_id', sa.Integer, sa.ForeignKey('states.id')),
        sa.Column('latitude', sa.Numeric(10, 8)),
        sa.Column('longitude', sa.Numeric(11, 8)),
        sa.Column('address_number', sa.String(10)),
        sa.Column('address_complement', sa.String(100)),
        sa.Column('neighborhood', sa.String(100)),
        sa.Column('owner_id', sa.String(36)),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime, server_default=sa.text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    )

    # Criar tabela users
    op.create_table('users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id')),
        sa.Column('role_id', sa.String(36), sa.ForeignKey('roles.id')),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime, server_default=sa.text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    )


def downgrade() -> None:
    op.drop_table('users')
    op.drop_table('companies')
    op.drop_table('roles')
