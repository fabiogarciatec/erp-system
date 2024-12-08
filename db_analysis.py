from supabase import create_client
import json
import os
import time
from datetime import datetime

# Configuração do Supabase
url = "https://hgbvvvvaqylsincjopnl.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnYnZ2dnZhcXlsc2luY2pvcG5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjgxODc0NCwiZXhwIjoyMDQ4Mzk0NzQ0fQ.7-BygWz4WyP8sMYnLJwzNxZ056d5Pfd1EhkiVUnGqkA"

# Criar cliente Supabase
supabase = create_client(url, key)

# Configuração do cache
CACHE_DIR = "db_cache"
CACHE_DURATION = 3600  # 1 hora em segundos

# Lista de todas as tabelas do sistema
tables = [
    'companies',
    'customers',
    'permission_modules',
    'permissions',
    'products',
    'profiles',
    'role_permissions',
    'roles',
    'sale_items',
    'sales',
    'service_orders',
    'services',
    'shipping_orders',
    'states',
    'user_companies',
    'user_roles'
]

def ensure_cache_dir():
    """Garante que o diretório de cache existe"""
    if not os.path.exists(CACHE_DIR):
        os.makedirs(CACHE_DIR)

def get_cache_file(table_name):
    """Retorna o caminho do arquivo de cache para uma tabela"""
    return os.path.join(CACHE_DIR, f"{table_name}.json")

def is_cache_valid(cache_file):
    """Verifica se o cache ainda é válido"""
    if not os.path.exists(cache_file):
        return False
    
    modified_time = os.path.getmtime(cache_file)
    current_time = time.time()
    return (current_time - modified_time) < CACHE_DURATION

def save_to_cache(table_name, data):
    """Salva os dados da tabela no cache"""
    cache_file = get_cache_file(table_name)
    with open(cache_file, 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'data': data
        }, f, indent=2)

def load_from_cache(table_name):
    """Carrega os dados do cache"""
    cache_file = get_cache_file(table_name)
    if is_cache_valid(cache_file):
        with open(cache_file, 'r') as f:
            return json.load(f)
    return None

def check_table(table_name):
    """Verifica a estrutura de uma tabela"""
    print(f"\nAnalisando tabela: {table_name}")
    
    # Tenta carregar do cache primeiro
    cached_data = load_from_cache(table_name)
    if cached_data:
        print("(usando dados em cache)")
        if cached_data['data']:
            print(f"✓ Tabela '{table_name}' encontrada")
            print("Estrutura:")
            for key in cached_data['data'][0].keys():
                print(f"  - {key}")
        else:
            print(f"✓ Tabela '{table_name}' existe mas está vazia")
        return

    # Se não tem cache válido, consulta o Supabase
    try:
        response = supabase.table(table_name).select("*").limit(1).execute()
        
        if response.data:
            print(f"✓ Tabela '{table_name}' encontrada")
            print("Estrutura:")
            for key in response.data[0].keys():
                print(f"  - {key}")
            # Salva no cache
            save_to_cache(table_name, response.data)
        else:
            print(f"✓ Tabela '{table_name}' existe mas está vazia")
            save_to_cache(table_name, [])
            
    except Exception as e:
        print(f"✗ Erro ao acessar '{table_name}': {str(e)}")
    
    # Pequena pausa para evitar rate limiting
    time.sleep(0.5)

def main():
    print("\n=== Análise do Banco de Dados ERP ===")
    print("Verificando estrutura de todas as tabelas...")
    
    ensure_cache_dir()
    
    for table in tables:
        check_table(table)
        print("-" * 50)

if __name__ == "__main__":
    main()
