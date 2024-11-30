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
