from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, Employee
from flask import request, jsonify

auth_bp = Blueprint("auth", __name__)


# User Registration
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    print(data)
    if Employee.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 400

    new_user = Employee(
        first_name=data["first_name"],
        last_name=data["last_name"],
        dob=data["dob"],
        gender=data["gender"],
        address=data["address"],
        email=data["email"],
        phone_number=data["phone_number"],
        hire_date=data["hire_date"],
        role=data["role"],
        department=data["department"],
        salary=data["salary"],
        username=data["username"]
    )
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


# User Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = Employee.query.filter_by(username=data["username"]).first()

    if user and user.check_password(data["password"]):
        token = user.generate_token()
        return jsonify({"token": token, "role": user.role,"id": user.id}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401


# Protected Route (Example)
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = Employee.query.get(user_id)

    if user:
        return jsonify({
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role
        }), 200
    else:
        return jsonify({"error": "User not found"}), 404



employee_bp = Blueprint("employee", __name__)

# Get all employees (HR only)
@employee_bp.route("/employees", methods=["GET"])
@jwt_required()
def get_employees():
    """Allows HR to retrieve all employees."""

    user_identity = get_jwt_identity()
    print("JWT Identity:", user_identity)  # Debugging: Check JWT structure

    # Extract user_id correctly
    if isinstance(user_identity, dict):
        user_id = user_identity.get("id")  # Adjust key if needed
    else:
        user_id = user_identity  # Direct ID if it's not a dictionary

    if not user_id:
        return jsonify({"error": "Invalid JWT token"}), 401

    user = Employee.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.role != "HR":
        return jsonify({"error": "Unauthorized"}), 403  # Only HR can access all employees

    employees = Employee.query.all()

    employee_list = [{
        "id": emp.id,
        "first_name": emp.first_name,
        "last_name": emp.last_name,
        "email": emp.email,
        "phone_number": emp.phone_number,
        "department": emp.department,
        "role": emp.role,
        "salary": emp.salary,
        "gender": emp.gender,
        "address": emp.address,
        "hire_date": emp.hire_date
    } for emp in employees]

    return jsonify(employee_list), 200

#Employee can see details
@employee_bp.route("/employee", methods=["GET"])
@jwt_required()
def get_employee():
    identity = get_jwt_identity()  # Returns {"id": 1, "role": "Employee"}
    user_id = identity.get("id")  # Extract only the ID

    employee = Employee.query.get(user_id)  # Now it's the correct format!

    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    return jsonify({
        "first_name": employee.first_name,
        "last_name": employee.last_name,
        # "email": employee.email,
        "phone_number": employee.phone_number,
        "department": employee.department,
        "salary": employee.salary,
        "gender": employee.gender,
        "address": employee.address,
        "hire_date": str(employee.hire_date),
        # "role": employee.role

    }), 200






from flask import request, jsonify


@employee_bp.route("/employee", methods=["PUT"])
@jwt_required()
def update_employee():
    """Allows HR to update any employee & Employees to update only their details"""

    user_identity = get_jwt_identity()
    print("JWT Identity:", user_identity)  # Debugging: Check the structure

    # Extract user_id correctly
    if isinstance(user_identity, dict):
        user_id = user_identity.get("id")  # Adjust key if needed
    else:
        user_id = user_identity  # Direct ID if it's not a dictionary

    if not user_id:
        return jsonify({"error": "Invalid JWT token"}), 401

    user = Employee.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    employee_id = data.get("id")  # Extract employee ID from request body

    # Employees should only update themselves
    if user.role == "Employee":
        employee_id = user.id

    if not employee_id:
        return jsonify({"error": "Employee ID is required"}), 400

    employee = Employee.query.get(employee_id)

    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    # HR can update all fields except password
    if user.role == "HR":
        employee.first_name = data.get("first_name", employee.first_name)
        employee.last_name = data.get("last_name", employee.last_name)
        employee.phone_number = data.get("phone_number", employee.phone_number)
        employee.department = data.get("department", employee.department)
        employee.email = data.get("email", employee.email)
        employee.salary = data.get("salary", employee.salary)
        employee.gender = data.get("gender", employee.gender)
        employee.address = data.get("address", employee.address)
        employee.hire_date = data.get("hire_date", employee.hire_date)
        employee.role = data.get("role", employee.role)

    # Employees can update only their own phone number and address
    elif user.id == employee.id:
        employee.first_name = data.get("first_name", employee.first_name)
        employee.last_name = data.get("last_name", employee.last_name)
        # employee.email = data.get("email", employee.email)
        employee.phone_number = data.get("phone_number", employee.phone_number)
        employee.department = data.get("department", employee.department)
        employee.salary = data.get("salary", employee.salary)
        employee.gender = data.get("gender", employee.gender)
        employee.address = data.get("address", employee.address)
        employee.hire_date = data.get("hire_date", employee.hire_date)
        # employee.role = data.get("role", employee.role)

    db.session.commit()
    return jsonify({"message": "Employee updated successfully"}), 200


# Delete Employee (HR only)
@employee_bp.route("/employee/<int:employee_id>", methods=["DELETE"])
@jwt_required()
def delete_employee(employee_id):
    """Allows only HR to delete employees"""
    user_identity = get_jwt_identity()

    # Extract user_id correctly
    if isinstance(user_identity, dict):
        user_id = user_identity.get("id")  # Adjust key if needed
    else:
        user_id = user_identity  # Direct ID if it's not a dictionary

    if not user_id:
        return jsonify({"error": "Invalid JWT token"}), 401

    user = Employee.query.get(user_id)

    if not user or user.role != "HR":
        return jsonify({"error": "Unauthorized"}), 403  # Only HR can delete employees

    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    db.session.delete(employee)
    db.session.commit()
    return jsonify({"message": "Employee deleted successfully"}), 200


