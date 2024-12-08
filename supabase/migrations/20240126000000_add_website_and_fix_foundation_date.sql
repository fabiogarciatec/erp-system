-- Add website column and ensure foundation_date is properly typed
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS website text,
ALTER COLUMN foundation_date TYPE date USING foundation_date::date;
