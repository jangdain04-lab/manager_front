from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class AnalysisCreate(BaseModel):
    zone_id: str
    people_count: int
    density: float
    speed: float
    slope: Optional[float] = None
    
    cv_status: Optional[str] = None
    risk_score: Optional[float] = None
    m_per_person: Optional[float] = None


class AnalysisResponse(BaseModel):
    id: int
    zone_id: str
    people_count: int
    density: float
    speed: float
    slope: Optional[float]
    risk_level: str

    cv_status: Optional[str]
    risk_score: Optional[float]
    m_per_person: Optional[float]
    
    created_at: datetime

    class Config:
        from_attributes = True

class AlertResponse(BaseModel):
    id: int
    zone_id: str
    risk_level: str
    message: str
    is_read: int
    created_at: datetime

    class Config:
        from_attributes = True

class ZoneCreate(BaseModel):
    zone_id: str
    zone_name: str
    latitude: float
    longitude: float
    description: Optional[str] = None


class ZoneMapResponse(BaseModel):
    zone_id: str
    zone_name: str
    latitude: float
    longitude: float
    description: Optional[str] = None

    people_count: Optional[int] = None
    density: Optional[float] = None
    speed: Optional[float] = None
    slope: Optional[float] = None
    risk_level: Optional[str] = None
    updated_at: Optional[datetime] = None


class ZoneResponse(BaseModel):
    zone_id: str
    zone_name: str
    latitude: float
    longitude: float
    description: Optional[str] = None

    class Config:
        from_attributes = True


class AlertCreate(BaseModel):
    target_mode: str
    target_zones: List[str] = []
    message_type: str
    message: str


class ZoneLiveResponse(BaseModel):
    zone_id: str
    zone_name: str
    name: str
    latitude: float
    longitude: float
    description: Optional[str] = None

    people_count: Optional[int] = None
    count: int
    density: Optional[float] = None
    speed: Optional[float] = None
    slope: Optional[float] = None
    risk_level: str
    level: str
    status: str
    updated_at: Optional[datetime] = None

class ZoneHeatmapResponse(BaseModel):
    zone_id: str
    zone_name: str
    latitude: float
    longitude: float

    risk_level: str
    risk_score: float

    people_count: Optional[int] = None
    density: Optional[float] = None
    speed: Optional[float] = None
    cv_status: Optional[str] = None
    m_per_person: Optional[float] = None
    updated_at: Optional[datetime] = None

class StaffingCreate(BaseModel):
    zone_id: str
    current_staff: int


class StaffingResponse(BaseModel):
    zone_id: str
    current_staff: int

    class Config:
        from_attributes = True


class ZoneDistanceCreate(BaseModel):
    from_zone_id: str
    to_zone_id: str
    distance_m: float


class EventSettingsBase(BaseModel):
    eventRange: str = ""
    searchPlace: str = ""
    placeDisplayName: str = ""
    cctvLocations: List[str] = Field(default_factory=list)
    placeNames: List[str] = Field(default_factory=list)
    roadAngles: List[str] = Field(default_factory=list)
    roadAreas: List[str] = Field(default_factory=list)


class EventSettingsCreate(EventSettingsBase):
    pass


class EventSettingsResponse(EventSettingsBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class RelocationRecommendation(BaseModel):
    from_zone_id: str
    to_zone_id: str
    move_staff_count: int
    distance_m: float
    cost: float


class RelocationResponse(BaseModel):
    total_supply: int
    total_demand: int
    flow_amount: int
    shortage: int
    recommendations: list[RelocationRecommendation]
    message: str
