-- Função para buscar usuários com emails
-- Drop existing function if exists
drop function if exists get_users_with_emails(uuid);

-- Create function to get users with emails
create or replace function get_users_with_emails(company_id uuid)
returns setof json
language plpgsql
security definer
set search_path = public
as $$
begin
    return query
    select 
        json_build_object(
            'user_id', p.id,
            'email', au.email,
            'full_name', p.full_name,
            'phone', p.phone,
            'is_active', p.is_active,
            'roles', (
                select coalesce(
                    json_agg(
                        json_build_object(
                            'id', r.id,
                            'name', r.name,
                            'role_id', r.id  
                        )
                    ),
                    '[]'::json
                )
                from user_roles ur
                inner join roles r on ur.role_id = r.id  
                where ur.user_id = p.id
            )
        )
    from profiles p
    inner join user_companies uc on p.id = uc.user_id
    inner join auth.users au on p.id = au.id
    where uc.company_id = get_users_with_emails.company_id;
end;
$$;

-- Grant execute permission
grant execute on function get_users_with_emails(uuid) to authenticated;
