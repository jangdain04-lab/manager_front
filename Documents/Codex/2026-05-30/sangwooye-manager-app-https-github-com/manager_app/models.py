from sqlalchemy import Column, Integer, Float, String, DateTime, JSON
from sqlalchemy.sql import func
from database import Base


class AnalysisLog(Base):
    __tablename__ = "analysis_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    zone_id = Column(String(50), nullable=False)
    people_count = Column(Integer, nullable=False)
    density = Column(Float, nullable=False)
    speed = Column(Float, nullable=False)
    slope = Column(Float, nullable=True)

    risk_level = Column(String(20), nullable=False)

    cv_status = Column(String(50), nullable=True)
    risk_score = Column(Float, nullable=True)
    m_per_person = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Alert(Base):
    __tablename__ = "alerts"


    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    zone_id = Column(String(50), nullable=False)
    risk_level = Column(String(20), nullable=False)
    message = Column(String(255), nullable=False)
    is_read = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Zone(Base):
    __tablename__ = "zones"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    zone_id = Column(String(50), unique=True, nullable=False)
    zone_name = Column(String(100), nullable=False)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    description = Column(String(255), nullable=True)

class ZoneStaffing(Base):
    __tablename__ = "zone_staffing"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    zone_id = Column(String(50), unique=True, nullable=False)
    current_staff = Column(Integer, nullable=False, default=0)


class ZoneDistance(Base):
    __tablename__ = "zone_distances"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    from_zone_id = Column(String(50), nullable=False)
    to_zone_id = Column(String(50), nullable=False)
    distance_m = Column(Float, nullable=False)


class EventSettings(Base):
    __tablename__ = "event_settings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    event_range = Column(String(255), nullable=False, default="")
    search_place = Column(String(100), nullable=False, default="")
    place_display_name = Column(String(100), nullable=False, default="")

    cctv_locations = Column(JSON, nullable=False)
    place_names = Column(JSON, nullable=False)
    road_angles = Column(JSON, nullable=False)
    road_areas = Column(JSON, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
