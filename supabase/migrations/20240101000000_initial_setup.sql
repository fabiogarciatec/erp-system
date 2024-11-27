-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Drop existing objects
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.products cascade;
drop table if exists public.customers cascade;
drop table if exists public.services cascade;
drop table if exists public.profiles cascade;
drop table if exists public.users cascade;
drop table if exists public.companies cascade;

-- Create base tables
create table public.companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  document text unique,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key default uuid_generate_v4(),
  auth_id uuid not null unique references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  description text,
  price decimal(10,2) not null default 0,
  stock_quantity integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  document text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  description text,
  price decimal(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.companies enable row level security;
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.services enable row level security;
alter table public.profiles enable row level security;

-- Grant schema permissions
grant usage on schema public to postgres, authenticated, anon, service_role;
grant usage on schema auth to postgres, authenticated, anon, service_role;

-- Grant table permissions
grant all on all tables in schema public to postgres, authenticated, service_role;
grant all on all sequences in schema public to postgres, authenticated, service_role;
grant select on auth.users to postgres, authenticated, anon, service_role;

-- Create RLS Policies

-- Companies policies
create policy "Users can view their own company"
  on public.companies for select
  using (id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

create policy "Service role can create companies"
  on public.companies for insert
  to service_role
  with check (true);

-- Users policies
create policy "Users can view their own user data"
  on public.users for select
  using (auth.uid() = auth_id);

create policy "Service role can create users"
  on public.users for insert
  to service_role
  with check (true);

-- Products policies
create policy "Users can view their company's products"
  on public.products for select
  using (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can insert their company's products"
  on public.products for insert
  with check (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can update their company's products"
  on public.products for update
  using (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can delete their company's products"
  on public.products for delete
  using (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

-- Customers policies
create policy "Users can view their company's customers"
  on public.customers for select
  using (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can insert their company's customers"
  on public.customers for insert
  with check (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can update their company's customers"
  on public.customers for update
  using (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can delete their company's customers"
  on public.customers for delete
  using (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

-- Services policies
create policy "Users can view their company's services"
  on public.services for select
  using (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can insert their company's services"
  on public.services for insert
  with check (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can update their company's services"
  on public.services for update
  using (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can delete their company's services"
  on public.services for delete
  using (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

-- Profiles policies
create policy "Users can view their company's profiles"
  on public.profiles for select
  using (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can insert their company's profiles"
  on public.profiles for insert
  with check (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can update their company's profiles"
  on public.profiles for update
  using (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can delete their company's profiles"
  on public.profiles for delete
  using (company_id in (
    select company_id from public.users
    where auth_id = auth.uid()
  ));

-- Create function to handle new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_company_id uuid;
  display_name text;
begin
  -- Get display name from metadata or email
  display_name := coalesce(
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  -- Create a new company
  insert into public.companies (name)
  values (display_name)
  returning id into new_company_id;

  -- Create a new user record
  insert into public.users (auth_id, company_id, name, email)
  values (
    new.id,
    new_company_id,
    display_name,
    new.email
  );

  return new;
exception
  when others then
    raise log 'Error in handle_new_user: % %', SQLERRM, SQLSTATE;
    return new;
end;
$$;

-- Set function owner and permissions
alter function public.handle_new_user() owner to postgres;
grant execute on function public.handle_new_user() to postgres, service_role;

-- Create trigger for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
