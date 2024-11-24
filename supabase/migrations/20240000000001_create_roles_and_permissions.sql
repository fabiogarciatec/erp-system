-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_key VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_key)
);

-- Insert default roles
INSERT INTO roles (name, display_name, description) 
VALUES 
    ('admin', 'Administrador', 'Acesso total ao sistema'),
    ('manager', 'Gerente', 'Gerenciamento de operações diárias'),
    ('sales', 'Vendedor', 'Acesso às funcionalidades de vendas'),
    ('support', 'Suporte', 'Atendimento ao cliente e suporte'),
    ('user', 'Usuário', 'Acesso básico ao sistema')
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for roles
CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Policies for roles
CREATE POLICY "Allow read access to all authenticated users"
    ON roles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow write access to admin users only"
    ON roles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid()
            AND up.role = 'admin'
        )
    );

-- Policies for role_permissions
CREATE POLICY "Allow read access to all authenticated users"
    ON role_permissions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow write access to admin users only"
    ON role_permissions FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid()
            AND up.role = 'admin'
        )
    );
