\d profiles;

-- Verificar se o perfil existe
SELECT * FROM profiles WHERE user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730';

-- Verificar as políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Verificar os triggers
SELECT 
    trigger_schema,
    trigger_name,
    event_manipulation,
    event_object_schema,
    event_object_table,
    action_statement,
    action_orientation,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'profiles';
