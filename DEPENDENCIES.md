# Dependências do Projeto ERP System

Este documento lista todas as dependências necessárias para executar o projeto corretamente.

## Pré-requisitos
- Node.js (versão recomendada: 18.x ou superior)
- npm (normalmente vem com Node.js)
- Git

## Como Instalar

1. Clone o repositório:
```bash
git clone https://github.com/fabiogarciatec/erp-system.git
cd erp-system
```

2. Instale as dependências:
```bash
npm install
```

3. Para iniciar o projeto:
```bash
npm run dev
```

## Lista Completa de Dependências

### Dependências Principais

#### UI/Componentes
```json
{
  "@chakra-ui/icons": "^2.2.4",
  "@chakra-ui/react": "^2.8.2",
  "@emotion/react": "^11.13.5",
  "@emotion/styled": "^11.13.5",
  "framer-motion": "10.16.4",
  "react-icons": "^4.12.0"
}
```

#### React e Roteamento
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1"
}
```

#### Mapas e Geolocalização
```json
{
  "@react-google-maps/api": "^2.20.3",
  "@types/google.maps": "^3.58.1"
}
```

#### Banco de Dados e API
```json
{
  "@supabase/supabase-js": "^2.39.0",
  "pg": "^8.13.1",
  "postgres": "^3.4.5"
}
```

#### Formatação e Máscaras
```json
{
  "cleave.js": "^1.6.0",
  "react-input-mask": "^2.0.4",
  "vanilla-masker": "^1.2.0"
}
```

#### Utilitários
```json
{
  "dotenv": "^16.4.5",
  "file-saver": "^2.0.5",
  "jszip": "^3.10.1",
  "react-toastify": "^10.0.6"
}
```

### Dependências de Desenvolvimento

#### TypeScript e Tipos
```json
{
  "typescript": "^5.2.2",
  "@types/node": "^22.10.0",
  "@types/react": "^18.2.37",
  "@types/react-dom": "^18.2.15",
  "@types/cleave.js": "^1.4.12",
  "@types/file-saver": "^2.0.7",
  "@types/pg": "^8.11.10",
  "@types/react-input-mask": "^3.0.6"
}
```

#### Ferramentas de Build e Dev
```json
{
  "vite": "^5.4.11",
  "@vitejs/plugin-react": "^4.3.4",
  "rimraf": "^6.0.1",
  "ts-node": "^10.9.2",
  "tsx": "^4.19.2"
}
```

#### Linting e Qualidade de Código
```json
{
  "eslint": "^8.53.0",
  "@typescript-eslint/eslint-plugin": "^8.16.0",
  "@typescript-eslint/parser": "^8.16.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "eslint-plugin-react-refresh": "^0.4.4"
}
```

## Scripts Disponíveis

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview",
  "test:admin": "tsx src/scripts/testAdmin.ts",
  "migrate": "tsx src/scripts/runMigrations.ts",
  "test:auth": "tsx src/scripts/testAuth.ts",
  "clean": "rimraf node_modules/.vite"
}
```

## Observações Importantes

1. Certifique-se de ter todas as variáveis de ambiente necessárias configuradas (veja o arquivo .env.example)
2. Em caso de problemas com dependências:
   - Delete a pasta node_modules
   - Delete o arquivo package-lock.json
   - Execute `npm install` novamente

3. Para limpar o cache do Vite:
```bash
npm run clean
```

4. Para atualizar todas as dependências para suas últimas versões compatíveis:
```bash
npm update
```
