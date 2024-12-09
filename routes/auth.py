from flask import Blueprint, request, jsonify
from models.user import User
from database.connection import db
from auth.jwt_manager import generate_token
import uuid
import logging

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Dados recebidos:", data)  # Log dos dados recebidos
        
        if not data:
            print("Sem dados no request")
            return jsonify({'message': 'Dados não fornecidos'}), 400
        
        if not data.get('email') or not data.get('password'):
            print("Email ou senha não fornecidos")
            return jsonify({'message': 'Email e senha são obrigatórios'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        print("Usuário encontrado:", user.email if user else None)  # Log do usuário encontrado
        
        if not user:
            print("Usuário não encontrado")
            return jsonify({'message': 'Email ou senha inválidos'}), 401
        
        if not user.check_password(data['password']):
            print("Senha incorreta")
            return jsonify({'message': 'Email ou senha inválidos'}), 401
        
        if not user.is_active:
            print("Usuário inativo")
            return jsonify({'message': 'Usuário inativo'}), 401
        
        token = generate_token(user.id, user.role_id)
        print("Token gerado com sucesso")  # Log do token gerado
        
        response_data = {
            'token': token,
            'user': user.to_dict()
        }
        print("Resposta:", response_data)  # Log da resposta
        
        return jsonify(response_data)
        
    except Exception as e:
        print("Erro no login:", str(e))  # Log do erro
        return jsonify({
            'message': 'Erro interno no servidor',
            'error': str(e)
        }), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    required_fields = ['email', 'password', 'name']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'message': f'Campo {field} é obrigatório'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email já cadastrado'}), 400
    
    user = User(
        id=str(uuid.uuid4()),
        email=data['email'],
        name=data['name'],
        company_id=data.get('company_id'),
        role_id=data.get('role_id')
    )
    user.set_password(data['password'])
    
    try:
        db.session.add(user)
        db.session.commit()
        
        token = generate_token(user.id, user.role_id)
        
        return jsonify({
            'message': 'Usuário criado com sucesso',
            'token': token,
            'user': user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Erro ao criar usuário', 'error': str(e)}), 500
