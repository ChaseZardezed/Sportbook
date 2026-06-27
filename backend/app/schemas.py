from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MarketOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    market_type: str
    data: dict


class MatchOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sport: str
    league: str
    home_team: str
    away_team: str
    start_time: datetime
    is_live: bool
    home_score: int
    away_score: int
    markets: list[MarketOut]
