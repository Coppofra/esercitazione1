import pymysql
import os
from dotenv import load_dotenv

class DatabaseWrapper:
    def __init__(self):
        load_dotenv()  # Carica le variabili d'ambiente dal file .env
        self.connection = self.connect()

    def connect(self):
        try:
            connection = pymysql.connect(
                host=os.getenv('DB_HOST'),
                user=os.getenv('DB_USER'),
                password=os.getenv('DB_PASSWORD'),
                database=os.getenv('DB_NAME')
            )
            return connection
        except Exception as e:
            print(f"Error connecting to the database: {e}")
            return None

    def create_table(self):
        with self.connection.cursor() as cursor:
            cursor.execute("CREATE TABLE IF NOT EXISTS grades (\
                id INT AUTO_INCREMENT PRIMARY KEY,\
                student_name VARCHAR(255) NOT NULL,\
                subject VARCHAR(255) NOT NULL,\
                grade DECIMAL(3, 2) NOT NULL,\
                date DATE NOT NULL\
            )")
            self.connection.commit()

# Esempio di utilizzo:
# db = DatabaseWrapper()
# db.create_table()
