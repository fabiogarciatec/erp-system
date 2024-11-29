-- Remove todas as políticas e desabilita RLS em todas as tabelas

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by users in same company" ON profiles;
DROP POLICY IF EXISTS "Users can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Users can delete profiles" ON profiles;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Companies
DROP POLICY IF EXISTS "Users can view their company" ON companies;
DROP POLICY IF EXISTS "Users can update their company" ON companies;
DROP POLICY IF EXISTS "Companies are viewable by company users" ON companies;
DROP POLICY IF EXISTS "Companies are updatable by company admins" ON companies;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;

-- Customers
DROP POLICY IF EXISTS "Users can view customers from their company" ON customers;
DROP POLICY IF EXISTS "Users can insert customers in their company" ON customers;
DROP POLICY IF EXISTS "Users can update customers from their company" ON customers;
DROP POLICY IF EXISTS "Users can delete customers from their company" ON customers;
DROP POLICY IF EXISTS "Customers are viewable by company users" ON customers;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;

-- Storage
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
DROP POLICY IF EXISTS "Company logos are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Users can upload company logos." ON storage.objects;

-- Products
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Services
ALTER TABLE services DISABLE ROW LEVEL SECURITY;

-- Service Orders
ALTER TABLE service_orders DISABLE ROW LEVEL SECURITY;

-- Sales
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;

-- Sale Items
ALTER TABLE sale_items DISABLE ROW LEVEL SECURITY;

-- Shipping Orders
ALTER TABLE shipping_orders DISABLE ROW LEVEL SECURITY;
