from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token


db = SQLAlchemy()
bcrypt = Bcrypt()

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    dob = db.Column(db.String(20), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    address = db.Column(db.Text, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String(15), unique=True, nullable=False)
    hire_date = db.Column(db.String(20), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # "HR" or "Employee"
    department = db.Column(db.String(50), nullable=False)
    salary = db.Column(db.Float, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # Hashed password

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)


    def generate_token(self):
        token = create_access_token(
            identity={"id": self.id, "role": self.role}  # Include role in the token
        )
        return token
