-- Disable RLS
alter table if exists auth.users disable row level security;

-- Create roles table
create table if not exists public.roles (
    id bigint primary key generated always as identity,
    name varchar not null unique,
    description varchar,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create permissions table
create table if not exists public.permissions (
    id bigint primary key generated always as identity,
    name varchar not null unique,
    description varchar,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create role_permissions table
create table if not exists public.role_permissions (
    id bigint primary key generated always as identity,
    role_id bigint references public.roles(id) on delete cascade,
    permission_id bigint references public.permissions(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(role_id, permission_id)
);

-- Create user_roles table
create table if not exists public.user_roles (
    id bigint primary key generated always as identity,
    user_id uuid references auth.users(id) on delete cascade,
    role_id bigint references public.roles(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, role_id)
);

-- Insert default roles
insert into public.roles (name, description) values
    ('admin', 'Administrador do sistema'),
    ('manager', 'Gerente'),
    ('user', 'Usuário padrão');

-- Insert default permissions
insert into public.permissions (name, description) values
    ('users.read', 'Visualizar usuários'),
    ('users.write', 'Criar/editar usuários'),
    ('users.delete', 'Deletar usuários'),
    ('roles.read', 'Visualizar funções'),
    ('roles.write', 'Criar/editar funções'),
    ('roles.delete', 'Deletar funções'),
    ('customers.read', 'Visualizar clientes'),
    ('customers.write', 'Criar/editar clientes'),
    ('customers.delete', 'Deletar clientes');

-- Assign permissions to roles
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'admin';

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'manager'
and p.name in ('customers.read', 'customers.write', 'users.read');
