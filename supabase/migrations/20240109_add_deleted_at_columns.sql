-- Add deleted_at column to profiles table
ALTER TABLE profiles
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Add is_active column to user_companies table
ALTER TABLE user_companies
ADD COLUMN is_active BOOLEAN DEFAULT true;
