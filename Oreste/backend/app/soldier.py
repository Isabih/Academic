from flask import Blueprint, request, jsonify
from app.models import db, Soldier, Alert
from datetime import datetime

sensor_bp = Blueprint("sensor", __name__, url_prefix="/api/sensor")

# ✅ Update Soldier Data
@sensor_bp.route("/update/<string:code>", methods=["POST"])
def update_soldier_data(code):
    soldier = Soldier.query.filter_by(code=code).first()
    if not soldier:
        return jsonify({"error": "Soldier not found"}), 404

    data = request.get_json()
    soldier.heartbeat = data.get("heartbeat", soldier.heartbeat)
    soldier.temperature = data.get("temperature", soldier.temperature)
    soldier.lat = data.get("lat", soldier.lat)
    soldier.lng = data.get("lng", soldier.lng)
    soldier.fallen = data.get("fallen", soldier.fallen)
    soldier.impact = data.get("impact", soldier.impact)
    soldier.last_updated = datetime.utcnow()

    db.session.commit()
    return jsonify({"message": "Soldier data updated successfully"}), 200

# ✅ Get Soldier Data
@sensor_bp.route("/get/<string:code>", methods=["GET"])
def get_soldier_data(code):
    soldier = Soldier.query.filter_by(code=code).first()
    if not soldier:
        return jsonify({"error": "Soldier not found"}), 404

    return jsonify({
        "name": soldier.name,
        "status": soldier.status.value,
        "heartbeat": soldier.heartbeat,
        "temperature": soldier.temperature,
        "impact": soldier.impact,
        "fallen": soldier.fallen,
        "emergency": soldier.emergency,  # ✅ Added
        "lat": soldier.lat,
        "lng": soldier.lng,
        "last_updated": soldier.last_updated.isoformat()
    })

# ✅ Trigger Emergency
@sensor_bp.route("/emergency/<string:code>", methods=["POST"])
def trigger_emergency(code):
    soldier = Soldier.query.filter_by(code=code).first()
    if not soldier:
        return jsonify({"error": "Soldier not found"}), 404

    soldier.emergency = True
    soldier.last_updated = datetime.utcnow()

    alert = Alert(
        soldier_id=soldier.id,
        type="emergency",
        message=f"Emergency triggered for {soldier.name}",
        lat=soldier.lat,
        lng=soldier.lng
    )
    db.session.add(alert)
    db.session.commit()

    return jsonify({"message": f"Emergency triggered for {soldier.name}"}), 200

# ✅ Reset Emergency
@sensor_bp.route("/emergency/reset/<string:code>", methods=["POST"])
def reset_emergency(code):
    soldier = Soldier.query.filter_by(code=code).first()
    if not soldier:
        return jsonify({"error": "Soldier not found"}), 404

    soldier.emergency = False
    soldier.last_updated = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": f"Emergency reset for {soldier.name}"}), 200
