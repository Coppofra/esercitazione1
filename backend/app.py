from flask import Flask, jsonify
from flask_cors import CORS
from DatabaseWrapper import DatabaseWrapper

app = Flask(__name__)
CORS(app)

db = DatabaseWrapper()

def get_all_grades():
    with db.connection.cursor() as cursor:
        cursor.execute("SELECT id, student_name, subject, grade, date FROM grades")
        rows = cursor.fetchall()
        grades = [
            {
                "id": row[0],
                "student_name": row[1],
                "subject": row[2],
                "grade": float(row[3]),
                "date": row[4].isoformat() if hasattr(row[4], 'isoformat') else str(row[4])
            }
            for row in rows
        ]
        return grades

@app.route('/grades', methods=['GET'])
def grades():
    return jsonify(get_all_grades())

if __name__ == '__main__':
    app.run(debug=True)
