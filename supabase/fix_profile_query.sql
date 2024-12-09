-- Verificar se o perfil existe com user_id
SELECT * FROM profiles WHERE user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730';

-- Se não existir, criar o perfil
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
