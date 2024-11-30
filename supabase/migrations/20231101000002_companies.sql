-- Create extension if not exists
create extension if not exists "uuid-ossp";

-- Create companies table
create table if not exists public.companies (
    id uuid primary key default uuid_generate_v4(),
    name varchar not null,
    document varchar unique,
    email varchar,
    phone varchar,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_companies table
create table if not exists public.user_companies (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    company_id uuid references public.companies(id) on delete cascade,
    is_owner boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, company_id)
);

-- Add trigger to update updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger update_companies_updated_at
    before update on public.companies
    for each row
    execute function public.update_updated_at_column();

-- Add new permissions for companies
insert into public.permissions (name, description) values
    ('companies.read', 'Visualizar empresas'),
    ('companies.write', 'Criar/editar empresas'),
    ('companies.delete', 'Deletar empresas');

-- Add company permissions to admin role
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'admin'
and p.name in ('companies.read', 'companies.write', 'companies.delete');

-- Add company read permission to manager role
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'manager'
and p.name = 'companies.read';
