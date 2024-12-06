-- Primeiro remover a função existente
drop function if exists get_user_emails(uuid[]);

-- Criar função para buscar emails dos usuários de forma segura
create or replace function get_user_emails(user_ids uuid[])
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    result jsonb;
begin
    select jsonb_agg(
        jsonb_build_object(
            'user_id', au.id,
            'email', au.email
        )
    )
    into result
    from auth.users au
    where au.id = any(user_ids);

    return coalesce(result, '[]'::jsonb);
end;
$$;
