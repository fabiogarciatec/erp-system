-- Garantir que todas as tabelas tenham company_id e as políticas corretas
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE services ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);

-- Criar ou atualizar políticas de RLS para companies
CREATE POLICY IF NOT EXISTS "Companies are viewable by their users"
  ON companies FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE company_id = companies.id
    )
  );

CREATE POLICY IF NOT EXISTS "Companies are insertable by system"
  ON companies FOR INSERT
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Companies are updatable by admins"
  ON companies FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE company_id = companies.id 
      AND role IN ('admin', 'master')
    )
  );

-- Políticas para customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Customers are viewable by company users"
  ON customers FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE company_id = customers.company_id
    )
  );

CREATE POLICY IF NOT EXISTS "Customers are insertable by company users"
  ON customers FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE company_id = NEW.company_id
    )
  );

CREATE POLICY IF NOT EXISTS "Customers are updatable by company users"
  ON customers FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE company_id = customers.company_id
    )
  );

-- Políticas para products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Products are viewable by company users"
  ON products FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE company_id = products.company_id
    )
  );

CREATE POLICY IF NOT EXISTS "Products are insertable by company users"
  ON products FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE company_id = NEW.company_id
    )
  );

CREATE POLICY IF NOT EXISTS "Products are updatable by company users"
  ON products FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE company_id = products.company_id
    )
  );

-- Políticas para services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Services are viewable by company users"
  ON services FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE company_id = services.company_id
    )
  );

CREATE POLICY IF NOT EXISTS "Services are insertable by company users"
  ON services FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE company_id = NEW.company_id
    )
  );

CREATE POLICY IF NOT EXISTS "Services are updatable by company users"
  ON services FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE company_id = services.company_id
    )
  );

-- Triggers para garantir company_id
CREATE OR REPLACE FUNCTION set_company_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.company_id IS NULL THEN
    NEW.company_id := (
      SELECT company_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_customer_company_id ON customers;
CREATE TRIGGER set_customer_company_id
  BEFORE INSERT ON customers
  FOR EACH ROW
  EXECUTE FUNCTION set_company_id();

DROP TRIGGER IF EXISTS set_product_company_id ON products;
CREATE TRIGGER set_product_company_id
  BEFORE INSERT ON products
  FOR EACH ROW
  EXECUTE FUNCTION set_company_id();

DROP TRIGGER IF EXISTS set_service_company_id ON services;
CREATE TRIGGER set_service_company_id
  BEFORE INSERT ON services
  FOR EACH ROW
  EXECUTE FUNCTION set_company_id();
