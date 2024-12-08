-- Create a function to handle the complete user registration process
create or replace function public.create_user_complete(
  p_user_id uuid,
  p_email text,
  p_company_name text,
  p_company_document text,
  p_company_email text,
  p_company_phone text
) returns void as $$
declare
  v_company_id uuid;
  v_default_role_id int;
begin
  -- Create company
  insert into public.companies (
    name,
    document,
    email,
    phone,
    created_at,
    updated_at
  ) values (
    p_company_name,
    p_company_document,
    p_company_email,
    p_company_phone,
    now(),
    now()
  ) returning id into v_company_id;

  -- Create profile
  insert into public.profiles (
    id,
    email,
    company_id,
    updated_at
  ) values (
    p_user_id,
    p_email,
    v_company_id,
    now()
  );

  -- Create user-company relationship
  insert into public.user_companies (
    user_id,
    company_id,
    is_owner,
    created_at
  ) values (
    p_user_id,
    v_company_id,
    true,
    now()
  );

  -- Get default role
  select id into v_default_role_id
  from public.roles
  where name = 'user'
  limit 1;

  -- Create user-role relationship
  insert into public.user_roles (
    user_id,
    role_id,
    created_at
  ) values (
    p_user_id,
    v_default_role_id,
    now()
  );

  -- Commit is handled automatically
exception when others then
  -- Rollback is handled automatically
  raise;
end;
$$ language plpgsql security definer;
