from flask import Blueprint, jsonify
from app.models import Soldier

alert_bp = Blueprint("alert", __name__, url_prefix="/api/alert")

@alert_bp.route("/<jacket_code>", methods=["GET"])
def get_alert_by_jacket(jacket_code):
    soldier = Soldier.query.filter_by(jacket_code=jacket_code).first()
    if not soldier:
        return jsonify({"message": "Soldier not found"}), 404

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
        "status": "⚠️ FALL DETECTED" if soldier.fallen else "✅ NORMAL"
    }), 200
