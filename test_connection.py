import pymysql
from dotenv import load_dotenv
import os
from pymysql import Error

def test_mysql_connection():
    load_dotenv()
    
    try:
        connection = pymysql.connect(
            host=os.getenv('MYSQL_HOST'),
            port=int(os.getenv('MYSQL_PORT', '3306')),
            database=os.getenv('MYSQL_DATABASE'),
            user=os.getenv('MYSQL_USER'),
            password=os.getenv('MYSQL_PASSWORD')
        )

        if connection:
            print("Conectado ao servidor MySQL com sucesso!")
            
            with connection.cursor() as cursor:
                cursor.execute("SELECT VERSION()")
                version = cursor.fetchone()
                print("Versão do MySQL Server:", version[0])
                
                cursor.execute("SELECT DATABASE()")
                database = cursor.fetchone()
                print("Banco de dados atual:", database[0])
            
            return True

    except Error as e:
        print("Erro ao conectar ao MySQL:", e)
        return False
        
    finally:
        if 'connection' in locals() and connection:
            connection.close()
            print("Conexão com MySQL fechada.")

if __name__ == "__main__":
    test_mysql_connection()
