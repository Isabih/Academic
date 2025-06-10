from flask import Blueprint, request, jsonify
from flask_cors import CORS
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from datetime import datetime
import logging

from app.models import db, User, Soldier

# Enable detailed logs
logging.basicConfig(level=logging.DEBUG)

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
CORS(auth_bp)  # ✅ Enable CORS for this blueprint

# Helper: log and print for debug
def debug_log(label, data):
    logging.debug(f"{label}: {data}")
    print(f"{label}: {data}")

# ✅ Soldier Registration
@auth_bp.route("/register/soldier", methods=["POST"])
def register_soldier():
    data = request.get_json()
    debug_log("📦 Received Soldier Registration Data", data)

    # Extract fields
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    rank = data.get("rank")
    dob = data.get("dob")
    battalion = data.get("battalion")
    code = data.get("code")
    jacket_code = data.get("jacket_code")
    disability = data.get("disability")

    # Validate required fields
    required_fields = [email, password, name, rank, dob, battalion, code, jacket_code]
    if not all(required_fields):
        debug_log("⚠️ Missing required fields", required_fields)
        return jsonify({"message": "Missing required fields"}), 400

    # Check user existence
    if User.query.filter_by(username=email).first():
        debug_log("⚠️ User already exists", email)
        return jsonify({"message": "User already exists"}), 409

    if Soldier.query.filter_by(code=code).first():
        debug_log("⚠️ Soldier code already exists", code)
        return jsonify({"message": "Soldier code already exists"}), 409

    # Create and save User
    new_user = User(username=email, email=email, role="soldier")
    new_user.set_password(password)
    db.session.add(new_user)

    # Parse DOB
    try:
        dob_parsed = datetime.strptime(dob, "%Y-%m-%d")
    except ValueError:
        debug_log("⚠️ Invalid date format", dob)
        return jsonify({"message": "Invalid date format. Use YYYY-MM-DD"}), 400

    # Create and save Soldier
    new_soldier = Soldier(
        name=name,
        rank=rank,
        dob=dob_parsed,
        battalion=battalion,
        code=code,
        jacket_code=jacket_code,
        disability=disability
    )
    db.session.add(new_soldier)

    try:
        db.session.commit()
        debug_log("✅ Soldier registered", new_soldier.name)
        return jsonify({"message": "Soldier registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        debug_log("❌ DB commit failed", str(e))
        return jsonify({"message": "Internal server error"}), 500

# ✅ Admin Registration
@auth_bp.route("/register/admin", methods=["POST"])
def register_admin():
    data = request.get_json()
    debug_log("📦 Received Admin Registration Data", data)

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Missing email or password"}), 400

    if User.query.filter_by(username=email).first():
        return jsonify({"message": "User already exists"}), 409

    new_user = User(username=email, email=email, role="admin")
    new_user.set_password(password)
    db.session.add(new_user)

    try:
        db.session.commit()
        debug_log("✅ Admin registered", email)
        return jsonify({"message": "Admin registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        debug_log("❌ DB commit failed", str(e))
        return jsonify({"message": "Internal server error"}), 500
    

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('email') or data.get('username')
    password = data.get('password')

    debug_log("🔐 Login Attempt - Identifier", identifier)
    debug_log("🔐 Login Attempt - Password", password)

    user = User.query.filter_by(username=identifier).first()

    if not user or not user.check_password(password):
        debug_log("❌ Login Failed", identifier)
        return jsonify({"message": "Invalid username/email or password"}), 401

    user.last_login = datetime.utcnow()
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({
        "access_token": access_token,
        "role": user.role,
        "username": user.username,
        "email": user.email
    }), 200
