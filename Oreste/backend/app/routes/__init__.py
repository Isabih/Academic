from flask import Flask
from app.models import db
from app.routes.status import status_bp
from app.routes.sensor import sensor_bp
from app.routes.auth import auth_bp  
from app.routes.soldier import bp as soldier_bp
import app.routes.soldier  # 👈 even if you already imported below, force this




def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config["JWT_SECRET_KEY"] = "super-secret"

    db.init_app(app)

    from flask_jwt_extended import JWTManager
    jwt = JWTManager(app)

    with app.app_context():
        db.create_all()

    # ✅ Register all blueprints
    app.register_blueprint(status_bp)
    app.register_blueprint(sensor_bp)
    app.register_blueprint(auth_bp)
    print("🧩 Registering soldier_bp")
    app.register_blueprint(soldier_bp)


    return app
