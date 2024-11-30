-- Disable RLS on all tables
alter table public.companies disable row level security;
alter table public.user_companies disable row level security;
alter table public.roles disable row level security;
alter table public.permissions disable row level security;
alter table public.role_permissions disable row level security;
alter table public.user_roles disable row level security;

-- Drop any existing policies
drop policy if exists "Companies are viewable by authenticated users" on public.companies;
drop policy if exists "Companies are insertable by authenticated users" on public.companies;
drop policy if exists "User companies are viewable by authenticated users" on public.user_companies;
drop policy if exists "User companies are insertable by authenticated users" on public.user_companies;
drop policy if exists "Roles are viewable by authenticated users" on public.roles;
drop policy if exists "Permissions are viewable by authenticated users" on public.permissions;
drop policy if exists "Role permissions are viewable by authenticated users" on public.role_permissions;
drop policy if exists "User roles are viewable by authenticated users" on public.user_roles;
drop policy if exists "User roles are insertable by authenticated users" on public.user_roles;
