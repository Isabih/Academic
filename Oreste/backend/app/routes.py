from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from .models import db, User
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register/<role>', methods=['POST'])
def register(role):
    data = request.get_json()
    if role not in ["admin", "soldier"]:
        return jsonify({"message": "Invalid role"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": f"{role.capitalize()} already exists"}), 400

    hashed_password = generate_password_hash(data["password"])
    new_user = User(name=data["name"], email=data["email"], password=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": f"{role.capitalize()} registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity={"id": user.id, "role": user.role}, expires_delta=timedelta(days=1))
    return jsonify({
        "access_token": token,
        "role": user.role,
        "name": user.name
    }), 200
