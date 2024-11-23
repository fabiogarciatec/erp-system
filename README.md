# ERP System

Um sistema ERP (Enterprise Resource Planning) moderno construído com React e Supabase.

## Características

- 🏢 Gestão multi-empresa
- 👥 Controle de usuários e permissões
- 📊 Dashboard interativo
- 💰 Gestão de vendas
- 📦 Controle de produtos
- 🛠 Gestão de serviços
- 👥 Gestão de clientes
- 📈 Marketing

## 🚀 Tecnologias

- React 18
- Vite
- Chakra UI
- Supabase
- React Router DOM
- React Icons

## 📋 Funcionalidades

- Autenticação de usuários
- Gestão de empresas
- Gestão de vendas
- Gestão de produtos e serviços
- Gestão de clientes
- Controle de acesso baseado em funções (RBAC)

## Pré-requisitos

- Node.js 16+
- npm ou yarn
- Conta no Supabase

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/erp-system.git
cd erp-system
```

2. Instale as dependências:
```bash
npm install
# ou
yarn
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas credenciais do Supabase.

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Copie as credenciais (URL e Anon Key) para o arquivo `.env`
4. Execute as migrações do banco de dados (scripts disponíveis na pasta `supabase/migrations`)

## Build para Produção

1. Gere o build:
```bash
npm run build
# ou
yarn build
```

2. Teste o build localmente:
```bash
npm run preview
# ou
yarn preview
```

## Deploy

### Vercel

1. Conecte seu repositório à [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy!

### Netlify

1. Conecte seu repositório ao [Netlify](https://netlify.com)
2. Configure as variáveis de ambiente
3. Deploy!

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/seu-usuario/erp-system)

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── contexts/       # Contextos React
  ├── pages/         # Páginas da aplicação
  ├── services/      # Serviços (API, etc)
  ├── styles/        # Estilos globais
  └── utils/         # Funções utilitárias
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera o build de produção
- `npm run preview` - Testa o build localmente
- `npm run lint` - Executa o linter
- `npm test` - Executa os testes

## Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, leia as [diretrizes de contribuição](CONTRIBUTING.md) antes de enviar um pull request.

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Suporte

Para suporte, envie um email para [seu-email@dominio.com]
