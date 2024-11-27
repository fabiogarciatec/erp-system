-- Add logo_url column to companies table
alter table if exists public.companies
add column if not exists logo_url text;

-- Update RLS policies
alter policy "Enable read access for authenticated users" on companies
using (true);

alter policy "Enable insert for authenticated users" on companies
using (true)
with check (true);

alter policy "Enable update for users based on owner_id" on companies
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);
