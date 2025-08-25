from __future__ import annotations
import os, random
from datetime import datetime, date as dt_date, time as dt_time
from typing import Optional
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from pydantic import BaseModel, EmailStr, Field, ValidationError
from dotenv import load_dotenv
from sqlalchemy.exc import IntegrityError
import traceback

load_dotenv()
app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv("DATABASE_URL") or f"sqlite:///{os.path.join(os.path.dirname(__file__), 'restaurant.db')}"
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# ---------- Models ----------
class Reservation(db.Model):
    __tablename__ = "reservations"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(40), nullable=True)     # optional now
    party_size = db.Column(db.Integer, nullable=False)
    date = db.Column(db.String(10), nullable=False)     # YYYY-MM-DD
    time = db.Column(db.String(5), nullable=False)      # HH:MM (24h)
    table_number = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default="confirmed")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ReservationIn(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    email: EmailStr
    phone: Optional[str] = None
    party_size: int = Field(..., ge=1, le=12)
    date: str
    time: str
    special_requests: Optional[str] = None

class Subscriber(db.Model):
    __tablename__ = "subscribers"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    consent = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class NewsletterIn(BaseModel):
    email: EmailStr
    consent: bool = True

# ---------- Helpers ----------
BUSINESS_HOURS = {
    "mon_sat_start": dt_time(17, 0),   # 17:00
    "mon_sat_end":   dt_time(23, 0),   # 23:00
    "sun_start":     dt_time(17, 0),
    "sun_end":       dt_time(21, 0),
}
TOTAL_TABLES = 30

def parse_slot(d_str: str, t_str: str) -> datetime:
    """Parse strings and return a datetime for the requested slot; validate 30-min increments & business hours."""
    # Parse
    try:
        d = datetime.strptime(d_str, "%Y-%m-%d").date()
        t = datetime.strptime(t_str, "%H:%M").time()
    except ValueError:
        raise ValueError("Invalid date or time format. Expected YYYY-MM-DD and HH:MM (24h).")

    # 30-minute increments
    if (t.minute % 30) != 0:
        raise ValueError("Time must be in 30-minute increments.")

    # Not in the past
    slot_dt = datetime.combine(d, t)
    if slot_dt < datetime.now():
        raise ValueError("Requested time is in the past.")

    # Business hours
    weekday = d.weekday()  # 0=Mon ... 6=Sun
    if weekday == 6:
        # Sunday
        if not (BUSINESS_HOURS["sun_start"] <= t <= BUSINESS_HOURS["sun_end"]):
            raise ValueError("Outside Sunday business hours (17:00–21:00).")
    else:
        # Mon–Sat
        if not (BUSINESS_HOURS["mon_sat_start"] <= t <= BUSINESS_HOURS["mon_sat_end"]):
            raise ValueError("Outside Mon–Sat business hours (17:00–23:00).")
    return slot_dt

with app.app_context():
    db.create_all()

# ---------- Routes ----------
@app.get("/api/reservations")
def list_reservations():
    date_q = request.args.get("date")
    q = db.session.query(Reservation)
    if date_q:
        q = q.filter(Reservation.date == date_q)
    rows = q.order_by(Reservation.created_at.desc()).all()
    data = [{
        "id": r.id,
        "name": r.name,
        "email": r.email,
        "phone": r.phone,
        "party_size": r.party_size,
        "date": r.date,
        "time": r.time,
        "table_number": r.table_number,
        "status": r.status,
        "created_at": r.created_at.isoformat()
    } for r in rows]
    return jsonify(data), 200

@app.post("/api/reservations")
def create_reservation():
    from pydantic import ValidationError
    try:
        payload = request.get_json(force=True) or {}
        data = ReservationIn(**payload).model_dump()
        slot_dt = parse_slot(data["date"], data["time"])  # validate slot

        # Count existing bookings for this slot
        existing = db.session.query(Reservation).filter(
            Reservation.date == data["date"],
            Reservation.time == data["time"]
        ).all()

        if len(existing) >= TOTAL_TABLES:
            return jsonify({"error": "This time slot is fully booked."}), 409

        # Determine free tables at this slot
        used_tables = {r.table_number for r in existing}
        all_tables = set(range(1, TOTAL_TABLES + 1))
        free_tables = sorted(list(all_tables - used_tables))
        if not free_tables:
            return jsonify({"error": "No tables available for this slot."}), 409

        table_number = random.choice(free_tables)

        r = Reservation(
            name=data["name"],
            email=data["email"],
            phone=data.get("phone"),
            party_size=data["party_size"],
            date=data["date"],
            time=data["time"],
            table_number=table_number,
            status="confirmed",
        )
        db.session.add(r)
        db.session.commit()

        return jsonify({
            "id": r.id,
            "status": r.status,
            "table_number": r.table_number,
            "message": "Reservation confirmed"
        }), 201

    except ValidationError as ve:
        return jsonify({"error": ve.errors()}), 400
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception:
        return jsonify({"error": "Could not create reservation"}), 500

@app.post("/api/newsletter")
def newsletter():
    try:
        payload = request.get_json(silent=True) or {}
        data = NewsletterIn(**payload).model_dump()

        s = Subscriber(email=data["email"], consent=bool(data.get("consent", True)))
        db.session.add(s)
        db.session.commit()
        return jsonify({"ok": True}), 201

    except ValidationError:
        return jsonify({"error": "Invalid email address."}), 400
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Already subscribed"}), 409
    except Exception:
        # See the backend console for the full stack if something unexpected happens
        print("NEWSLETTER ERROR:\n", traceback.format_exc())
        return jsonify({"error": "Subscription failed"}), 500