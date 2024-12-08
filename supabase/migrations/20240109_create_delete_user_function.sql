-- Criar função para deletar usuário do auth.users
create or replace function delete_user(user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Remover usuário do auth.users
  delete from auth.users where id = user_id;
end;
$$;
