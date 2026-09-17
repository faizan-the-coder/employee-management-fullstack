from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from routes import auth_bp, employee_bp


from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from routes import auth_bp

app = Flask(__name__)
app.config.from_object(Config)

# Initialize Extensions
db.init_app(app)
CORS(app)
jwt = JWTManager(app)






# Create database tables
with app.app_context():
    db.create_all()


# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(employee_bp, url_prefix="/api")


if __name__ == "__main__":
    app.run(debug=True)
