from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from app.database import get_db
from app.models import User, Card, OwnedCard, PlacedBet, UnopenedPack, CardHistory
from app.schemas import (
    OwnedCardOut,
    AddOwnedCardIn,
    BalanceUpdateIn,
    BalanceOut,
    UserOut,
    PlacedBetOut,
    AddPlacedBetIn,
    UnopenedPackOut,
    AddUnopenedPackIn,
    CardHistoryOut,
    AddCardHistoryIn,
)

# NOTE for review: there's no session/token auth on this router - any
# caller can hit /users/{user_id}/... for any id. Ownership checks below
# only guard cross-user tampering on sub-resources (e.g. deleting someone
# else's owned card), not impersonation of the user_id itself. Fine for a
# local demo; would need real auth (JWT/session) before going further.
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
    # Ownership check: a valid owned_id that belongs to a different user
    # is treated the same as "doesn't exist" rather than 403, so it doesn't
    # confirm to the caller that the id exists at all.
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


@router.get("/{user_id}/unopened-packs", response_model=list[UnopenedPackOut])
async def list_unopened_packs(user_id: int, db: AsyncSession = Depends(get_db)):
    await _get_user_or_404(user_id, db)
    result = await db.execute(
        select(UnopenedPack)
        .options(selectinload(UnopenedPack.pack_tier), selectinload(UnopenedPack.card))
        .where(UnopenedPack.user_id == user_id)
    )
    return result.scalars().all()


@router.post("/{user_id}/unopened-packs", response_model=UnopenedPackOut)
async def create_unopened_pack(user_id: int, payload: AddUnopenedPackIn, db: AsyncSession = Depends(get_db)):
    await _get_user_or_404(user_id, db)
    unopened = UnopenedPack(
        user_id=user_id,
        pack_tier_id=payload.pack_tier_id,
        card_id=payload.card_id,
        category=payload.category,
    )
    db.add(unopened)
    await db.commit()
    await db.refresh(unopened, attribute_names=["pack_tier", "card"])
    return unopened


@router.delete("/{user_id}/unopened-packs/{unopened_id}")
async def remove_unopened_pack(user_id: int, unopened_id: int, db: AsyncSession = Depends(get_db)):
    # Called once a pending pull is resolved (Sell/Keep chosen) - see
    # PackOpeningFlow.resolveUnopenedPack on the frontend.
    unopened = await db.get(UnopenedPack, unopened_id)
    if not unopened or unopened.user_id != user_id:
        raise HTTPException(status_code=404, detail="Unopened pack not found")
    await db.delete(unopened)
    await db.commit()
    return {"status": "ok"}


@router.get("/{user_id}/card-history", response_model=list[CardHistoryOut])
async def list_card_history(user_id: int, db: AsyncSession = Depends(get_db)):
    await _get_user_or_404(user_id, db)
    result = await db.execute(
        select(CardHistory)
        .options(selectinload(CardHistory.card))
        .where(CardHistory.user_id == user_id)
        .order_by(CardHistory.created_at.desc())
    )
    return result.scalars().all()


@router.post("/{user_id}/card-history", response_model=CardHistoryOut)
async def add_card_history(user_id: int, payload: AddCardHistoryIn, db: AsyncSession = Depends(get_db)):
    await _get_user_or_404(user_id, db)
    card = await db.get(Card, payload.card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    entry = CardHistory(
        user_id=user_id,
        card_id=card.id,
        category=payload.category,
        action=payload.action,
        value=payload.value,
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry, attribute_names=["card"])
    return entry
