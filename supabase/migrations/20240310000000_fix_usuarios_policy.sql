-- Primeiro, remover TODAS as policies existentes da tabela usuarios
DO $$ 
BEGIN
    -- Remover todas as policies existentes
    DROP POLICY IF EXISTS "allow_authenticated_access" ON usuarios;
    DROP POLICY IF EXISTS "usuarios_policy" ON usuarios;
    DROP POLICY IF EXISTS "Usuários podem ler seus próprios dados" ON usuarios;
    DROP POLICY IF EXISTS "Usuários podem ler dados da mesma empresa" ON usuarios;
    DROP POLICY IF EXISTS "usuarios_select_policy" ON usuarios;
    DROP POLICY IF EXISTS "usuarios_insert_policy" ON usuarios;
    DROP POLICY IF EXISTS "usuarios_update_policy" ON usuarios;
    DROP POLICY IF EXISTS "usuarios_delete_policy" ON usuarios;
    DROP POLICY IF EXISTS "manage_own_profile" ON usuarios;
    DROP POLICY IF EXISTS "allow_read_own_profile" ON usuarios;
    DROP POLICY IF EXISTS "allow_update_own_profile" ON usuarios;
    DROP POLICY IF EXISTS "allow_read_own_data" ON usuarios;
    DROP POLICY IF EXISTS "allow_insert" ON usuarios;
    DROP POLICY IF EXISTS "allow_update_own_data" ON usuarios;
    DROP POLICY IF EXISTS "allow_delete_own_data" ON usuarios;
END $$;

-- Desabilitar RLS temporariamente
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Usuários podem ler seus próprios dados" ON usuarios;
DROP POLICY IF EXISTS "Usuários podem ler dados da mesma empresa" ON usuarios;
DROP POLICY IF EXISTS "Permitir inserção de novos usuários" ON usuarios;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON usuarios;
DROP POLICY IF EXISTS "Usuários podem excluir seus próprios dados" ON usuarios;

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política para leitura de dados próprios e da mesma empresa
CREATE POLICY "allow_read_own_and_company_data" 
ON usuarios
FOR SELECT
USING (
  auth_id = auth.uid() OR 
  empresa_id IN (
    SELECT u.empresa_id
    FROM usuarios u 
    WHERE u.auth_id = auth.uid()
  )
);

-- Política para inserção via trigger
CREATE POLICY "allow_insert_trigger" 
ON usuarios 
FOR INSERT 
WITH CHECK (true);

-- Política para atualização de dados próprios
CREATE POLICY "allow_update_own_data" 
ON usuarios
FOR UPDATE
USING (auth_id = auth.uid())
WITH CHECK (auth_id = auth.uid());

-- Política para exclusão de dados próprios
CREATE POLICY "allow_delete_own_data" 
ON usuarios
FOR DELETE
USING (auth_id = auth.uid());

-- Política para admins
CREATE POLICY "allow_admin_full_access"
ON usuarios
FOR ALL
USING (
  EXISTS (
    SELECT 1 
    FROM usuarios u
    WHERE u.auth_id = auth.uid()
    AND u.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM usuarios u
    WHERE u.auth_id = auth.uid()
    AND u.role = 'admin'
  )
);
