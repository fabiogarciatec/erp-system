-- Create omie_clientes table
create table if not exists public.omie_clientes (
  id bigint primary key generated always as identity,
  codigo_cliente_omie varchar unique not null,
  razao_social varchar not null,
  cnpj_cpf varchar,
  email varchar,
  telefone1_ddd varchar,
  telefone1_numero varchar,
  cidade varchar,
  estado varchar(2),
  status_cliente varchar,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table public.omie_clientes enable row level security;

create policy "Enable read access for all users"
  on public.omie_clientes for select
  using (true);

-- Create function to automatically update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger to call the function
create trigger handle_updated_at
  before update on public.omie_clientes
  for each row
  execute procedure public.handle_updated_at();
