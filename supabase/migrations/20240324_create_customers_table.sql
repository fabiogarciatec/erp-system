-- Create customers table
create table if not exists public.customers (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    email text not null,
    phone text,
    document text,
    company_id uuid not null references public.companies(id) on delete cascade,
    active boolean default true not null
);

-- Enable RLS
alter table public.customers enable row level security;

-- Create policies
create policy "Users can view their own company's customers"
    on public.customers for select
    using (
        auth.uid() in (
            select up.id
            from user_profiles up
            where up.company_id = customers.company_id
        )
    );

create policy "Users can insert their own company's customers"
    on public.customers for insert
    with check (
        auth.uid() in (
            select up.id
            from user_profiles up
            where up.company_id = customers.company_id
        )
    );

create policy "Users can update their own company's customers"
    on public.customers for update
    using (
        auth.uid() in (
            select up.id
            from user_profiles up
            where up.company_id = customers.company_id
        )
    )
    with check (
        auth.uid() in (
            select up.id
            from user_profiles up
            where up.company_id = customers.company_id
        )
    );

create policy "Users can delete their own company's customers"
    on public.customers for delete
    using (
        auth.uid() in (
            select up.id
            from user_profiles up
            where up.company_id = customers.company_id
        )
    );

-- Create indexes
create index customers_company_id_idx on public.customers(company_id);
create index customers_name_idx on public.customers(name);
create index customers_email_idx on public.customers(email);
create index customers_document_idx on public.customers(document);

-- Create trigger for updated_at
create trigger handle_customers_updated_at
    before update on public.customers
    for each row
    execute procedure public.handle_updated_at();
