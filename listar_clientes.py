from omie_api import OmieAPI
import json
import os
from datetime import datetime

def salvar_cache(dados, nome_arquivo):
    """Salva os dados em um arquivo JSON temporário"""
    cache_dir = "cache"
    if not os.path.exists(cache_dir):
        os.makedirs(cache_dir)
    
    caminho_arquivo = os.path.join(cache_dir, nome_arquivo)
    with open(caminho_arquivo, 'w', encoding='utf-8') as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
    return caminho_arquivo

def carregar_cache(nome_arquivo):
    """Carrega dados do arquivo JSON temporário"""
    caminho_arquivo = os.path.join("cache", nome_arquivo)
    if os.path.exists(caminho_arquivo):
        with open(caminho_arquivo, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def mostrar_clientes(quantidade=5, usar_cache=True):
    cache_file = "clientes_cache.json"
    
    # Tenta carregar do cache primeiro
    if usar_cache:
        print("Tentando usar cache...")
        dados_cache = carregar_cache(cache_file)
        if dados_cache and dados_cache.get('success'):
            print("Usando dados do cache...")
            return exibir_clientes(dados_cache['data'], quantidade)
    
    # Se não tem cache ou não deve usar, busca da API
    print("Buscando dados da API...")
    omie = OmieAPI()
    response = omie.listar_clientes(pagina=1, registros_por_pagina=quantidade)
    
    if response['success']:
        print("Dados obtidos com sucesso!")
        salvar_cache(response, cache_file)
        return exibir_clientes(response['data'], quantidade)
    else:
        print(f"Erro ao buscar clientes: {response.get('error', 'Erro desconhecido')}")
        return False

def exibir_clientes(dados, quantidade):
    """Função auxiliar para exibir os clientes formatados"""
    if not dados or 'clientes_cadastro' not in dados:
        print("Nenhum cliente encontrado nos dados")
        return False
    
    clientes = dados['clientes_cadastro'][:quantidade]
    print(f"\n=== Listando {len(clientes)} clientes ===\n")
    
    for cliente in clientes:
        print(f"Nome: {cliente.get('razao_social', 'Não informado')}")
        print(f"CPF/CNPJ: {cliente.get('cnpj_cpf', 'Não informado')}")
        print(f"Cidade: {cliente.get('cidade', 'Não informada')}")
        print(f"Estado: {cliente.get('estado', 'Não informado')}")
        print(f"Email: {cliente.get('email', 'Não informado')}")
        print(f"Telefone: ({cliente.get('telefone1_ddd', '')}) {cliente.get('telefone1_numero', '')}")
        print("-" * 50)
    
    return True

if __name__ == "__main__":
    # Para forçar nova busca da API, use usar_cache=False
    mostrar_clientes(5, usar_cache=False)
