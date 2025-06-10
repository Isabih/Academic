from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
from flask_jwt_extended import create_access_token
from datetime import timedelta

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register/admin", methods=["POST"])
def register_admin():
    data = request.get_json()
    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"message": "Admin already exists"}), 400

    hashed_password = generate_password_hash(data["password"])
    new_admin = User(
        name=data["name"],
        email=data["email"],
        password=hashed_password,
        role="admin"
    )
    db.session.add(new_admin)
    db.session.commit()
    return jsonify({"message": "Admin registered successfully"}), 201

@auth_bp.route("/register/soldier", methods=["POST"])
def register_soldier():
    data = request.get_json()
    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"message": "Soldier already exists"}), 400

    hashed_password = generate_password_hash(data["password"])
    new_soldier = User(
        name=data["name"],
        email=data["email"],
        password=hashed_password,
        role="soldier"
    )
    db.session.add(new_soldier)
    db.session.commit()
    return jsonify({"message": "Soldier registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(
        identity={"id": user.id, "role": user.role},
        expires_delta=timedelta(days=1)
    )
    return jsonify({
        "token": access_token,
        "user": {"id": user.id, "name": user.name, "role": user.role}
    }), 200
