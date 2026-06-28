from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from app.database import get_db
from app.models import User, Card, OwnedCard, PlacedBet
from app.schemas import (
    OwnedCardOut,
    AddOwnedCardIn,
    BalanceUpdateIn,
    BalanceOut,
    UserOut,
    PlacedBetOut,
    AddPlacedBetIn,
)

router = APIRouter(prefix="/users", tags=["users"])


async def _get_user_or_404(user_id: int, db: AsyncSession) -> User:
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    return await _get_user_or_404(user_id, db)


@router.get("/{user_id}/collection", response_model=list[OwnedCardOut])
async def list_collection(user_id: int, db: AsyncSession = Depends(get_db)):
    await _get_user_or_404(user_id, db)
    result = await db.execute(
        select(OwnedCard).options(selectinload(OwnedCard.card)).where(OwnedCard.user_id == user_id)
    )
    return result.scalars().all()


@router.post("/{user_id}/collection", response_model=OwnedCardOut)
async def add_to_collection(user_id: int, payload: AddOwnedCardIn, db: AsyncSession = Depends(get_db)):
    await _get_user_or_404(user_id, db)
    card = await db.get(Card, payload.card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    owned = OwnedCard(
        user_id=user_id,
        card_id=card.id,
        category=payload.category,
        pulled_value=card.market_value,
        current_value=card.market_value,
    )
    db.add(owned)
    await db.commit()
    await db.refresh(owned, attribute_names=["card"])
    return owned


@router.delete("/{user_id}/collection/{owned_id}")
async def remove_from_collection(user_id: int, owned_id: int, db: AsyncSession = Depends(get_db)):
    owned = await db.get(OwnedCard, owned_id)
    if not owned or owned.user_id != user_id:
        raise HTTPException(status_code=404, detail="Owned card not found")
    await db.delete(owned)
    await db.commit()
    return {"status": "ok"}


@router.patch("/{user_id}/balance", response_model=BalanceOut)
async def update_balance(user_id: int, payload: BalanceUpdateIn, db: AsyncSession = Depends(get_db)):
    user = await _get_user_or_404(user_id, db)
    user.balance += payload.delta
    await db.commit()
    return user


@router.get("/{user_id}/bets", response_model=list[PlacedBetOut])
async def list_placed_bets(user_id: int, db: AsyncSession = Depends(get_db)):
    await _get_user_or_404(user_id, db)
    result = await db.execute(
        select(PlacedBet).where(PlacedBet.user_id == user_id).order_by(PlacedBet.placed_at.desc())
    )
    return result.scalars().all()


@router.post("/{user_id}/bets", response_model=PlacedBetOut)
async def place_bet(user_id: int, payload: AddPlacedBetIn, db: AsyncSession = Depends(get_db)):
    await _get_user_or_404(user_id, db)
    bet = PlacedBet(
        user_id=user_id,
        type=payload.type,
        legs=payload.legs,
        stake=payload.stake,
        odds=payload.odds,
        payout=payload.payout,
    )
    db.add(bet)
    await db.commit()
    await db.refresh(bet)
    return bet
