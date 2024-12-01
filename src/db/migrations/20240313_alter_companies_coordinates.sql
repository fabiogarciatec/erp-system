-- Alterar tipo das colunas de coordenadas na tabela companies
ALTER TABLE public.companies 
  ALTER COLUMN latitude TYPE NUMERIC(10,8),
  ALTER COLUMN longitude TYPE NUMERIC(11,8);

-- Adicionar constraints para validar os valores
ALTER TABLE public.companies 
  ADD CONSTRAINT check_latitude CHECK (latitude >= -90 AND latitude <= 90),
  ADD CONSTRAINT check_longitude CHECK (longitude >= -180 AND longitude <= 180);
