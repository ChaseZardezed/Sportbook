from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


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
    category: str
    name: str
    set_name: str
    card_number: str
    grade: int
    rarity: str
    market_value: float
    image_url: str | None
    stats_image_url: str | None = None
    stats: dict | None = None


class PackTierOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    name: str
    price: float
    description: str
    top_pull_text: str
    rarity_odds: dict
    # The full shared card pool for this tier's category (not just cards
    # "belonging" to this tier) - see packs.py for how this is assembled.
    cards: list[CardOut]


# Plaintext password in transit (over HTTPS in prod); auth.hash_password
# turns it into a bcrypt hash before it ever touches the DB - see routers/auth.py.
class RegisterIn(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    date_of_birth: date
    password: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters")
        return value

    @field_validator("date_of_birth")
    @classmethod
    def must_be_18(cls, value: date) -> date:
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 18:
            raise ValueError("You must be 18 or older")
        return value


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str
    last_name: str
    email: str
    balance: float


class OwnedCardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    pulled_value: float
    current_value: float
    pulled_at: datetime
    card: CardOut


class AddOwnedCardIn(BaseModel):
    card_id: int
    category: str


class BalanceUpdateIn(BaseModel):
    delta: float


class PlacedBetOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: str
    legs: list[dict]
    stake: float
    odds: float
    payout: float
    placed_at: datetime


class AddPlacedBetIn(BaseModel):
    type: str
    legs: list[dict]
    stake: float
    odds: float
    payout: float


class BalanceOut(BaseModel):
    balance: float


# Lightweight tier reference for UnopenedPackOut - avoids re-sending the
# whole pooled card list that PackTierOut carries.
class PackTierMiniOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    price: float
    category: str


class UnopenedPackOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    purchased_at: datetime
    pack_tier: PackTierMiniOut
    card: CardOut


class AddUnopenedPackIn(BaseModel):
    pack_tier_id: int
    card_id: int
    category: str


class CardHistoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    action: str
    value: float
    created_at: datetime
    card: CardOut


class AddCardHistoryIn(BaseModel):
    card_id: int
    category: str
    action: str
    value: float

    @field_validator("action")
    @classmethod
    def action_must_be_known(cls, value: str) -> str:
        if value not in ("sold", "shipped"):
            raise ValueError('action must be "sold" or "shipped"')
        return value
