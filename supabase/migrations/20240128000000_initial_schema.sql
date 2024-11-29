-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE,
    position TEXT,
    phone TEXT,
    avatar_url TEXT,
    company_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    document TEXT UNIQUE,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    website TEXT,
    logo_url TEXT,
    foundation_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    document TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    status TEXT DEFAULT 'active',
    last_purchase TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key to profiles
ALTER TABLE profiles
ADD CONSTRAINT fk_profiles_company
FOREIGN KEY (company_id) REFERENCES companies(id)
ON DELETE SET NULL;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('company_logos', 'company_logos', true);

-- Set up Row Level Security (RLS)

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Companies RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company"
    ON companies FOR SELECT
    USING (
        id IN (
            SELECT company_id 
            FROM profiles 
            WHERE profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can update their company"
    ON companies FOR UPDATE
    USING (
        id IN (
            SELECT company_id 
            FROM profiles 
            WHERE profiles.id = auth.uid()
        )
    );

-- Customers RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view customers from their company"
    ON customers FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM profiles 
            WHERE profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can insert customers in their company"
    ON customers FOR INSERT
    WITH CHECK (
        company_id IN (
            SELECT company_id 
            FROM profiles 
            WHERE profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can update customers from their company"
    ON customers FOR UPDATE
    USING (
        company_id IN (
            SELECT company_id 
            FROM profiles 
            WHERE profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can delete customers from their company"
    ON customers FOR DELETE
    USING (
        company_id IN (
            SELECT company_id 
            FROM profiles 
            WHERE profiles.id = auth.uid()
        )
    );

-- Storage RLS
CREATE POLICY "Avatar images are publicly accessible."
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar."
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Company logos are publicly accessible."
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'company_logos' );

CREATE POLICY "Users can upload company logos."
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'company_logos' );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    ''
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
