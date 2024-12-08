from flask import Flask, jsonify, render_template, request
from omie_api import OmieAPI
import os

# Configura o caminho correto para os templates
template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
app = Flask(__name__, template_folder=template_dir)

@app.route('/')
def index():
    return render_template('teste_omie.html')

@app.route('/api/clientes', methods=['GET'])
def get_clientes():
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('pageSize', 50, type=int)
    
    omie = OmieAPI()
    response = omie.listar_clientes(pagina=page, registros_por_pagina=page_size)
    return jsonify(response)

@app.route('/api/clientes/busca', methods=['GET'])
def search_clientes():
    query = request.args.get('q', '')
    omie = OmieAPI()
    
    # Por enquanto, vamos usar a mesma função de listagem
    # No futuro, podemos implementar uma busca específica na API Omie
    response = omie.listar_clientes(pagina=1, registros_por_pagina=50)
    
    if response['success'] and response['data']:
        # Filtrar os resultados baseado na query
        clientes = response['data']['clientes_cadastro']
        filtered = [
            c for c in clientes 
            if query.lower() in c['razao_social'].lower() or 
               query.lower() in c.get('cnpj_cpf', '').lower() or 
               query.lower() in c.get('cidade', '').lower()
        ]
        
        response['data']['clientes_cadastro'] = filtered
        response['data']['total_de_registros'] = len(filtered)
        response['data']['registros'] = len(filtered)
        
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
