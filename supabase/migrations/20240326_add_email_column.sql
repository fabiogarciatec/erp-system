-- Adicionar coluna email
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Atualizar emails existentes
UPDATE user_profiles up
SET email = au.email
FROM auth.users au
WHERE au.id = up.id;

-- Criar função para atualizar email
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles
    SET email = NEW.email
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

-- Criar trigger para manter email sincronizado
DROP TRIGGER IF EXISTS sync_user_email_trigger ON auth.users;
CREATE TRIGGER sync_user_email_trigger
    AFTER UPDATE OF email ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_email();
