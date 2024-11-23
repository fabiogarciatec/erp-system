-- Criar uma view segura para acessar emails dos usuários
CREATE OR REPLACE VIEW user_emails AS
SELECT 
    id,
    email,
    CASE 
        WHEN raw_user_meta_data->>'full_name' IS NOT NULL 
        THEN raw_user_meta_data->>'full_name'
        ELSE email 
    END as display_name
FROM auth.users;

-- Criar política para acessar a view
CREATE POLICY "Allow authenticated users to view emails"
    ON user_emails
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM user_profiles up 
            WHERE up.id = auth.uid() 
            AND (
                up.role = 'master' 
                OR (up.role IN ('admin', 'manager') AND up.company_id = (
                    SELECT company_id 
                    FROM user_profiles 
                    WHERE id = user_emails.id
                ))
            )
        )
    );
