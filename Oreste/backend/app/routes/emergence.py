from flask import Blueprint, request, jsonify
from app.models import db, Soldier, Alert

emergence_bp = Blueprint("emergence", __name__, url_prefix="/api/emergence")


# 🔁 Hard reset: Clears emergency flag + resolves related alerts
@emergence_bp.route("/reset/hard/<string:code>", methods=["POST"])
def hard_reset_emergence(code):
    soldier = Soldier.query.filter_by(code=code).first()
    if not soldier:
        return jsonify({"error": "Soldier not found"}), 404

    # Reset emergency flag
    soldier.emergency = False

    # Mark all unresolved emergency alerts as resolved
    emergency_alerts = Alert.query.filter_by(soldier_id=soldier.id, type="emergence", resolved=False).all()
    for alert in emergency_alerts:
        alert.resolved = True

    db.session.commit()

    return jsonify({"message": f"Hard emergency reset for soldier {soldier.name}"}), 200


# 💨 Soft reset: Only resolves emergency alerts, doesn't touch soldier flag
@emergence_bp.route("/reset/soft/<string:code>", methods=["POST"])
def soft_reset_emergence(code):
    soldier = Soldier.query.filter_by(code=code).first()
    if not soldier:
        return jsonify({"error": "Soldier not found"}), 404

    # Mark all unresolved emergency alerts as resolved
    emergency_alerts = Alert.query.filter_by(soldier_id=soldier.id, type="emergence", resolved=False).all()

    if not emergency_alerts:
        return jsonify({"message": "No active emergency alerts found"}), 200

    for alert in emergency_alerts:
        alert.resolved = True

    db.session.commit()

    return jsonify({"message": f"Soft emergency reset for soldier {soldier.name}"}), 200
