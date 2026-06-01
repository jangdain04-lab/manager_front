from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from models import AnalysisLog, Alert, Zone, ZoneStaffing, ZoneDistance, EventSettings
from schemas import AnalysisCreate



def calculate_risk_level(density: float, speed: float) -> str:
    if density >= 5 or speed <= 0.4:
        return "danger"
    elif density >= 4 or speed <= 0.7:
        return "warning"
    elif density >= 3:
        return "warning"
    else:
        return "safe"


def convert_cv_status_to_risk_level(cv_status: str | None):
    if cv_status is None:
        return None

    normalized_status = cv_status.upper()

    if "DANGER" in normalized_status:
        return "danger"
    elif "CAUTION" in normalized_status:
        return "warning"
    elif "NORMAL" in normalized_status:
        return "safe"

    return None

def create_analysis_log(db: Session, data: AnalysisCreate):
    previous_log = get_previous_analysis_log(db, data.zone_id)

    previous_risk_level = None
    if previous_log:
        previous_risk_level = previous_log.risk_level

    cv_risk_level = convert_cv_status_to_risk_level(data.cv_status)

    if cv_risk_level is not None:
        current_risk_level = cv_risk_level
    else:
        current_risk_level = calculate_risk_level(data.density, data.speed)

    db_log = AnalysisLog(
        zone_id=data.zone_id,
        people_count=data.people_count,
        density=data.density,
        speed=data.speed,
        slope=data.slope,
        risk_level=current_risk_level,
        cv_status=data.cv_status,
        risk_score=data.risk_score,
        m_per_person=data.m_per_person
    )

    db.add(db_log)

    if current_risk_level in ["warning", "danger"]:
        already_alerted = has_recent_same_alert(
            db=db,
            zone_id=data.zone_id,
            risk_level=current_risk_level,
            seconds=60
        )

        if not already_alerted:
            alert_message = f"{data.zone_id} 구역 {current_risk_level} 단계 발생"

            db_alert = Alert(
                zone_id=data.zone_id,
                risk_level=current_risk_level,
                message=alert_message
            )

            db.add(db_alert)

    if previous_risk_level in ["warning", "danger"] and current_risk_level in ["safe", "caution"]:
        clear_message = f"{data.zone_id} 구역 위험 해제"

        db_clear_alert = Alert(
            zone_id=data.zone_id,
            risk_level="clear",
            message=clear_message
        )

        db.add(db_clear_alert)

    db.commit()
    db.refresh(db_log)

    return db_log


def get_all_analysis_logs(db: Session):
    return db.query(AnalysisLog).order_by(AnalysisLog.created_at.desc()).all()


def get_latest_by_zone(db: Session, zone_id: str):
    return (
        db.query(AnalysisLog)
        .filter(AnalysisLog.zone_id == zone_id)
        .order_by(AnalysisLog.created_at.desc())
        .first()
    )

def get_all_analysis_logs(db: Session):
    return db.query(AnalysisLog).order_by(AnalysisLog.created_at.desc()).all()


def get_latest_by_zone(db: Session, zone_id: str):
    return (
        db.query(AnalysisLog)
        .filter(AnalysisLog.zone_id == zone_id)
        .order_by(AnalysisLog.created_at.desc())
        .first()
    )

def get_current_status_all_zones(db: Session):
    subquery = (
        db.query(
            AnalysisLog.zone_id,
            func.max(AnalysisLog.created_at).label("latest_time")
        )
        .group_by(AnalysisLog.zone_id)
        .subquery()
    )

    return (
        db.query(AnalysisLog)
        .join(
            subquery,
            (AnalysisLog.zone_id == subquery.c.zone_id)
            & (AnalysisLog.created_at == subquery.c.latest_time)
        )
        .order_by(AnalysisLog.zone_id.asc())
        .all()
    )

def get_all_alerts(db: Session):
    return db.query(Alert).order_by(Alert.created_at.desc()).all()


def create_manual_alerts(db: Session, data):
    target_zones = ["all"] if data.target_mode == "all" else data.target_zones
    risk_level = "danger" if data.message_type == "evacuate" else "warning"
    alerts = []

    for zone_id in target_zones:
        alert = Alert(
            zone_id=zone_id,
            risk_level=risk_level,
            message=data.message
        )
        db.add(alert)
        alerts.append(alert)

    db.commit()

    for alert in alerts:
        db.refresh(alert)

    return alerts

def has_recent_same_alert(
    db: Session,
    zone_id: str,
    risk_level: str,
    seconds: int = 60
) -> bool:
    recent_time = datetime.now() - timedelta(seconds=seconds)

    recent_alert = (
        db.query(Alert)
        .filter(Alert.zone_id == zone_id)
        .filter(Alert.risk_level == risk_level)
        .filter(Alert.created_at >= recent_time)
        .first()
    )

    return recent_alert is not None

def mark_alert_as_read(db: Session, alert_id: int):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()

    if alert is None:
        return None

    alert.is_read = 1
    db.commit()
    db.refresh(alert)

    return alert

def get_unread_alerts(db: Session):
    return (
        db.query(Alert)
        .filter(Alert.is_read == 0)
        .order_by(Alert.created_at.desc())
        .all()
    )

def get_previous_analysis_log(db: Session, zone_id: str):
    return (
        db.query(AnalysisLog)
        .filter(AnalysisLog.zone_id == zone_id)
        .order_by(AnalysisLog.created_at.desc())
        .first()
    )

def create_zone(db: Session, zone_data):
    existing_zone = (
        db.query(Zone)
        .filter(Zone.zone_id == zone_data.zone_id)
        .first()
    )

    if existing_zone:
        return existing_zone

    db_zone = Zone(
        zone_id=zone_data.zone_id,
        zone_name=zone_data.zone_name,
        latitude=zone_data.latitude,
        longitude=zone_data.longitude,
        description=zone_data.description
    )

    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)

    return db_zone


def get_all_zones(db: Session):
    return db.query(Zone).order_by(Zone.zone_id.asc()).all()


def normalize_frontend_risk_level(risk_level: str | None) -> str:
    if risk_level == "danger":
        return "danger"
    if risk_level in ["warning", "caution"]:
        return "warning"
    if risk_level == "safe":
        return "safe"
    return "unknown"


def get_map_current_status(db: Session):
    zones = db.query(Zone).order_by(Zone.zone_id.asc()).all()

    result = []

    for zone in zones:
        latest_log = (
            db.query(AnalysisLog)
            .filter(AnalysisLog.zone_id == zone.zone_id)
            .order_by(AnalysisLog.created_at.desc())
            .first()
        )

        if latest_log:
            risk_level = normalize_frontend_risk_level(latest_log.risk_level)

            result.append({
                "zone_id": zone.zone_id,
                "zone_name": zone.zone_name,
                "latitude": zone.latitude,
                "longitude": zone.longitude,
                "description": zone.description,
                "people_count": latest_log.people_count,
                "density": latest_log.density,
                "speed": latest_log.speed,
                "slope": latest_log.slope,
                "risk_level": risk_level,
                "updated_at": latest_log.created_at
            })
        else:
            result.append({
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
            })

    return result


def get_live_zones_for_frontend(db: Session):
    zones = get_map_current_status(db)

    result = []

    for zone in zones:
        risk_level = normalize_frontend_risk_level(zone["risk_level"])
        people_count = zone["people_count"] if zone["people_count"] is not None else 0

        result.append({
            "zone_id": zone["zone_id"],
            "zone_name": zone["zone_name"],
            "name": zone["zone_name"],
            "latitude": zone["latitude"],
            "longitude": zone["longitude"],
            "description": zone["description"],
            "people_count": zone["people_count"],
            "count": people_count,
            "density": zone["density"],
            "speed": zone["speed"],
            "slope": zone["slope"],
            "risk_level": risk_level,
            "level": risk_level,
            "status": risk_level,
            "updated_at": zone["updated_at"]
        })

    return result

def calculate_risk_score(risk_level: str, density: float | None, speed: float | None) -> float:
    if risk_level == "danger":
        base_score = 0.9
    elif risk_level == "warning":
        base_score = 0.7
    elif risk_level == "caution":
        base_score = 0.4
    elif risk_level == "safe":
        base_score = 0.1
    else:
        base_score = 0.0

    density_score = 0.0
    speed_score = 0.0

    if density is not None:
        density_score = min(density / 5.0, 1.0)

    if speed is not None:
        speed_score = max(0.0, min((1.2 - speed) / 1.2, 1.0))

    final_score = max(base_score, density_score, speed_score)

    return round(final_score, 2)

def get_zone_heatmap_data(db: Session):
    zones = db.query(Zone).order_by(Zone.zone_id.asc()).all()

    result = []

    for zone in zones:
        latest_log = (
            db.query(AnalysisLog)
            .filter(AnalysisLog.zone_id == zone.zone_id)
            .order_by(AnalysisLog.created_at.desc())
            .first()
        )

        if latest_log:
            risk_level = normalize_frontend_risk_level(latest_log.risk_level)
            risk_score = calculate_risk_score(
                risk_level=risk_level,
                density=latest_log.density,
                speed=latest_log.speed
            )

            result.append({
                "zone_id": zone.zone_id,
                "zone_name": zone.zone_name,
                "latitude": zone.latitude,
                "longitude": zone.longitude,
                "risk_level": risk_level,
                "risk_score": risk_score,
                "people_count": latest_log.people_count,
                "density": latest_log.density,
                "speed": latest_log.speed,
                "updated_at": latest_log.created_at
            })

        else:
            result.append({
                "zone_id": zone.zone_id,
                "zone_name": zone.zone_name,
                "latitude": zone.latitude,
                "longitude": zone.longitude,
                "risk_level": "unknown",
                "risk_score": 0.0,
                "people_count": None,
                "density": None,
                "speed": None,
                "updated_at": None
            })

    return result

def risk_level_to_number(risk_level: str | None) -> int:
    if risk_level == "danger":
        return 3
    elif risk_level in ["warning", "caution"]:
        return 2
    elif risk_level == "safe":
        return 1
    return 1


def upsert_staffing(db: Session, data):
    staffing = (
        db.query(ZoneStaffing)
        .filter(ZoneStaffing.zone_id == data.zone_id)
        .first()
    )

    if staffing:
        staffing.current_staff = data.current_staff
    else:
        staffing = ZoneStaffing(
            zone_id=data.zone_id,
            current_staff=data.current_staff
        )
        db.add(staffing)

    db.commit()
    db.refresh(staffing)
    return staffing


def get_all_staffing(db: Session):
    return db.query(ZoneStaffing).order_by(ZoneStaffing.zone_id.asc()).all()


def create_zone_distance(db: Session, data):
    distance = ZoneDistance(
        from_zone_id=data.from_zone_id,
        to_zone_id=data.to_zone_id,
        distance_m=data.distance_m
    )

    db.add(distance)
    db.commit()
    db.refresh(distance)

    return distance


def get_default_event_settings():
    return {
        "eventRange": "인하대학교 축제 구역",
        "searchPlace": "인하대학교",
        "placeDisplayName": "인하대학교 축제",
        "cctvLocations": [
            "백년관 버정길 CCTV",
            "자연과학대 앞 CCTV",
            "공대 흡연부스 옆 CCTV",
            "인경관 주차장 입구 CCTV",
            "공대-백년관 사이 CCTV",
            "백년관 잔디구장 CCTV",
        ],
        "placeNames": [
            "백년관 버정길",
            "자연과학대 앞",
            "공대 흡연부스 옆",
            "인경관 주차장 입구",
            "공대-백년관 사이",
            "백년관 잔디구장",
        ],
        "roadAngles": ["90", "75", "60", "80", "70", "85"],
        "roadAreas": ["120", "180", "145", "160", "135", "200"],
    }


def event_settings_to_response(settings: EventSettings):
    return {
        "id": settings.id,
        "eventRange": settings.event_range,
        "searchPlace": settings.search_place,
        "placeDisplayName": settings.place_display_name,
        "cctvLocations": settings.cctv_locations,
        "placeNames": settings.place_names,
        "roadAngles": settings.road_angles,
        "roadAreas": settings.road_areas,
        "created_at": settings.created_at,
        "updated_at": settings.updated_at,
    }


def get_current_event_settings(db: Session):
    settings = (
        db.query(EventSettings)
        .order_by(EventSettings.id.asc())
        .first()
    )

    if settings:
        return event_settings_to_response(settings)

    defaults = get_default_event_settings()
    settings = EventSettings(
        event_range=defaults["eventRange"],
        search_place=defaults["searchPlace"],
        place_display_name=defaults["placeDisplayName"],
        cctv_locations=defaults["cctvLocations"],
        place_names=defaults["placeNames"],
        road_angles=defaults["roadAngles"],
        road_areas=defaults["roadAreas"],
    )

    db.add(settings)
    db.commit()
    db.refresh(settings)

    return event_settings_to_response(settings)


def upsert_event_settings(db: Session, data):
    settings = (
        db.query(EventSettings)
        .order_by(EventSettings.id.asc())
        .first()
    )

    if settings is None:
        settings = EventSettings(
            event_range=data.eventRange,
            search_place=data.searchPlace,
            place_display_name=data.placeDisplayName,
            cctv_locations=data.cctvLocations,
            place_names=data.placeNames,
            road_angles=data.roadAngles,
            road_areas=data.roadAreas,
        )
        db.add(settings)
    else:
        settings.event_range = data.eventRange
        settings.search_place = data.searchPlace
        settings.place_display_name = data.placeDisplayName
        settings.cctv_locations = data.cctvLocations
        settings.place_names = data.placeNames
        settings.road_angles = data.roadAngles
        settings.road_areas = data.roadAreas

    db.commit()
    db.refresh(settings)

    return event_settings_to_response(settings)


def get_distance_between_zones(db: Session, from_zone_id: str, to_zone_id: str) -> float:
    distance = (
        db.query(ZoneDistance)
        .filter(ZoneDistance.from_zone_id == from_zone_id)
        .filter(ZoneDistance.to_zone_id == to_zone_id)
        .first()
    )

    if distance:
        return distance.distance_m

    reverse_distance = (
        db.query(ZoneDistance)
        .filter(ZoneDistance.from_zone_id == to_zone_id)
        .filter(ZoneDistance.to_zone_id == from_zone_id)
        .first()
    )

    if reverse_distance:
        return reverse_distance.distance_m

    return 999999.0


def get_min_required_staff(risk_level: str) -> int:
    if risk_level == "danger":
        return 2
    elif risk_level in ["warning", "caution"]:
        return 1
    else:
        return 0


def calculate_relocation_cost(
    distance_m: float,
    current_risk_number: int,
    predicted_risk_number: int,
    w_dist: float = 1,
    w_danger: float = 3,
    w_predict: float = 2
) -> float:
    return (
        distance_m * w_dist
        - current_risk_number * w_danger
        - predicted_risk_number * w_predict
    )


def recommend_staff_relocation(db: Session):
    zones = db.query(Zone).order_by(Zone.zone_id.asc()).all()

    supply_zones = []
    demand_zones = []

    for zone in zones:
        latest_log = get_latest_by_zone(db, zone.zone_id)

        if latest_log:
            risk_level = latest_log.risk_level
            current_risk_number = risk_level_to_number(risk_level)

            if latest_log.risk_score is not None:
                predicted_risk_number = max(1, min(3, round(latest_log.risk_score * 3)))
            else:
                predicted_risk_number = current_risk_number
        else:
            risk_level = "safe"
            current_risk_number = 1
            predicted_risk_number = 1

        staffing = (
            db.query(ZoneStaffing)
            .filter(ZoneStaffing.zone_id == zone.zone_id)
            .first()
        )

        current_staff = staffing.current_staff if staffing else 0
        min_required_staff = get_min_required_staff(risk_level)

        diff = current_staff - min_required_staff

        if diff > 0:
            supply_zones.append({
                "zone_id": zone.zone_id,
                "supply": diff
            })
        elif diff < 0:
            demand_zones.append({
                "zone_id": zone.zone_id,
                "demand": abs(diff),
                "current_risk_number": current_risk_number,
                "predicted_risk_number": predicted_risk_number
            })

    total_supply = sum(zone["supply"] for zone in supply_zones)
    total_demand = sum(zone["demand"] for zone in demand_zones)
    flow_amount = min(total_supply, total_demand)

    if flow_amount == 0:
        return {
            "total_supply": total_supply,
            "total_demand": total_demand,
            "flow_amount": flow_amount,
            "shortage": max(0, total_demand - total_supply),
            "recommendations": [],
            "message": "재배치가 필요하지 않습니다."
        }

    possible_moves = []

    for supply in supply_zones:
        for demand in demand_zones:
            distance_m = get_distance_between_zones(
                db,
                supply["zone_id"],
                demand["zone_id"]
            )

            cost = calculate_relocation_cost(
                distance_m=distance_m,
                current_risk_number=demand["current_risk_number"],
                predicted_risk_number=demand["predicted_risk_number"]
            )

            possible_moves.append({
                "from_zone_id": supply["zone_id"],
                "to_zone_id": demand["zone_id"],
                "distance_m": distance_m,
                "cost": cost
            })

    possible_moves.sort(key=lambda x: x["cost"])

    remaining_supply = {
        zone["zone_id"]: zone["supply"]
        for zone in supply_zones
    }

    remaining_demand = {
        zone["zone_id"]: zone["demand"]
        for zone in demand_zones
    }

    recommendations = []

    for move in possible_moves:
        from_zone_id = move["from_zone_id"]
        to_zone_id = move["to_zone_id"]

        available_supply = remaining_supply[from_zone_id]
        needed_demand = remaining_demand[to_zone_id]

        if available_supply <= 0 or needed_demand <= 0:
            continue

        move_staff_count = min(available_supply, needed_demand)

        recommendations.append({
            "from_zone_id": from_zone_id,
            "to_zone_id": to_zone_id,
            "move_staff_count": move_staff_count,
            "distance_m": move["distance_m"],
            "cost": round(move["cost"], 2)
        })

        remaining_supply[from_zone_id] -= move_staff_count
        remaining_demand[to_zone_id] -= move_staff_count

    shortage = max(0, total_demand - total_supply)

    if shortage > 0:
        message = f"재배치 추천 완료. 단, {shortage}명의 추가 인력이 부족합니다."
    else:
        message = "재배치 추천 완료. 모든 수요를 충족할 수 있습니다."

    return {
        "total_supply": total_supply,
        "total_demand": total_demand,
        "flow_amount": flow_amount,
        "shortage": shortage,
        "recommendations": recommendations,
        "message": message
    }
