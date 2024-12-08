-- Create extension if not exists
create extension if not exists "uuid-ossp";

-- Backup existing data
create table companies_backup as select * from companies;
create table profiles_backup as select * from profiles;
create table customers_backup as select * from customers;

-- Drop existing foreign keys
alter table profiles drop constraint if exists fk_profiles_company;
alter table customers drop constraint if exists customers_company_id_fkey;

-- Alter companies table to use UUID
alter table companies 
  alter column id drop default,
  alter column id set data type uuid using (uuid_generate_v4()),
  alter column id set default uuid_generate_v4();

-- Update profiles table
alter table profiles 
  alter column company_id set data type uuid using (uuid_generate_v4());

-- Update customers table
alter table customers 
  alter column company_id set data type uuid using (uuid_generate_v4());

-- Recreate foreign keys
alter table profiles 
  add constraint fk_profiles_company 
  foreign key (company_id) 
  references companies(id);

alter table customers 
  add constraint customers_company_id_fkey 
  foreign key (company_id) 
  references companies(id);

-- Create user_companies table
create table if not exists public.user_companies (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    company_id uuid references public.companies(id) on delete cascade,
    is_owner boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, company_id)
);

-- Add trigger to update updated_at if it doesn't exist
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

drop trigger if exists update_companies_updated_at on public.companies;
create trigger update_companies_updated_at
    before update on public.companies
    for each row
    execute function public.update_updated_at_column();

-- Add new permissions for companies if they don't exist
insert into public.permissions (name, description)
select name, description
from (values 
    ('companies.read', 'Visualizar empresas'),
    ('companies.write', 'Criar/editar empresas'),
    ('companies.delete', 'Deletar empresas')
) as new_permissions(name, description)
where not exists (
    select 1 from public.permissions 
    where name = new_permissions.name
);

-- Add company permissions to admin role if they don't exist
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'admin'
and p.name in ('companies.read', 'companies.write', 'companies.delete')
and not exists (
    select 1 from public.role_permissions rp
    where rp.role_id = r.id and rp.permission_id = p.id
);

-- Add company read permission to manager role if it doesn't exist
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'manager'
and p.name = 'companies.read'
and not exists (
    select 1 from public.role_permissions rp
    where rp.role_id = r.id and rp.permission_id = p.id
);
