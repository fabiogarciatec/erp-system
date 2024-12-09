import os

# Configurações para o modo de desenvolvimento
os.environ['FLASK_ENV'] = 'development'
os.environ['MYSQL_HOST'] = 'localhost'
os.environ['MYSQL_USER'] = 'root'
os.environ['MYSQL_PASSWORD'] = 'Fatec555133'
os.environ['MYSQL_DATABASE'] = 'erp_fatec'
os.environ['MYSQL_PORT'] = '3306'
os.environ['JWT_SECRET_KEY'] = 'your-secret-key'  # Substitua por uma chave secreta real
