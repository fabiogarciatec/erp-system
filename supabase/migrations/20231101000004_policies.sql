-- Enable RLS
alter table public.companies enable row level security;
alter table public.user_companies enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;

-- Companies policies
create policy "Companies are viewable by authenticated users"
on public.companies for select
to authenticated
using (
  exists (
    select 1 from public.user_companies
    where user_companies.company_id = companies.id
    and user_companies.user_id = auth.uid()
  )
);

create policy "Companies are insertable by authenticated users"
on public.companies for insert
to authenticated
with check (true);

-- User Companies policies
create policy "User companies are viewable by authenticated users"
on public.user_companies for select
to authenticated
using (user_id = auth.uid());

create policy "User companies are insertable by authenticated users"
on public.user_companies for insert
to authenticated
with check (user_id = auth.uid());

-- Roles policies
create policy "Roles are viewable by authenticated users"
on public.roles for select
to authenticated
using (true);

-- Permissions policies
create policy "Permissions are viewable by authenticated users"
on public.permissions for select
to authenticated
using (true);

-- Role Permissions policies
create policy "Role permissions are viewable by authenticated users"
on public.role_permissions for select
to authenticated
using (true);

-- User Roles policies
create policy "User roles are viewable by authenticated users"
on public.user_roles for select
to authenticated
using (user_id = auth.uid());

create policy "User roles are insertable by authenticated users"
on public.user_roles for insert
to authenticated
with check (user_id = auth.uid());
