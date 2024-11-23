-- Drop existing view if it exists
DROP VIEW IF EXISTS user_emails;

-- Create the view with proper schema reference
CREATE OR REPLACE VIEW public.user_emails AS
SELECT 
    id,
    email,
    CASE 
        WHEN raw_user_meta_data->>'full_name' IS NOT NULL 
        THEN raw_user_meta_data->>'full_name'
        ELSE email 
    END as display_name
FROM auth.users;

-- Enable RLS
ALTER VIEW public.user_emails ENABLE ROW LEVEL SECURITY;

-- Create policy for the view
DROP POLICY IF EXISTS "Allow authenticated users to view emails" ON public.user_emails;
CREATE POLICY "Allow authenticated users to view emails"
    ON public.user_emails
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM public.user_profiles up 
            WHERE up.id = auth.uid() 
            AND (
                up.role = 'master' 
                OR (up.role IN ('admin', 'manager') AND up.company_id = (
                    SELECT company_id 
                    FROM public.user_profiles 
                    WHERE id = user_emails.id
                ))
            )
        )
    );
