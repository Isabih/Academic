# app/routes/soldier.py

from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from ..models import db, Soldier

print("✅ soldier.py blueprint is being loaded!")

bp = Blueprint("soldier", __name__, url_prefix="/api/soldiers")


@bp.route("/", methods=["GET"])
def get_all_soldiers():
    print("📡 /api/soldiers/ endpoint hit!")
    soldiers = Soldier.query.all()
    return jsonify([
        {
            "id": s.id,
            "name": s.name,
            "rank": s.rank,
            "battalion": s.battalion,
            "code": s.code,
            "jacketCode": s.jacket_code,
            "temperature": s.temperature,
            "heartbeat": s.heartbeat,
            "fallen": s.fallen,
            "impact": s.impact,
            "lat": s.lat,
            "lng": s.lng,
            "status": s.status.value if s.status else "Unknown",
            "last_updated": s.last_updated.isoformat() if s.last_updated else None
        } for s in soldiers
    ])


@bp.route("/code/<string:code>", methods=["GET"])
def get_soldier_by_code(code):
    print(f"🔍 Searching for soldier with code: {code}")
    soldier = Soldier.query.filter_by(code=code).first()

    if not soldier:
        return jsonify({"error": "Soldier not found"}), 404

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
    })


@bp.route("/search", methods=["GET"])
def search_soldier():
    q = request.args.get('q')
    print(f"🔎 Searching soldier by query: {q}")

    soldier = Soldier.query.filter(
        or_(
            Soldier.name.ilike(f'%{q}%'),
            Soldier.code.ilike(f'%{q}%'),
            Soldier.jacket_code.ilike(f'%{q}%')
        )
    ).first()

    if soldier:
        # Determine reason for alert
        reason = None
        if soldier.impact:
            reason = "Hit Detected"
        elif soldier.fallen:
            reason = "Fall Detected"
        elif soldier.temperature and soldier.temperature > 38:
            reason = "High Temperature"
        elif soldier.heartbeat and soldier.heartbeat > 100:
            reason = "High Heartbeat"

        return jsonify({
            "id": soldier.id,
            "name": soldier.name,
            "code": soldier.code,
            "jacketCode": soldier.jacket_code,
            "temperature": soldier.temperature,
            "heartbeat": soldier.heartbeat,
            "fallen": soldier.fallen,
            "impact": soldier.impact,
            "lat": soldier.lat,
            "lng": soldier.lng,
            "status": soldier.status.value if soldier.status else "Unknown",
            "reason": reason or "None",
            "last_updated": soldier.last_updated.isoformat() if soldier.last_updated else "Unknown"
        })

    return jsonify(None), 404
