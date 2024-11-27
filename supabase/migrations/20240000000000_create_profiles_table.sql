-- Drop existing policies
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;

-- Drop existing trigger
drop trigger if exists handle_updated_at on public.profiles;

-- Drop existing function
drop function if exists public.handle_updated_at();

-- Drop existing table if it exists
drop table if exists public.profiles;

-- Create profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    email text,
    position text,
    phone text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
create policy "Users can view their own profile"
    on public.profiles for select
    using ( auth.uid() = id );

create policy "Users can update their own profile"
    on public.profiles for update
    using ( auth.uid() = id );

create policy "Users can insert their own profile"
    on public.profiles for insert
    with check ( auth.uid() = id );

-- Create function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_updated_at
    before update on public.profiles
    for each row
    execute procedure public.handle_updated_at();
