# status.py
from flask import Blueprint, request, jsonify
from app.models import Soldier
from app import db
from datetime import datetime

status_bp = Blueprint('status', __name__, url_prefix='/api/status')

@status_bp.route("/update", methods=["POST"])
def update_soldier_status():
    data = request.get_json()
    jacket_code = data.get("jacket_code")

    soldier = Soldier.query.filter_by(jacket_code=jacket_code).first()
    if not soldier:
        return jsonify({"message": "Soldier not found"}), 404

    # Update fields
    soldier.heartbeat = data.get("heartbeat")
    soldier.temperature = data.get("temperature")
    soldier.fallen = data.get("fallen")
    soldier.impact = data.get("impact")
    soldier.lat = data.get("lat")
    soldier.lng = data.get("lng")
    soldier.last_updated = datetime.utcnow()

    db.session.commit()
    return jsonify({"message": "Soldier status updated successfully"}), 200

@status_bp.route("/latest", methods=["GET"])
def get_latest_status():
    soldier = Soldier.query.order_by(Soldier.last_updated.desc()).first()
    if not soldier:
        return jsonify({"message": "No soldier data available"}), 404

    return jsonify({
        "id": soldier.id,
        "name": soldier.name,
        "rank": soldier.rank,
        "battalion": soldier.battalion,
        "code": soldier.code,
        "jacketCode": soldier.jacket_code,
        "temperature": soldier.temperature,
        "heartbeat": soldier.heartbeat,
        "fallen": soldier.fallen,
        "impact": soldier.impact,
        "lat": soldier.lat,
        "lng": soldier.lng,
        "status": soldier.status.value if soldier.status else "Unknown",
        "last_updated": soldier.last_updated.isoformat() if soldier.last_updated else None
    }), 200

