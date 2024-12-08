-- Verificar e ajustar tipos das colunas
DO $$ 
BEGIN
    -- Verificar deleted_at em profiles
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'deleted_at' 
        AND data_type = 'timestamp with time zone'
    ) THEN
        ALTER TABLE profiles 
        ALTER COLUMN deleted_at TYPE TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Verificar deleted_at em user_companies
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_companies' 
        AND column_name = 'deleted_at' 
        AND data_type = 'timestamp with time zone'
    ) THEN
        ALTER TABLE user_companies 
        ALTER COLUMN deleted_at TYPE TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Verificar is_active em user_companies
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_companies' 
        AND column_name = 'is_active' 
        AND data_type = 'boolean'
    ) THEN
        ALTER TABLE user_companies 
        ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;
