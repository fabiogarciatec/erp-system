-- Drop existing state column if exists
alter table public.companies drop column if exists state;

-- Add state_id to companies table
alter table public.companies
    add column if not exists state_id integer references public.states(id);

-- Create index for better performance
create index if not exists idx_companies_state_id on public.companies(state_id);
