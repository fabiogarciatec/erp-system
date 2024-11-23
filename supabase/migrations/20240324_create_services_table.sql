-- Create services table
create table if not exists public.services (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    description text,
    category text not null,
    price decimal(10,2) not null,
    duration integer,
    company_id uuid not null references public.companies(id) on delete cascade,
    active boolean default true not null
);

-- Enable RLS
alter table public.services enable row level security;

-- Create policies
create policy "Users can view their own company's services"
    on public.services for select
    using (
        auth.uid() in (
            select up.id
            from user_profiles up
            where up.company_id = services.company_id
        )
    );

create policy "Users can insert their own company's services"
    on public.services for insert
    with check (
        auth.uid() in (
            select up.id
            from user_profiles up
            where up.company_id = services.company_id
        )
    );

create policy "Users can update their own company's services"
    on public.services for update
    using (
        auth.uid() in (
            select up.id
            from user_profiles up
            where up.company_id = services.company_id
        )
    )
    with check (
        auth.uid() in (
            select up.id
            from user_profiles up
            where up.company_id = services.company_id
        )
    );

create policy "Users can delete their own company's services"
    on public.services for delete
    using (
        auth.uid() in (
            select up.id
            from user_profiles up
            where up.company_id = services.company_id
        )
    );

-- Create indexes
create index services_company_id_idx on public.services(company_id);
create index services_name_idx on public.services(name);
create index services_category_idx on public.services(category);

-- Create trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer;

create trigger handle_services_updated_at
    before update on public.services
    for each row
    execute procedure public.handle_updated_at();
