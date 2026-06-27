from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from app.database import get_db
from app.models import PackTier
from app.schemas import PackTierOut

router = APIRouter(prefix="/packs", tags=["packs"])


@router.get("", response_model=list[PackTierOut])
async def list_packs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PackTier).options(selectinload(PackTier.cards)))
    return result.scalars().all()
