# ERP FATEC SaaS

Sistema de Gestão Empresarial (ERP) desenvolvido como projeto acadêmico para a FATEC.

## Tecnologias

- React
- TypeScript
- Vite
- Chakra UI
- Supabase
- React Router

## Funcionalidades

- Autenticação de usuários
- Dashboard
- Gestão de Clientes (CRUD)
- Produtos (Em desenvolvimento)
- Vendas (Em desenvolvimento)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/fabiogarciatec/erp-system.git
cd erp-system
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações do Supabase
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Configuração do Supabase

1. Crie um projeto no Supabase
2. Configure as tabelas necessárias usando as migrations em `supabase/migrations`
3. Configure as políticas de segurança (RLS)
4. Adicione as credenciais no arquivo `.env`

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
