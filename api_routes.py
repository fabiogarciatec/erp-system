from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from omie_api import OmieAPI
from src.models.user import User
from src.db.connection import db, get_db
import os

# Configura o caminho correto para os templates
template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
app = Flask(__name__, template_folder=template_dir)

# Habilita CORS para todas as rotas
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Atualizando a string de conexão para o banco de dados MySQL remoto
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Fatec555133@207.180.249.172:3306/erp_fatec'

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

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email e senha são obrigatórios'}), 400

    db = next(get_db())  # Obtém a sessão do banco de dados
    user = User.get_by_email(db, email)

    if not user:
        return jsonify({'message': 'Email ou senha inválidos'}), 401

    # Verifica a senha
    if not user.check_password(password):
        return jsonify({'message': 'Email ou senha inválidos'}), 401

    # Retorna apenas o usuário e um token fictício
    return jsonify({
        'token': 'fake-jwt-token',
        'user': {
            'id': user.id,
            'email': user.email
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
