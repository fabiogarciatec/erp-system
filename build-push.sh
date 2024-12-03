#!/bin/bash

# Defina seu usuário do Docker Hub aqui
DOCKER_HUB_USER="fatecinfo"

# Versão atual (você pode alterar isso a cada release)
VERSION="dev-1.0.0"

# Build e push da imagem do frontend
echo "Building frontend image..."
docker build -t $DOCKER_HUB_USER/erp-frontend:$VERSION -t $DOCKER_HUB_USER/erp-frontend:latest -f Dockerfile .
docker push $DOCKER_HUB_USER/erp-frontend:$VERSION
docker push $DOCKER_HUB_USER/erp-frontend:latest

# Build e push da imagem do backend
echo "Building backend image..."
docker build -t $DOCKER_HUB_USER/erp-backend:$VERSION -t $DOCKER_HUB_USER/erp-backend:latest -f Dockerfile.python .
docker push $DOCKER_HUB_USER/erp-backend:$VERSION
docker push $DOCKER_HUB_USER/erp-backend:latest

echo "Build and push completed!"
