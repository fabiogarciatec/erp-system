-- Criar tabela roles
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela companies
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    document VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(10),
    state_id INT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address_number VARCHAR(10),
    address_complement VARCHAR(100),
    neighborhood VARCHAR(100),
    owner_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    company_id VARCHAR(36),
    role_id VARCHAR(36),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Inserir role admin
INSERT INTO roles (id, name, description)
SELECT UUID(), 'admin', 'Administrador do sistema'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'admin');

-- Inserir empresa padrão
INSERT INTO companies (id, name, document, email)
SELECT UUID(), 'Empresa Padrão', '00000000000', 'admin@sistema.com'
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE document = '00000000000');

-- Inserir usuário admin
INSERT INTO users (id, email, password_hash, name, company_id, role_id, is_active)
SELECT 
    UUID(),
    'admin@sistema.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFpxQgkD.rykSiO', -- senha: admin123
    'Administrador',
    (SELECT id FROM companies WHERE document = '00000000000'),
    (SELECT id FROM roles WHERE name = 'admin'),
    1
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@sistema.com');
