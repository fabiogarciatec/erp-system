-- Fix profiles table structure
BEGIN;

-- Drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS profiles 
    DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Ensure profiles table has correct structure
DO $$ 
BEGIN
    -- Check if profiles table exists and create if not
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        CREATE TABLE profiles (
            user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email text NOT NULL,
            is_active boolean DEFAULT true,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
    ELSE
        -- Make sure user_id column exists and is primary key
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'user_id'
        ) THEN
            ALTER TABLE profiles ADD COLUMN user_id uuid;
            ALTER TABLE profiles ADD PRIMARY KEY (user_id);
        END IF;

        -- Make sure email column exists
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'email'
        ) THEN
            ALTER TABLE profiles ADD COLUMN email text NOT NULL DEFAULT '';
        END IF;

        -- Make sure is_active column exists
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'is_active'
        ) THEN
            ALTER TABLE profiles ADD COLUMN is_active boolean DEFAULT true;
        END IF;

        -- Make sure timestamps exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'created_at'
        ) THEN
            ALTER TABLE profiles ADD COLUMN created_at timestamptz DEFAULT now();
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'updated_at'
        ) THEN
            ALTER TABLE profiles ADD COLUMN updated_at timestamptz DEFAULT now();
        END IF;
    END IF;
END $$;

-- Add foreign key constraint
ALTER TABLE profiles
    ADD CONSTRAINT profiles_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
    DROP POLICY IF EXISTS "Super admin can view all profiles" ON profiles;
    DROP POLICY IF EXISTS "Super admin can update all profiles" ON profiles;

    -- Create new policies
    CREATE POLICY "Users can view their own profile"
        ON profiles FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);

    CREATE POLICY "Users can update their own profile"
        ON profiles FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Super admin can view all profiles"
        ON profiles FOR SELECT
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM user_roles ur
                JOIN roles r ON ur.role_id = r.id
                WHERE ur.user_id = auth.uid()
                AND r.name = 'Super Admin'
            )
        );

    CREATE POLICY "Super admin can update all profiles"
        ON profiles FOR UPDATE
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM user_roles ur
                JOIN roles r ON ur.role_id = r.id
                WHERE ur.user_id = auth.uid()
                AND r.name = 'Super Admin'
            )
        );
END $$;

-- Create function to handle profile updates
CREATE OR REPLACE FUNCTION handle_profile_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for profile updates
DROP TRIGGER IF EXISTS on_profile_updated ON profiles;
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE handle_profile_updated();

COMMIT;
