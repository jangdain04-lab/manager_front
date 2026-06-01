from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List

from database import engine, Base, get_db
from schemas import (
    AnalysisCreate,
    AnalysisResponse,
    AlertCreate,
    AlertResponse,
    ZoneCreate,
    ZoneResponse,
    ZoneLiveResponse,
    ZoneMapResponse,
    ZoneHeatmapResponse,
    StaffingCreate,
    StaffingResponse,
    ZoneDistanceCreate,
    EventSettingsCreate,
    EventSettingsResponse,
    RelocationResponse
)

from crud import (
    create_analysis_log,
    get_all_analysis_logs,
    get_latest_by_zone,
    get_current_status_all_zones,
    get_all_alerts,
    create_manual_alerts,
    mark_alert_as_read,
    get_unread_alerts,
    create_zone,
    get_all_zones,
    get_live_zones_for_frontend,
    get_map_current_status,
    get_zone_heatmap_data,
    upsert_staffing,
    get_all_staffing,
    create_zone_distance,
    get_current_event_settings,
    upsert_event_settings,
    recommend_staff_relocation
)

import models

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 단계에서는 전체 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Crowd Safety Backend is running"}


@app.post("/analysis", response_model=AnalysisResponse)
def receive_analysis_data(
    data: AnalysisCreate,
    db: Session = Depends(get_db)
):
    return create_analysis_log(db, data)


@app.get("/analysis", response_model=List[AnalysisResponse])
def read_analysis_logs(db: Session = Depends(get_db)):
    return get_all_analysis_logs(db)


@app.get("/zones/{zone_id}/latest", response_model=AnalysisResponse)
def read_latest_zone_status(
    zone_id: str,
    db: Session = Depends(get_db)
):
    return get_latest_by_zone(db, zone_id)

@app.get("/zones/current", response_model=List[AnalysisResponse])
def read_current_status_all_zones(db: Session = Depends(get_db)):
    return get_current_status_all_zones(db)

@app.get("/alerts", response_model=List[AlertResponse])
def read_alerts(db: Session = Depends(get_db)):
    return get_all_alerts(db)


@app.post("/alerts", response_model=List[AlertResponse])
def send_manual_alert(
    data: AlertCreate,
    db: Session = Depends(get_db)
):
    return create_manual_alerts(db, data)


@app.get("/alerts/unread", response_model=List[AlertResponse])
def read_unread_alerts(db: Session = Depends(get_db)):
    return get_unread_alerts(db)

@app.patch("/alerts/{alert_id}/read", response_model=AlertResponse)
def read_alert(
    alert_id: int,
    db: Session = Depends(get_db)
):
    return mark_alert_as_read(db, alert_id)

@app.post("/zones", response_model=ZoneMapResponse)
def register_zone(
    zone_data: ZoneCreate,
    db: Session = Depends(get_db)
):
    zone = create_zone(db, zone_data)

    return {
        "zone_id": zone.zone_id,
        "zone_name": zone.zone_name,
        "latitude": zone.latitude,
        "longitude": zone.longitude,
        "description": zone.description,
        "people_count": None,
        "density": None,
        "speed": None,
        "slope": None,
        "risk_level": "unknown",
        "updated_at": None
    }


@app.get("/zones", response_model=List[ZoneResponse])
def read_zones(db: Session = Depends(get_db)):
    return get_all_zones(db)


@app.get("/zones/live", response_model=List[ZoneLiveResponse])
def read_live_zones(db: Session = Depends(get_db)):
    return get_live_zones_for_frontend(db)


@app.get("/zones/map/current", response_model=List[ZoneMapResponse])
def read_map_current_status(db: Session = Depends(get_db)):
    return get_map_current_status(db)

@app.get("/zones/heatmap", response_model=List[ZoneHeatmapResponse])
def read_zone_heatmap(db: Session = Depends(get_db)):
    return get_zone_heatmap_data(db)

@app.post("/staffing", response_model=StaffingResponse)
def register_staffing(
    data: StaffingCreate,
    db: Session = Depends(get_db)
):
    return upsert_staffing(db, data)


@app.get("/staffing", response_model=List[StaffingResponse])
def read_staffing(db: Session = Depends(get_db)):
    return get_all_staffing(db)


@app.post("/zone-distances")
def register_zone_distance(
    data: ZoneDistanceCreate,
    db: Session = Depends(get_db)
):
    return create_zone_distance(db, data)


@app.get("/events/current", response_model=EventSettingsResponse)
def read_current_event_settings(db: Session = Depends(get_db)):
    return get_current_event_settings(db)


@app.put("/events/current/settings", response_model=EventSettingsResponse)
def update_current_event_settings(
    data: EventSettingsCreate,
    db: Session = Depends(get_db)
):
    return upsert_event_settings(db, data)


@app.post("/events/current/onboarding", response_model=EventSettingsResponse)
def save_onboarding_event_settings(
    data: EventSettingsCreate,
    db: Session = Depends(get_db)
):
    return upsert_event_settings(db, data)


@app.get("/relocation/recommendations", response_model=RelocationResponse)
def read_relocation_recommendations(db: Session = Depends(get_db)):
    return recommend_staff_relocation(db)
