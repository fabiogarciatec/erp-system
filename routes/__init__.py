from .auth import auth_bp

def register_routes(app):
    """Registra todas as blueprints da aplicação"""
    app.register_blueprint(auth_bp, url_prefix='/auth')
