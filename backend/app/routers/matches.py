from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from app.database import get_db
from app.models import Match
from app.schemas import MatchOut

router = APIRouter(prefix="/matches", tags=["matches"])


@router.get("", response_model=list[MatchOut])
async def list_matches(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Match).options(selectinload(Match.markets)))
    return result.scalars().all()
