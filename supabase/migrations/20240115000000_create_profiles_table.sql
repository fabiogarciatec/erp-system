-- Remover políticas existentes se houver
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- Desabilitar RLS temporariamente
alter table public.profiles disable row level security;
alter table public.companies disable row level security;

-- Criar empresa padrão se não existir
do $$
declare
    default_company_id uuid;
begin
    -- Criar UUID consistente para empresa padrão
    default_company_id := '00000000-0000-4000-a000-000000000001';
    
    -- Inserir empresa padrão se não existir
    insert into public.companies (id, name, created_at)
    values (
        default_company_id,
        'Empresa Padrão',
        CURRENT_TIMESTAMP
    )
    on conflict (id) do nothing;

    -- Atualizar profiles existentes sem company_id
    update public.profiles
    set company_id = default_company_id
    where company_id is null;
end $$;

-- Adicionar novas colunas se não existirem
do $$ 
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'user_id') then
        alter table public.profiles add column user_id uuid not null default auth.uid();
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'full_name') then
        alter table public.profiles add column full_name text;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'email') then
        alter table public.profiles add column email text;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'position') then
        alter table public.profiles add column position text;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'phone') then
        alter table public.profiles add column phone text;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'avatar_url') then
        alter table public.profiles add column avatar_url text;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'updated_at') then
        alter table public.profiles add column updated_at timestamp with time zone default timezone('utc'::text, now()) not null;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'created_at') then
        alter table public.profiles add column created_at timestamp with time zone default timezone('utc'::text, now()) not null;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'company_id') then
        alter table public.profiles add column company_id uuid not null default '00000000-0000-4000-a000-000000000001';
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'role') then
        alter table public.profiles add column role text check (role in ('master', 'director', 'manager', 'supervisor', 'seller', 'intern', 'user')) not null default 'user';
    end if;
end $$;

-- Verificar e criar o trigger de updated_at se não existir
do $$
begin
    if not exists (select 1 from pg_trigger where tgname = 'update_profiles_updated_at') then
        create trigger update_profiles_updated_at
        before update on public.profiles
        for each row
        execute function public.update_updated_at_column();
    end if;
end $$;

-- Remover todas as políticas existentes
do $$
begin
    -- Remover políticas da tabela profiles
    drop policy if exists "Users can view own profile" on public.profiles;
    drop policy if exists "Users can update own profile" on public.profiles;
    drop policy if exists "Permitir leitura do próprio perfil" on public.profiles;
    drop policy if exists "Permitir atualização do próprio perfil" on public.profiles;
    drop policy if exists "Permitir inserção do próprio perfil" on public.profiles;
    drop policy if exists "manage_own_profile" on public.profiles;
    drop policy if exists "profiles_select" on public.profiles;
    drop policy if exists "profiles_insert" on public.profiles;
    drop policy if exists "profiles_update" on public.profiles;
    drop policy if exists "allow_authenticated_access" on public.profiles;
    drop policy if exists "Perfis visíveis para usuários da mesma empresa" on public.profiles;
    drop policy if exists "allow_read_own_profile" on public.profiles;
    drop policy if exists "allow_update_own_profile" on public.profiles;
    drop policy if exists "allow_profile_select" on public.profiles;
    drop policy if exists "allow_profile_update" on public.profiles;
    
    -- Remover políticas da tabela companies que podem causar recursão
    drop policy if exists "Empresas visíveis para usuários autenticados" on public.companies;
    drop policy if exists "allow_company_access" on public.companies;
end $$;

-- Sincronizar usuários existentes
do $$
declare
    user_record record;
    default_company_id uuid := '00000000-0000-4000-a000-000000000001';
begin
    for user_record in 
        select au.id, au.email, au.raw_user_meta_data 
        from auth.users au
        left join public.profiles p on p.id = au.id
        where p.id is null
    loop
        insert into public.profiles (id, user_id, company_id, full_name, email, role)
        values (
            user_record.id,
            user_record.id,
            default_company_id,
            coalesce(user_record.raw_user_meta_data->>'full_name', ''),
            coalesce(user_record.email, ''),
            'user'
        )
        on conflict (id) do nothing;
    end loop;
end;
$$;

-- Remover trigger antigo se existir
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Criar nova função para novos usuários
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
declare
    default_company_id uuid := '00000000-0000-4000-a000-000000000001';
begin
    insert into public.profiles (id, user_id, company_id, full_name, email, role)
    values (
        new.id,
        new.id,
        default_company_id,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        coalesce(new.email, ''),
        'user'
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

-- Criar novo trigger
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Desabilitar RLS temporariamente para todas as tabelas relacionadas
alter table public.profiles disable row level security;
alter table public.companies disable row level security;
alter table public.products disable row level security;
alter table public.services disable row level security;
alter table public.customers disable row level security;

-- Habilitar RLS novamente
alter table public.profiles enable row level security;
alter table public.companies enable row level security;

-- Criar política básica para companies (sem recursão)
create policy "allow_company_access"
on public.companies
for all
to authenticated
using (true);

-- Criar políticas básicas para profiles (sem recursão)
create policy "allow_profile_select"
on public.profiles
for select
to authenticated
using (
    user_id = auth.uid()
);

-- Criar políticas de storage para o bucket avatars
do $$
begin
    -- Remover políticas existentes
    drop policy if exists "Avatar access" on storage.objects;
    drop policy if exists "Avatar upload" on storage.objects;
    drop policy if exists "Avatar update" on storage.objects;
    drop policy if exists "Avatar delete" on storage.objects;

    -- Criar novas políticas mais permissivas
    create policy "Avatar access"
    on storage.objects for select
    to authenticated
    using ( bucket_id = 'avatars' );

    create policy "Avatar upload"
    on storage.objects for insert
    to authenticated
    with check ( bucket_id = 'avatars' );

    create policy "Avatar update"
    on storage.objects for update
    to authenticated
    using ( bucket_id = 'avatars' );

    create policy "Avatar delete"
    on storage.objects for delete
    to authenticated
    using ( bucket_id = 'avatars' );
end $$;

-- Garantir permissões de storage
grant all on storage.objects to authenticated;
grant all on storage.buckets to authenticated;

-- Atualizar políticas de profiles para permitir atualização de avatar
drop policy if exists "allow_profile_update" on public.profiles;

create policy "allow_profile_update"
on public.profiles
for update
to authenticated
using (
    user_id = auth.uid()
    or (select role from public.profiles where user_id = auth.uid()) = 'master'
)
with check (
    user_id = auth.uid()
    or (select role from public.profiles where user_id = auth.uid()) = 'master'
);

-- Criar bucket para avatares se não existir
do $$
begin
    insert into storage.buckets (id, name, public)
    values ('avatars', 'avatars', true)
    on conflict (id) do nothing;
end $$;

-- Garantir permissões corretas
grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.companies to authenticated;
