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
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    bets = relationship("Bet", back_populates="user")


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
