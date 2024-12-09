import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
import os
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRES_IN = 24  # horas

def generate_token(user_id: str, role_id: str = None) -> str:
    """Gera um token JWT para o usuário"""
    payload = {
        'user_id': user_id,
        'role_id': role_id,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRES_IN)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> dict:
    """Verifica e decodifica um token JWT"""
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise Exception('Token expirado')
    except jwt.InvalidTokenError:
        raise Exception('Token inválido')

def token_required(f):
    """Decorator para proteger rotas que necessitam de autenticação"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Procura o token no header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token inválido'}), 401
        
        if not token:
            return jsonify({'message': 'Token não encontrado'}), 401
        
        try:
            payload = verify_token(token)
            request.user_id = payload['user_id']
            request.role_id = payload.get('role_id')
        except Exception as e:
            return jsonify({'message': str(e)}), 401
            
        return f(*args, **kwargs)
    
    return decorated
