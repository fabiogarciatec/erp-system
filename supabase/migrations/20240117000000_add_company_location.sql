-- Add latitude and longitude columns to companies table
ALTER TABLE companies
ADD COLUMN latitude DOUBLE PRECISION,
ADD COLUMN longitude DOUBLE PRECISION;
