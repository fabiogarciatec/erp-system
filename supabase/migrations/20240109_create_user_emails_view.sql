-- Criar view para emails dos usuários
-- Drop existing view if exists
drop view if exists user_emails;

-- Create view with proper permissions
create view user_emails as
select id as user_id, email, email_confirmed_at
from auth.users;

-- Grant permissions
grant select on user_emails to authenticated;
grant select on user_emails to service_role;

-- Create policy for the view
create policy "Users can view emails from their company"
    on user_emails
    for select
    using (
        auth.uid() in (
            select uc.user_id 
            from user_companies uc 
            where uc.company_id in (
                select company_id 
                from user_companies 
                where user_id = auth.uid()
            )
        )
    );
