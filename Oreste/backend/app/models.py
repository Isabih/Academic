from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


# ✅ Enum for soldier status
class SoldierStatus(Enum):
    ACTIVE = "Active"
    INJURED = "Injured"
    RETIRED = "Retired"
    FALLEN = "Fallen"

# ✅ Soldier Model
class Soldier(db.Model):
    __tablename__ = 'soldiers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    rank = db.Column(db.String(50), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    battalion = db.Column(db.String(50), nullable=False)

    # Identification
    code = db.Column(db.String(50), unique=True, nullable=False)
    jacket_code = db.Column(db.String(50), unique=True, nullable=False)

    # Health and sensors
    temperature = db.Column(db.Float, nullable=True)
    heartbeat = db.Column(db.Integer, nullable=True)
    fallen = db.Column(db.Boolean, default=False)
    impact = db.Column(db.Boolean, default=False)
    emergency = db.Column(db.Boolean, default=False) 

    # Location
    lat = db.Column(db.Float, nullable=True)
    lng = db.Column(db.Float, nullable=True)

    # Other attributes
    disability = db.Column(db.String(100), nullable=True)
    status = db.Column(db.Enum(SoldierStatus), default=SoldierStatus.ACTIVE)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    alerts = db.relationship('Alert', backref='soldier', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f"<Soldier {self.name} ({self.rank})>"

# ✅ Alert Model
class Alert(db.Model):
    __tablename__ = 'alerts'

    id = db.Column(db.Integer, primary_key=True)
    soldier_id = db.Column(db.Integer, db.ForeignKey('soldiers.id'), nullable=False)
    type = db.Column(db.String(100))  # e.g., 'impact', 'low_heartbeat'
    message = db.Column(db.String(255))  # detailed alert description
    time = db.Column(db.DateTime, default=datetime.utcnow)

    # Alert location (optional)
    lat = db.Column(db.Float, nullable=True)
    lng = db.Column(db.Float, nullable=True)
    resolved = db.Column(db.Boolean, default=False)  # Add this to Alert class


    def __repr__(self):
        return f"<Alert {self.type} for Soldier ID {self.soldier_id}>"

# ✅ User Model
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin' or 'soldier'
    last_login = db.Column(db.DateTime, nullable=True)

    # 🔒 Password methods
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username} ({self.role})>"
