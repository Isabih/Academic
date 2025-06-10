from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate = Migrate(app, db)

    jwt = JWTManager(app)
    CORS(app, resources={r"/*": {"origins": Config.CORS_ORIGINS}})

    # Blueprints
    from app.routes.status import status_bp
    from app.routes.sensor import sensor_bp
    from app.routes.auth import auth_bp
    from app.routes.soldier import bp as soldier_bp
    from app.routes.alert import alert_bp
    from app.routes.emergence import emergence_bp

    app.register_blueprint(status_bp)
    app.register_blueprint(sensor_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(soldier_bp)
    app.register_blueprint(alert_bp)
    app.register_blueprint(emergence_bp)

    with app.app_context():
        db.create_all()

    # JWT error handlers
    @jwt.unauthorized_loader
    def unauthorized_callback(err):
        return jsonify({"error": "Missing or invalid JWT"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(err):
        return jsonify({"error": "Invalid token"}), 422

    # Global error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not Found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal Server Error"}), 500

    return app
