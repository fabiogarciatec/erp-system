import json
import os

# Estrutura completa do banco de dados
db_structure = {
    "tables": {
        "companies": {
            "columns": {
                "id": {"type": "uuid", "primary_key": True},
                "name": {"type": "text"},
                "document": {"type": "text", "unique": True},
                "email": {"type": "text"},
                "phone": {"type": "text"},
                "address": {"type": "text"},
                "city": {"type": "text"},
                "created_at": {"type": "timestamp with time zone"},
                "updated_at": {"type": "timestamp with time zone"},
                "postal_code": {"type": "character varying"},
                "state_id": {"type": "integer", "foreign_key": "states.id"},
                "latitude": {"type": "numeric(10,8)"},
                "longitude": {"type": "numeric(11,8)"},
                "address_number": {"type": "character varying"},
                "address_complement": {"type": "character varying"},
                "neighborhood": {"type": "character varying"},
                "owner_id": {"type": "uuid", "foreign_key": "auth.users.id"}
            }
        },
        "customers": {
            "columns": {
                "id": {"type": "uuid", "primary_key": True},
                "company_id": {"type": "uuid", "foreign_key": "companies.id"},
                "name": {"type": "text"},
                "email": {"type": "text"},
                "phone": {"type": "text"},
                "address": {"type": "text"},
                "city": {"type": "text"},
                "state": {"type": "text"},
                "created_at": {"type": "timestamp with time zone"},
                "updated_at": {"type": "timestamp with time zone"}
            }
        },
        "permission_modules": {
            "columns": {
                "name": {"type": "character varying(50)", "primary_key": True},
                "description": {"type": "text"},
                "created_at": {"type": "timestamp with time zone"},
                "updated_at": {"type": "timestamp with time zone"}
            }
        },
        "permissions": {
            "columns": {
                "id": {"type": "uuid", "primary_key": True},
                "name": {"type": "character varying(100)"},
                "code": {"type": "character varying(100)", "unique": True},
                "description": {"type": "text"},
                "module": {"type": "character varying(50)", "foreign_key": "permission_modules.name"},
                "created_at": {"type": "timestamp with time zone"},
                "updated_at": {"type": "timestamp with time zone"}
            }
        },
        "products": {
            "columns": {
                "id": {"type": "uuid", "primary_key": True},
                "company_id": {"type": "uuid", "foreign_key": "companies.id"},
                "name": {"type": "text"},
                "description": {"type": "text"},
                "price": {"type": "numeric(10,2)"},
                "stock_quantity": {"type": "integer"},
                "category": {"type": "text"},
                "created_at": {"type": "timestamp with time zone"},
                "updated_at": {"type": "timestamp with time zone"}
            }
        },
        "profiles": {
            "columns": {
                "id": {"type": "uuid", "primary_key": True, "foreign_key": "auth.users.id"},
                "email": {"type": "text", "unique": True},
                "full_name": {"type": "text"},
                "role": {"type": "text"},
                "avatar_url": {"type": "text"},
                "created_at": {"type": "timestamp with time zone"},
                "updated_at": {"type": "timestamp with time zone"},
                "is_active": {"type": "boolean"},
                "permissions": {"type": "jsonb"},
                "phone": {"type": "character varying"},
                "deleted_at": {"type": "timestamp with time zone"},
                "company_id": {"type": "uuid", "foreign_key": "companies.id"}
            }
        },
        "role_permissions": {
            "columns": {
                "role_id": {"type": "uuid", "primary_key": True, "foreign_key": "roles.id"},
                "permission_id": {"type": "uuid", "primary_key": True, "foreign_key": "permissions.id"},
                "created_at": {"type": "timestamp with time zone"}
            }
        },
        "roles": {
            "columns": {
                "id": {"type": "uuid", "primary_key": True},
                "name": {"type": "character varying(50)", "unique": True},
                "description": {"type": "text"},
                "is_system_role": {"type": "boolean"},
                "created_at": {"type": "timestamp with time zone"},
                "updated_at": {"type": "timestamp with time zone"}
            }
        },
        "sale_items": {
            "columns": {
                "id": {"type": "uuid", "primary_key": True},
                "sale_id": {"type": "uuid", "foreign_key": "sales.id"},
                "product_id": {"type": "uuid", "foreign_key": "products.id"},
                "quantity": {"type": "integer"},
                "unit_price": {"type": "numeric(10,2)"},
                "total": {"type": "numeric(10,2)"},
                "created_at": {"type": "timestamp with time zone"},
                "updated_at": {"type": "timestamp with time zone"}
            }
        },
        "sales": {
            "columns": {
                "id": {"type": "uuid", "primary_key": True},
                "company_id": {"type": "uuid", "foreign_key": "companies.id"},
                "customer_id": {"type": "uuid", "foreign_key": "customers.id"},
                "total": {"type": "numeric(10,2)"},
                "status": {"type": "text"},
                "payment_method": {"type": "text"},
                "payment_status": {"type": "text"},
                "created_at": {"type": "timestamp with time zone"},
                "updated_at": {"type": "timestamp with time zone"}
            }
        },
        "service_orders": {
            "columns": {
                "id": {"type": "uuid", "primary_key": True},
                "company_id": {"type": "uuid", "foreign_key": "companies.id"},
                "customer_id": {"type": "uuid", "foreign_key": "customers.id"},
                "service_id": {"type": "uuid", "foreign_key": "services.id"},
                "status": {"type": "text"},
                "notes": {"type": "text"},
                "scheduled_date": {"type": "timestamp with time zone"},
                "completed_date": {"type": "timestamp with time zone"},
                "created_at": {"type": "timestamp with time zone"},
                "updated_at": {"type": "timestamp with time zone"}
            }
        },
        "services": {
            "columns": {
                "id": {"type": "uuid", "primary_key": True},
                "company_id": {"type": "uuid", "foreign_key": "companies.id"},
                "name": {"type": "text"},
                "description": {"type": "text"},
                "price": {"type": "numeric(10,2)"},
                "created_at": {"type": "timestamp with time zone"},
                "updated_at": {"type": "timestamp with time zone"}
            }
        },
        "shipping_orders": {
            "columns": {
                "id": {"type": "uuid", "primary_key": True},
                "company_id": {"type": "uuid", "foreign_key": "companies.id"},
                "sale_id": {"type": "uuid", "foreign_key": "sales.id"},
                "customer_id": {"type": "uuid", "foreign_key": "customers.id"},
                "status": {"type": "text"},
                "tracking_code": {"type": "text"},
                "shipping_address": {"type": "text"},
                "estimated_delivery_date": {"type": "timestamp with time zone"},
                "delivered_date": {"type": "timestamp with time zone"},
                "created_at": {"type": "timestamp with time zone"},
                "updated_at": {"type": "timestamp with time zone"}
            }
        },
        "states": {
            "columns": {
                "id": {"type": "serial", "primary_key": True},
                "name": {"type": "character varying"},
                "uf": {"type": "character(2)", "unique": True},
                "created_at": {"type": "timestamp with time zone"},
                "updated_at": {"type": "timestamp with time zone"}
            }
        },
        "user_companies": {
            "columns": {
                "id": {"type": "uuid", "primary_key": True},
                "user_id": {"type": "uuid", "foreign_key": "auth.users.id"},
                "company_id": {"type": "uuid", "foreign_key": "companies.id"},
                "is_owner": {"type": "boolean"},
                "created_at": {"type": "timestamp with time zone"},
                "deleted_at": {"type": "timestamp with time zone"},
                "is_active": {"type": "boolean"}
            }
        },
        "user_roles": {
            "columns": {
                "user_id": {"type": "uuid", "primary_key": True, "foreign_key": "auth.users.id"},
                "role_id": {"type": "uuid", "primary_key": True, "foreign_key": "roles.id"},
                "created_at": {"type": "timestamp with time zone"},
                "updated_at": {"type": "timestamp with time zone"}
            }
        }
    },
    "relationships": {
        "companies": {
            "has_many": ["customers", "products", "profiles", "sales", "service_orders", "shipping_orders"]
        },
        "customers": {
            "has_many": ["sales"]
        },
        "sales": {
            "has_many": ["sale_items"]
        },
        "service_orders": {
            "has_many": ["services"]
        },
        "roles": {
            "has_many": ["role_permissions"]
        },
        "auth.users": {
            "has_many": ["profiles", "user_roles"]
        }
    }
}

def save_structure():
    """Salva a estrutura do banco de dados em um arquivo JSON"""
    with open('db_structure.json', 'w', encoding='utf-8') as f:
        json.dump(db_structure, f, indent=2, ensure_ascii=False)

def analyze_structure():
    """Analisa e mostra informações sobre a estrutura do banco de dados"""
    print("\n=== Análise do Banco de Dados ERP ===\n")
    
    # Contagem de tabelas
    num_tables = len(db_structure["tables"])
    print(f"Total de tabelas: {num_tables}")
    
    # Análise de relacionamentos
    print("\nRelacionamentos principais:")
    for table, rels in db_structure["relationships"].items():
        print(f"\n{table}:")
        for rel_type, related_tables in rels.items():
            print(f"  {rel_type}: {', '.join(related_tables)}")
    
    # Análise de tabelas
    print("\nEstrutura das tabelas:")
    for table_name, table_info in db_structure["tables"].items():
        print(f"\n{table_name}:")
        
        # Encontrar chaves primárias
        pks = [col for col, info in table_info["columns"].items() 
               if info.get("primary_key")]
        print(f"  Chave(s) primária(s): {', '.join(pks)}")
        
        # Encontrar chaves estrangeiras
        fks = [(col, info["foreign_key"]) for col, info in table_info["columns"].items() 
               if info.get("foreign_key")]
        if fks:
            print("  Chaves estrangeiras:")
            for col, ref in fks:
                print(f"    {col} -> {ref}")

if __name__ == "__main__":
    # Salva a estrutura em um arquivo JSON
    save_structure()
    
    # Analisa e mostra informações sobre a estrutura
    analyze_structure()
