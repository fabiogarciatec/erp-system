-- Criar papel padrão se não existir
INSERT INTO public.roles (name, description, created_at)
SELECT 'user', 'Default user role', now()
WHERE NOT EXISTS (
    SELECT 1 FROM public.roles WHERE name = 'user'
);

-- Verificar papéis existentes
SELECT id, name, description, created_at
FROM public.roles
ORDER BY created_at;
