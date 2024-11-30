from fastapi import APIRouter, Query
from typing import Optional
from omie_api import OmieAPI

router = APIRouter(prefix="/omie", tags=["omie"])

@router.get("/clientes")
async def get_clientes(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100)
):
    omie = OmieAPI()
    response = omie.listar_clientes(pagina=page, registros_por_pagina=page_size)
    return response

@router.get("/clientes/busca")
async def search_clientes(
    q: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100)
):
    omie = OmieAPI()
    response = omie.listar_clientes(pagina=1, registros_por_pagina=page_size)
    
    if response['success'] and response['data']:
        clientes = response['data']['clientes_cadastro']
        filtered = [
            c for c in clientes 
            if q.lower() in c['razao_social'].lower() or 
               q.lower() in c.get('cnpj_cpf', '').lower() or 
               q.lower() in c.get('cidade', '').lower()
        ]
        
        response['data']['clientes_cadastro'] = filtered
        response['data']['total_de_registros'] = len(filtered)
        response['data']['registros'] = len(filtered)
        
    return response
