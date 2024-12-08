-- Primeiro, garante que a coluna user_id em user_roles referencia auth.users
ALTER TABLE user_roles
DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;

ALTER TABLE user_roles
ADD CONSTRAINT user_roles_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Adiciona relacionamento entre profiles e user_roles
ALTER TABLE user_roles
DROP CONSTRAINT IF EXISTS user_roles_profile_id_fkey;

ALTER TABLE user_roles
ADD CONSTRAINT user_roles_profile_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES profiles(id)
ON DELETE CASCADE;
