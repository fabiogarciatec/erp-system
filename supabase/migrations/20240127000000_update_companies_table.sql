-- Alter existing companies table to add new columns and modify existing ones

-- Basic Information
ALTER TABLE companies 
  ALTER COLUMN name TYPE TEXT,
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN document TYPE TEXT,
  ALTER COLUMN document SET NOT NULL,
  ADD CONSTRAINT companies_document_unique UNIQUE (document),
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS foundation_date DATE;

-- Address Information
ALTER TABLE companies 
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS address_number TEXT,
  ADD COLUMN IF NOT EXISTS address_complement TEXT,
  ADD COLUMN IF NOT EXISTS neighborhood TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Business Information
ALTER TABLE companies 
  ADD COLUMN IF NOT EXISTS business_type TEXT,
  ADD COLUMN IF NOT EXISTS industry_sector TEXT,
  ADD COLUMN IF NOT EXISTS tax_regime TEXT,
  ADD COLUMN IF NOT EXISTS state_registration TEXT,
  ADD COLUMN IF NOT EXISTS municipal_registration TEXT;

-- Legal Representative
ALTER TABLE companies 
  ADD COLUMN IF NOT EXISTS legal_representative TEXT,
  ADD COLUMN IF NOT EXISTS legal_representative_cpf TEXT,
  ADD COLUMN IF NOT EXISTS legal_representative_phone TEXT,
  ADD COLUMN IF NOT EXISTS legal_representative_email TEXT;

-- Additional Information
ALTER TABLE companies 
  ADD COLUMN IF NOT EXISTS company_size TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add updated_at column and trigger if they don't exist
ALTER TABLE companies 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies if they don't exist
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own company" ON companies;
CREATE POLICY "Users can view their own company"
    ON companies FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM profiles
            WHERE company_id = companies.id
        )
    );

DROP POLICY IF EXISTS "Users can update their own company" ON companies;
CREATE POLICY "Users can update their own company"
    ON companies FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT id FROM profiles
            WHERE company_id = companies.id
        )
    )
    WITH CHECK (
        auth.uid() IN (
            SELECT id FROM profiles
            WHERE company_id = companies.id
        )
    );
