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
