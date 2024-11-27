-- Create companies table
create table if not exists public.companies (
    id uuid not null default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    document text not null,
    email text,
    phone text,
    website text,
    foundation_date date,
    address text,
    address_number text,
    address_complement text,
    neighborhood text,
    city text,
    state text,
    zip_code text,
    business_type text,
    industry_sector text,
    tax_regime text,
    state_registration text,
    municipal_registration text,
    legal_representative text,
    legal_representative_cpf text,
    legal_representative_phone text,
    legal_representative_email text,
    company_size text,
    notes text,
    logo_url text,
    created_by uuid references auth.users(id),
    owner_id uuid references auth.users(id)
);

-- Create trigger to update updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_companies_updated_at
    before update on public.companies
    for each row
    execute procedure update_updated_at_column();

-- Create policy for viewing companies
create policy "Users can view their own company"
    on public.companies for select
    using (
        id in (
            select company_id
            from profiles
            where profiles.id = auth.uid()
            and company_id is not null
        )
    );

-- Create policy for inserting companies
create policy "Users can create companies"
    on public.companies for insert
    with check (
        auth.uid() is not null
    );

-- Create policy for updating company
create policy "Users can update their own company"
    on public.companies for update
    using (
        id in (
            select company_id
            from profiles
            where profiles.id = auth.uid()
            and company_id is not null
        )
    );

-- Enable RLS
alter table public.companies enable row level security;

-- Create storage bucket for company logos
insert into storage.buckets (id, name, public) 
values ('company-logos', 'company-logos', true)
on conflict (id) do nothing;

-- Storage policy to read company logos
create policy "Company logos are publicly accessible"
    on storage.objects for select
    using ( bucket_id = 'company-logos' );

-- Storage policy to upload company logos
create policy "Only company admins can upload logos"
    on storage.objects for insert
    with check (
        bucket_id = 'company-logos' and
        (
            select role
            from profiles
            where 
                profiles.user_id = auth.uid() and
                profiles.role = 'admin'
        ) is not null
    );
