-- Drop table if exists (for clean migration)
drop table if exists public.states cascade;

-- Create states table
create table if not exists public.states (
    id serial primary key,
    name varchar not null,
    uf char(2) not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert all Brazilian states
insert into public.states (name, uf) values
    ('Acre', 'AC'),
    ('Alagoas', 'AL'),
    ('Amazonas', 'AM'),
    ('Amapá', 'AP'),
    ('Bahia', 'BA'),
    ('Ceará', 'CE'),
    ('Distrito Federal', 'DF'),
    ('Espírito Santo', 'ES'),
    ('Goiás', 'GO'),
    ('Maranhão', 'MA'),
    ('Minas Gerais', 'MG'),
    ('Mato Grosso do Sul', 'MS'),
    ('Mato Grosso', 'MT'),
    ('Pará', 'PA'),
    ('Paraíba', 'PB'),
    ('Pernambuco', 'PE'),
    ('Piauí', 'PI'),
    ('Paraná', 'PR'),
    ('Rio de Janeiro', 'RJ'),
    ('Rio Grande do Norte', 'RN'),
    ('Rondônia', 'RO'),
    ('Roraima', 'RR'),
    ('Rio Grande do Sul', 'RS'),
    ('Santa Catarina', 'SC'),
    ('Sergipe', 'SE'),
    ('São Paulo', 'SP'),
    ('Tocantins', 'TO')
on conflict (uf) do nothing;

-- Drop existing state column if exists
alter table public.companies drop column if exists state;

-- Add state_id to companies table
alter table public.companies
    add column if not exists state_id integer references public.states(id);

-- Create index for better performance
create index if not exists idx_companies_state_id on public.companies(state_id);

-- Drop existing profiles table if exists
drop table if exists public.profiles;

-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users(id) primary key,
    email text not null,
    full_name varchar,
    phone varchar,
    avatar_url varchar,
    role varchar,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Storage
create extension if not exists "storage" schema "extensions";

-- Create avatars bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Enable RLS
alter table storage.objects enable row level security;

-- Allow public access to avatars
create policy "Avatars are publicly accessible"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload avatar files
create policy "Users can upload avatars"
on storage.objects for insert
with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
);

-- Allow users to update their own avatar
create policy "Users can update their own avatar"
on storage.objects for update
using (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
)
with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
);

-- Allow users to delete their own avatar
create policy "Users can delete their own avatar"
on storage.objects for delete
using (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
);
