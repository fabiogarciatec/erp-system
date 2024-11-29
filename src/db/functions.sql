-- Função para executar SQL dinâmico
CREATE OR REPLACE FUNCTION exec_sql(sql_string text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_string;
END;
$$;
