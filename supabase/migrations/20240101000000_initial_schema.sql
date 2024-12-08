-- Create users table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  auth_id uuid not null unique references auth.users(id) on delete cascade,
  company_id uuid not null,
  name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create companies table
create table public.companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  document text unique,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add foreign key to users table
alter table public.users
  add constraint fk_users_company
  foreign key (company_id)
  references public.companies(id)
  on delete cascade;

-- Create products table
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

-- Create customers table
create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  document text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.companies enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;

-- Create policies
create policy "Users can view their own company data"
  on public.users
  for select
  using (auth.uid() = auth_id);

create policy "Users can view their company"
  on public.companies
  for select
  using (id in (
    select company_id
    from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can view their company's products"
  on public.products
  for select
  using (company_id in (
    select company_id
    from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can view their company's customers"
  on public.customers
  for select
  using (company_id in (
    select company_id
    from public.users
    where auth_id = auth.uid()
  ));

-- Create insert policies
create policy "Users can insert their company's products"
  on public.products
  for insert
  with check (company_id in (
    select company_id
    from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can insert their company's customers"
  on public.customers
  for insert
  with check (company_id in (
    select company_id
    from public.users
    where auth_id = auth.uid()
  ));

-- Create update policies
create policy "Users can update their company's products"
  on public.products
  for update
  using (company_id in (
    select company_id
    from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can update their company's customers"
  on public.customers
  for update
  using (company_id in (
    select company_id
    from public.users
    where auth_id = auth.uid()
  ));

-- Create delete policies
create policy "Users can delete their company's products"
  on public.products
  for delete
  using (company_id in (
    select company_id
    from public.users
    where auth_id = auth.uid()
  ));

create policy "Users can delete their company's customers"
  on public.customers
  for delete
  using (company_id in (
    select company_id
    from public.users
    where auth_id = auth.uid()
  ));

-- Create functions
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_company_id uuid;
begin
  -- Create a new company for the user
  insert into public.companies (name)
  values (new.email)
  returning id into new_company_id;

  -- Create a new user record
  insert into public.users (auth_id, company_id, name, email)
  values (new.id, new_company_id, new.raw_user_meta_data->>'name', new.email);

  return new;
end;
$$;

-- Create trigger for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
