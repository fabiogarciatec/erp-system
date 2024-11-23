-- Adicionar foreign key para auth.users se não existir
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_profiles_id_fkey'
    ) THEN
        ALTER TABLE user_profiles
        ADD CONSTRAINT user_profiles_id_fkey 
        FOREIGN KEY (id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
    END IF;
END $$;
