import asyncio
from datetime import datetime, timedelta

from app.database import AsyncSessionLocal, Base, engine
from app.models import Match, Market

MATCHES = [
    {
        "sport": "NFL",
        "league": "NFL",
        "home_team": "Kansas City Chiefs",
        "away_team": "Buffalo Bills",
        "start_time": datetime.utcnow(),
        "is_live": True,
        "is_featured": True,
        "home_score": 14,
        "away_score": 10,
        "clock": "Q2 2:12",
        "markets": [
            ("moneyline", {"home": -145, "away": 125}),
            ("spread", {"home": {"line": -2.5, "odds": -110}, "away": {"line": 2.5, "odds": -110}}),
            ("total", {"line": 48.5, "over": -108, "under": -112}),
        ],
    },
    {
        "sport": "NFL",
        "league": "NFL",
        "home_team": "Philadelphia Eagles",
        "away_team": "Dallas Cowboys",
        "start_time": datetime.utcnow() + timedelta(days=1),
        "is_live": False,
        "is_featured": True,
        "home_score": 0,
        "away_score": 0,
        "markets": [
            ("moneyline", {"home": -155, "away": 135}),
            ("spread", {"home": {"line": -3.0, "odds": -110}, "away": {"line": 3.0, "odds": -110}}),
            ("total", {"line": 45.5, "over": -110, "under": -110}),
        ],
    },
    {
        "sport": "NFL",
        "league": "NFL",
        "home_team": "San Francisco 49ers",
        "away_team": "Seattle Seahawks",
        "start_time": datetime.utcnow() + timedelta(days=2),
        "is_live": False,
        "home_score": 0,
        "away_score": 0,
        "markets": [
            ("moneyline", {"home": -185, "away": 158}),
            ("spread", {"home": {"line": -4.5, "odds": -112}, "away": {"line": 4.5, "odds": -108}}),
            ("total", {"line": 43.5, "over": -115, "under": -105}),
        ],
    },
    {
        "sport": "NBA",
        "league": "NBA",
        "home_team": "Denver Nuggets",
        "away_team": "Golden State Warriors",
        "start_time": datetime.utcnow(),
        "is_live": True,
        "is_featured": True,
        "home_score": 58,
        "away_score": 61,
        "clock": "Q3 4:47",
        "markets": [
            ("moneyline", {"home": -130, "away": 110}),
            ("spread", {"home": {"line": -2.5, "odds": -110}, "away": {"line": 2.5, "odds": -110}}),
            ("total", {"line": 228.5, "over": -110, "under": -110}),
        ],
    },
    {
        "sport": "NBA",
        "league": "NBA",
        "home_team": "Boston Celtics",
        "away_team": "Miami Heat",
        "start_time": datetime.utcnow() + timedelta(days=1),
        "is_live": False,
        "home_score": 0,
        "away_score": 0,
        "markets": [
            ("moneyline", {"home": -210, "away": 175}),
            ("spread", {"home": {"line": -5.5, "odds": -108}, "away": {"line": 5.5, "odds": -112}}),
            ("total", {"line": 219.5, "over": -110, "under": -110}),
        ],
    },
    {
        "sport": "MLB",
        "league": "MLB",
        "home_team": "Boston Red Sox",
        "away_team": "New York Yankees",
        "start_time": datetime.utcnow(),
        "is_live": True,
        "home_score": 3,
        "away_score": 4,
        "clock": "Bot 7th",
        "markets": [
            ("moneyline", {"home": 105, "away": -125}),
            ("spread", {"home": {"line": 1.5, "odds": -130}, "away": {"line": -1.5, "odds": 110}}),
            ("total", {"line": 8.5, "over": -105, "under": -115}),
        ],
    },
    {
        "sport": "Soccer",
        "league": "Premier League",
        "home_team": "Arsenal",
        "away_team": "Manchester City",
        "start_time": datetime.utcnow(),
        "is_live": True,
        "is_featured": True,
        "home_score": 1,
        "away_score": 2,
        "clock": "67'",
        "markets": [
            ("moneyline", {"home": 220, "away": -120}),
            ("spread", {"home": {"line": 0.5, "odds": -105}, "away": {"line": -0.5, "odds": -115}}),
            ("total", {"line": 2.5, "over": -120, "under": 100}),
        ],
    },
    {
        "sport": "Tennis",
        "league": "ATP",
        "home_team": "Novak Djokovic",
        "away_team": "Carlos Alcaraz",
        "start_time": datetime.utcnow(),
        "is_live": True,
        "home_score": 1,
        "away_score": 1,
        "clock": "Set 2 4-4",
        "markets": [
            ("moneyline", {"home": -135, "away": 115}),
            ("spread", {"home": {"line": -1.5, "odds": 145}, "away": {"line": 1.5, "odds": -175}}),
            ("total", {"line": 22.5, "over": -110, "under": -110}),
        ],
    },
    {
        "sport": "NHL",
        "league": "NHL",
        "home_team": "Boston Bruins",
        "away_team": "New York Rangers",
        "start_time": datetime.utcnow() + timedelta(hours=6),
        "is_live": False,
        "home_score": 0,
        "away_score": 0,
        "markets": [
            ("moneyline", {"home": -150, "away": 130}),
            ("spread", {"home": {"line": -1.5, "odds": 165}, "away": {"line": 1.5, "odds": -195}}),
            ("total", {"line": 6.0, "over": -105, "under": -115}),
        ],
    },
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        for match_data in MATCHES:
            markets = match_data.pop("markets")
            match = Match(**match_data)
            session.add(match)
            await session.flush()  # assigns match.id

            for market_type, data in markets:
                session.add(Market(match_id=match.id, market_type=market_type, data=data))

        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
