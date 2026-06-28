from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import PackTier, Card
from app.schemas import PackTierOut

router = APIRouter(prefix="/packs", tags=["packs"])


@router.get("", response_model=list[PackTierOut])
async def list_packs(db: AsyncSession = Depends(get_db)):
    tiers = (await db.execute(select(PackTier))).scalars().all()
    cards = (await db.execute(select(Card))).scalars().all()

    # Cards are pooled by category and shared across every tier of that
    # category that can roll the matching rarity, rather than each tier
    # owning its own unique card list.
    cards_by_category = {}
    for card in cards:
        cards_by_category.setdefault(card.category, []).append(card)

    # Returned as plain dicts rather than the PackTier ORM objects directly,
    # since PackTierOut.cards needs to be overridden with the shared pool
    # above instead of falling back to PackTier's own `cards` relationship.
    return [
        {
            "id": tier.id,
            "name": tier.name,
            "category": tier.category,
            "price": tier.price,
            "description": tier.description,
            "top_pull_text": tier.top_pull_text,
            "rarity_odds": tier.rarity_odds,
            "cards": cards_by_category.get(tier.category, []),
        }
        for tier in tiers
    ]
