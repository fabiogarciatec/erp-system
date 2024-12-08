import requests
import json
from config import OMIE_APP_KEY, OMIE_APP_SECRET, OMIE_API_URL

class OmieAPI:
    def __init__(self):
        self.app_key = OMIE_APP_KEY
        self.app_secret = OMIE_APP_SECRET
        self.base_url = OMIE_API_URL

    def _make_request(self, endpoint, call, params):
        """
        Método base para fazer requisições à API do Omie
        """
        url = f"{self.base_url}/{endpoint}"
        
        data = {
            "app_key": self.app_key,
            "app_secret": self.app_secret,
            "call": call,
            "param": [params]
        }

        try:
            print(f"Fazendo requisição para: {url}")
            print(f"Dados enviados: {json.dumps(data, indent=2)}")
            
            response = requests.post(url, json=data, timeout=30)
            print(f"Status code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'success': True,
                    'data': result
                }
            else:
                print(f"Erro na resposta: {response.text}")
                return {
                    'success': False,
                    'error': f'Erro HTTP {response.status_code}'
                }
                
        except Exception as e:
            print(f"Erro na requisição: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

    def listar_clientes(self, pagina=1, registros_por_pagina=50):
        """
        Lista os clientes cadastrados
        """
        return self._make_request(
            "geral/clientes/",
            "ListarClientes",
            {
                "pagina": pagina,
                "registros_por_pagina": registros_por_pagina,
                "apenas_importado_api": "N"
            }
        )

if __name__ == "__main__":
    # Teste direto da API
    omie = OmieAPI()
    response = omie.listar_clientes(pagina=1, registros_por_pagina=5)
    print("\nResposta do teste:")
    print(json.dumps(response, indent=2))
