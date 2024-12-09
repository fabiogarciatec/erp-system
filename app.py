from flask import Flask, jsonify
from flask_cors import CORS
from database.connection import init_db, db
from flask_migrate import Migrate
from routes.auth import auth_bp
from models import User, Role, Company

def create_app():
    app = Flask(__name__)
    
    # Configurar CORS corretamente
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Inicializa o banco de dados
    init_db(app)
    
    # Registra os blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    
    # Rota de teste
    @app.route('/test')
    def test():
        try:
            # Tenta buscar o usuário admin
            admin = User.query.filter_by(email='admin@sistema.com').first()
            if admin:
                return jsonify({
                    'message': 'Conexão com banco de dados OK',
                    'admin_user': {
                        'id': admin.id,
                        'email': admin.email,
                        'name': admin.name
                    }
                })
            return jsonify({
                'message': 'Conexão com banco de dados OK, mas usuário admin não encontrado'
            })
        except Exception as e:
            return jsonify({
                'message': 'Erro ao conectar com banco de dados',
                'error': str(e)
            }), 500
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
