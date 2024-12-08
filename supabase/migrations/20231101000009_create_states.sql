-- Drop table if exists (for clean migration)
drop table if exists public.states cascade;

-- Create states table
create table if not exists public.states (
    id serial primary key,
    name varchar not null,
    uf char(2) not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert all Brazilian states
insert into public.states (name, uf) values
    ('Acre', 'AC'),
    ('Alagoas', 'AL'),
    ('Amazonas', 'AM'),
    ('Amapá', 'AP'),
    ('Bahia', 'BA'),
    ('Ceará', 'CE'),
    ('Distrito Federal', 'DF'),
    ('Espírito Santo', 'ES'),
    ('Goiás', 'GO'),
    ('Maranhão', 'MA'),
    ('Minas Gerais', 'MG'),
    ('Mato Grosso do Sul', 'MS'),
    ('Mato Grosso', 'MT'),
    ('Pará', 'PA'),
    ('Paraíba', 'PB'),
    ('Pernambuco', 'PE'),
    ('Piauí', 'PI'),
    ('Paraná', 'PR'),
    ('Rio de Janeiro', 'RJ'),
    ('Rio Grande do Norte', 'RN'),
    ('Rondônia', 'RO'),
    ('Roraima', 'RR'),
    ('Rio Grande do Sul', 'RS'),
    ('Santa Catarina', 'SC'),
    ('Sergipe', 'SE'),
    ('São Paulo', 'SP'),
    ('Tocantins', 'TO')
on conflict (uf) do nothing;
