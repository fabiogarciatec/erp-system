-- Add address columns to companies table
alter table public.companies
add column if not exists address varchar,
add column if not exists city varchar,
add column if not exists state varchar,
add column if not exists postal_code varchar;
