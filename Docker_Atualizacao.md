
# 1. Acesse o servidor
ssh root@207.180.249.172

# 2. Vá para o diretório do projeto e atualize o código
cd /opt/erp
git pull origin Modo_Dev

# 3. Dê permissão de execução ao script
chmod +x build-push.sh

# 4. Execute o script de build
./build-push.sh






# Guia de Atualização do ERP no Docker

# 1. Acesse o servidor
ssh root@207.180.249.172

# 2. Vá para o diretório do projeto e atualize o código
cd /opt/erp
git pull origin Modo_Dev

# 3. Faça login no Docker Hub (se necessário)
docker login

# 4. Build e push do Frontend
docker build -t fatecinfo/erp-frontend:dev-1.0.0 -t fatecinfo/erp-frontend:latest .
docker push fatecinfo/erp-frontend:dev-1.0.0
docker push fatecinfo/erp-frontend:latest

# 5. Build e push do Backend
docker build -f Dockerfile.python -t fatecinfo/erp-backend:dev-1.0.0 -t fatecinfo/erp-backend:latest .
docker push fatecinfo/erp-backend:dev-1.0.0
docker push fatecinfo/erp-backend:latest

# 6. Remova a stack atual
docker stack rm erp

# 7. Aguarde alguns segundos
sleep 30

# 8. Faça o deploy da nova stack
docker stack deploy -c docker-compose.yml erp

# 9. Verifique o status
docker service ls

## 1. Processo de Build e Push

### 1.1. Build das Imagens
```bash
# Frontend
docker build -t fatecinfo/erp-frontend:latest -t fatecinfo/erp-frontend:dev-1.0.0 .
docker push fatecinfo/erp-frontend:latest
docker push fatecinfo/erp-frontend:dev-1.0.0

# Backend
docker build -f Dockerfile.python -t fatecinfo/erp-backend:latest -t fatecinfo/erp-backend:dev-1.0.0 .
docker push fatecinfo/erp-backend:latest
docker push fatecinfo/erp-backend:dev-1.0.0

1.2. Usando o Script Automatizado
bash
CopyInsert in Terminal
./build-push.sh

2. Deploy no Servidor
2.1. Acesso ao Servidor
bash
CopyInsert
ssh root@207.180.249.172
cd /opt/erp

2.2. Atualização da Stack
bash
CopyInsert
# Atualizar código (se necessário)
git pull origin main

# Deploy/Update da stack
docker stack deploy -c docker-compose.yml erp

# Verificar status
docker service ls | grep erp
3. Monitoramento e Logs
3.1. Verificar Logs
bash
CopyInsert
# Frontend
docker service logs erp_frontend -f

# Backend
docker service logs erp_backend -f

3.2. Status dos Serviços
bash
CopyInsert
# Listar todos os serviços
docker service ls

# Detalhes específicos
docker service inspect erp_frontend
docker service inspect erp_backend

4. Comandos de Manutenção
4.1. Gerenciamento da Stack
bash
CopyInsert
# Remover stack
docker stack rm erp

# Forçar atualização de serviços
docker service update --force erp_frontend
docker service update --force erp_backend

4.2. Limpeza e Manutenção
bash
CopyInsert
# Limpar imagens não utilizadas
docker image prune -a

# Limpar volumes não utilizados
docker volume prune

# Verificar uso de disco
df -h

5. Troubleshooting
5.1. Problemas Comuns e Soluções
Serviço não inicia:
bash
CopyInsert
# Verificar logs detalhados
docker service logs erp_frontend --tail 100
docker service logs erp_backend --tail 100

Problemas de Rede:
bash
CopyInsert
# Verificar rede
docker network ls
docker network inspect minha_rede
Problemas de Certificado:
bash
CopyInsert
# Verificar logs do Traefik
docker service logs traefik_traefik

5.2. Reinício Completo
bash
CopyInsert
# Remover stack
docker stack rm erp

# Aguardar 30 segundos
sleep 30

# Redeployar
docker stack deploy -c docker-compose.yml erp

6. Verificação Pós-Deploy
6.1. Checklist
Verificar https://erp.fatec.info
Verificar https://api.erp.fatec.info
Testar login/autenticação
Verificar integração com Google Maps
Verificar conexão com Supabase

6.2. Endpoints e Portas
Frontend: https://erp.fatec.info (80/443)
Backend: https://api.erp.fatec.info (5000)
Traefik Dashboard: porta 8080

7. Backup e Restauração
7.1. Backup
bash
CopyInsert
# Backup do docker-compose.yml
cp docker-compose.yml docker-compose.yml.bak

# Backup de volumes (se necessário)
docker run --rm -v erp_data:/data -v /backup:/backup alpine tar czf /backup/erp_data.tar.gz /data

7.2. Restauração
bash
CopyInsert
# Restaurar configuração
cp docker-compose.yml.bak docker-compose.yml

# Restaurar volumes (se necessário)
docker run --rm -v erp_data:/data -v /backup:/backup alpine tar xzf /backup/erp_data.tar.gz -C /
Variáveis de Ambiente
yaml
CopyInsert
# Frontend
NODE_ENV=development
VITE_API_URL=https://api.erp.fatec.info
VITE_SUPABASE_URL=https://hgbvvvvaqylsincjopnl.supabase.co
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDVzyn9rtZi9-1mWKFykiP47--6mPeKJH8

# Backend
FLASK_APP=api_routes.py
FLASK_ENV=development
FLASK_DEBUG=1
Contatos e Suporte
Repositório: https://github.com/fabiogarciatec/erp-system
Email: suporte@fatec.info
