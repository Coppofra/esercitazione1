from flask import Flask, jsonify, request
from flask_cors import CORS
from DatabaseWrapper import DatabaseWrapper
from datetime import datetime

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

def validate_grade_data(data):
    """Valida i dati di un voto"""
    errors = []
    
    # Validazione campi obbligatori
    if not data.get('student_name') or not isinstance(data.get('student_name'), str) or data.get('student_name').strip() == '':
        errors.append("student_name è obbligatorio")
    
    if not data.get('subject') or not isinstance(data.get('subject'), str) or data.get('subject').strip() == '':
        errors.append("subject è obbligatorio")
    
    if 'grade' not in data:
        errors.append("grade è obbligatorio")
    else:
        try:
            grade = float(data.get('grade'))
            if grade < 1 or grade > 10:
                errors.append("grade deve essere compreso tra 1 e 10")
        except (ValueError, TypeError):
            errors.append("grade deve essere un numero")
    
    if not data.get('date'):
        errors.append("date è obbligatorio")
    else:
        try:
            datetime.strptime(data.get('date'), '%Y-%m-%d')
        except ValueError:
            errors.append("date deve essere nel formato YYYY-MM-DD")
    
    return errors

@app.route('/grades', methods=['GET'])
def get_grades():
    return jsonify(get_all_grades())

@app.route('/grades', methods=['POST'])
def add_grade():
    data = request.get_json()
    
    # Validazione
    errors = validate_grade_data(data)
    if errors:
        return jsonify({"error": "Validazione fallita", "details": errors}), 400
    
    try:
        with db.connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO grades (student_name, subject, grade, date) VALUES (%s, %s, %s, %s)",
                (data['student_name'], data['subject'], float(data['grade']), data['date'])
            )
            db.connection.commit()
            grade_id = cursor.lastrowid
            
        return jsonify({
            "id": grade_id,
            "student_name": data['student_name'],
            "subject": data['subject'],
            "grade": float(data['grade']),
            "date": data['date']
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/grades/<int:grade_id>', methods=['PUT'])
def update_grade(grade_id):
    data = request.get_json()
    
    # Validazione
    errors = validate_grade_data(data)
    if errors:
        return jsonify({"error": "Validazione fallita", "details": errors}), 400
    
    try:
        with db.connection.cursor() as cursor:
            # Verifica che il voto esista
            cursor.execute("SELECT id FROM grades WHERE id = %s", (grade_id,))
            if not cursor.fetchone():
                return jsonify({"error": "Voto non trovato"}), 404
            
            # Aggiorna il voto
            cursor.execute(
                "UPDATE grades SET student_name = %s, subject = %s, grade = %s, date = %s WHERE id = %s",
                (data['student_name'], data['subject'], float(data['grade']), data['date'], grade_id)
            )
            db.connection.commit()
            
        return jsonify({
            "id": grade_id,
            "student_name": data['student_name'],
            "subject": data['subject'],
            "grade": float(data['grade']),
            "date": data['date']
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
