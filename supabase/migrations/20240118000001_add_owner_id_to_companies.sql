-- Add owner_id column to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Update existing companies to have an owner (if needed)
DO $$
DECLARE
    company_record RECORD;
    first_user_id UUID;
BEGIN
    FOR company_record IN SELECT * FROM companies WHERE owner_id IS NULL
    LOOP
        -- Get the first user associated with this company
        SELECT user_id INTO first_user_id 
        FROM user_companies 
        WHERE company_id = company_record.id 
        AND is_owner = true 
        LIMIT 1;

        -- Update company owner if a user was found
        IF first_user_id IS NOT NULL THEN
            UPDATE companies 
            SET owner_id = first_user_id 
            WHERE id = company_record.id;
        END IF;
    END LOOP;
END $$;
