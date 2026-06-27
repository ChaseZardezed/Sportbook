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
    is_featured: bool
    home_score: int
    away_score: int
    clock: str | None
    periods: dict | None
    markets: list[MarketOut]


class CardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    set_name: str
    card_number: str
    grade: int
    rarity: str
    market_value: float


class PackTierOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    price: float
    description: str
    top_pull_text: str
    rarity_odds: dict
    cards: list[CardOut]
