-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" 
ON profiles FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable insert for authenticated users" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" 
ON profiles FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Verify if user exists
SELECT * FROM auth.users WHERE id = 'd71e3d86-b97e-4062-8106-9b87f761a730';

-- Verify if profile exists
SELECT * FROM profiles WHERE user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730';

-- Create profile if it doesn't exist
INSERT INTO profiles (user_id, email, is_active)
SELECT 
    'd71e3d86-b97e-4062-8106-9b87f761a730',
    'fatec@fatec.info',
    true
WHERE NOT EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730'
);
