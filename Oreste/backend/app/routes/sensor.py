from flask import Blueprint, request, jsonify
from app.models import db, Soldier, Alert
from datetime import datetime

sensor_bp = Blueprint("sensor", __name__, url_prefix="/api/sensor")


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
    soldier.emergency = data.get("emergency", soldier.emergency)
    soldier.last_updated = datetime.utcnow()

    # Auto-create alerts for critical statuses
    if data.get("emergency"):
        db.session.add(Alert(
            soldier_id=soldier.id,
            type="emergency",
            message="Emergency signal received from soldier",
            lat=soldier.lat,
            lng=soldier.lng
        ))

    if data.get("impact"):
        db.session.add(Alert(
            soldier_id=soldier.id,
            type="impact",
            message="Impact detected",
            lat=soldier.lat,
            lng=soldier.lng
        ))

    if data.get("fallen"):
        db.session.add(Alert(
            soldier_id=soldier.id,
            type="fall",
            message="Fall detected",
            lat=soldier.lat,
            lng=soldier.lng
        ))

    db.session.commit()
    return jsonify({"message": "Soldier data updated successfully"}), 200


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
        "emergency": soldier.emergency,
        "lat": soldier.lat,
        "lng": soldier.lng,
        "last_updated": soldier.last_updated.isoformat()
    })


@sensor_bp.route("/emergency/<string:code>", methods=["POST"])
def trigger_emergency(code):
    soldier = Soldier.query.filter_by(code=code).first()
    if not soldier:
        return jsonify({"error": "Soldier not found"}), 404

    soldier.emergency = True
    soldier.last_updated = datetime.utcnow()

    db.session.add(Alert(
        soldier_id=soldier.id,
        type="emergency",
        message="Emergency manually triggered",
        lat=soldier.lat,
        lng=soldier.lng
    ))

    db.session.commit()

    print(f"\U0001F6A8 Emergency triggered for soldier: {code}")
    return jsonify({"message": f"Emergency triggered for {soldier.name}"}), 200
