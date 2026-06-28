from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    date_of_birth = Column(DateTime, nullable=False)
    hashed_password = Column(String, nullable=False)
    balance = Column(Float, default=1000.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    bets = relationship("Bet", back_populates="user")
    owned_cards = relationship("OwnedCard", back_populates="user")
    placed_bets = relationship("PlacedBet", back_populates="user")


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True)
    sport = Column(String, nullable=False, index=True)
    league = Column(String, nullable=False)
    home_team = Column(String, nullable=False)
    away_team = Column(String, nullable=False)
    start_time = Column(DateTime, nullable=False)
    is_live = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    home_score = Column(Integer, default=0)
    away_score = Column(Integer, default=0)
    clock = Column(String, nullable=True)  # e.g. "Q2 2:12", "Bot 7th", "67'"
    # Period-by-period score, e.g. {"labels": ["Q1","Q2"], "away": [7,3], "home": [7,7]}
    periods = Column(JSON, nullable=True)

    markets = relationship("Market", back_populates="match")


class Market(Base):
    __tablename__ = "markets"

    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False)
    market_type = Column(String, nullable=False)  # e.g. "moneyline", "spread", "total"
    # Flexible payload so moneyline/spread/total odds don't each need their own table.
    data = Column(JSON, nullable=False)

    match = relationship("Match", back_populates="markets")
    bets = relationship("Bet", back_populates="market")


class Bet(Base):
    __tablename__ = "bets"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    market_id = Column(Integer, ForeignKey("markets.id"), nullable=False)
    selection = Column(String, nullable=False)
    odds = Column(Float, nullable=False)
    stake = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, won, lost, void
    placed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="bets")
    market = relationship("Market", back_populates="bets")


class PackTier(Base):
    __tablename__ = "pack_tiers"

    id = Column(Integer, primary_key=True)
    category = Column(String, nullable=False, index=True)  # e.g. "Pokemon", "Basketball"
    name = Column(String, nullable=False)  # e.g. "Bronze Raw Card"
    price = Column(Float, nullable=False)
    description = Column(String, nullable=False)
    top_pull_text = Column(String, nullable=False)  # e.g. "Eevee PSA 9 ~$45"
    # Pull odds for this tier, e.g. {"Common": 60, "Uncommon": 30, "Rare": 10}
    rarity_odds = Column(JSON, nullable=False)

    cards = relationship("Card", back_populates="pack_tier")


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True)
    pack_tier_id = Column(Integer, ForeignKey("pack_tiers.id"), nullable=False)
    name = Column(String, nullable=False)
    set_name = Column(String, nullable=False)
    card_number = Column(String, nullable=False)
    grade = Column(Integer, nullable=False)  # PSA grade
    rarity = Column(String, nullable=False)  # must match a key in pack_tier.rarity_odds
    market_value = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)  # e.g. "/cards/piplup.jpg"

    pack_tier = relationship("PackTier", back_populates="cards")


class OwnedCard(Base):
    __tablename__ = "owned_cards"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=False)
    category = Column(String, nullable=False)
    pulled_value = Column(Float, nullable=False)
    current_value = Column(Float, nullable=False)
    pulled_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="owned_cards")
    card = relationship("Card")


class PlacedBet(Base):
    __tablename__ = "placed_bets"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)  # "straight" or "parlay"
    # Snapshot of each leg, e.g. [{"matchup": "...", "label": "...", "odds": -110}]
    legs = Column(JSON, nullable=False)
    stake = Column(Float, nullable=False)
    odds = Column(Float, nullable=False)
    payout = Column(Float, nullable=False)
    placed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="placed_bets")
