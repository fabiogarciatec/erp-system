-- Habilitar RLS para a tabela usuarios
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política para permitir usuários lerem seus próprios dados
CREATE POLICY "Usuários podem ler seus próprios dados"
ON usuarios
FOR SELECT
USING (auth.uid() = auth_id);

-- Política para permitir usuários da mesma empresa lerem dados
CREATE POLICY "Usuários podem ler dados da mesma empresa"
ON usuarios
FOR SELECT
USING (
  empresa_id IN (
    SELECT empresa_id 
    FROM usuarios 
    WHERE auth_id = auth.uid()
  )
);

-- Política para permitir inserção de novos usuários
CREATE POLICY "Permitir inserção de novos usuários"
ON usuarios
FOR INSERT
WITH CHECK (true);

-- Política para permitir usuários atualizarem seus próprios dados
CREATE POLICY "Usuários podem atualizar seus próprios dados"
ON usuarios
FOR UPDATE
USING (auth.uid() = auth_id)
WITH CHECK (auth.uid() = auth_id);

-- Política para permitir usuários excluírem seus próprios dados
CREATE POLICY "Usuários podem excluir seus próprios dados"
ON usuarios
FOR DELETE
USING (auth.uid() = auth_id);

-- Garantir que todos os usuários tenham acesso à tabela empresas
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas empresas"
ON empresas
FOR SELECT
USING (
  id IN (
    SELECT empresa_id 
    FROM usuarios 
    WHERE auth_id = auth.uid()
  )
);

CREATE POLICY "Permitir inserção de novas empresas"
ON empresas
FOR INSERT
WITH CHECK (true);

-- Política para permitir usuários atualizarem dados de suas empresas
CREATE POLICY "Usuários podem atualizar suas empresas"
ON empresas
FOR UPDATE
USING (
  id IN (
    SELECT empresa_id 
    FROM usuarios 
    WHERE auth_id = auth.uid()
  )
)
WITH CHECK (
  id IN (
    SELECT empresa_id 
    FROM usuarios 
    WHERE auth_id = auth.uid()
  )
);
