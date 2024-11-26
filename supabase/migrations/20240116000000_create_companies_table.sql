-- Create companies table
create table if not exists public.companies (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    logo_url text,
    address text,
    phone text,
    email text,
    website text,
    tax_id text unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.companies enable row level security;

-- Create policy for viewing companies
create policy "Users can view their own company"
    on companies for select
    using (
        id = (
            select company_id
            from profiles
            where profiles.user_id = auth.uid()
        )
    );

-- Create policy for updating company
create policy "Users with admin role can update their company"
    on companies for update
    using (
        id = (
            select company_id
            from profiles
            where 
                profiles.user_id = auth.uid() and
                profiles.role = 'admin'
        )
    );

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

-- Add trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_companies_updated_at
    before update on public.companies
    for each row
    execute procedure public.handle_updated_at();
