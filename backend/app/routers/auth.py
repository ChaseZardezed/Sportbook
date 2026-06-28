from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import User
from app.schemas import RegisterIn, LoginIn, UserOut
from app.auth import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
async def register(payload: RegisterIn, db: AsyncSession = Depends(get_db)):
    # RegisterIn's validators already enforce password length and 18+ age,
    # so the only thing left to check here is email uniqueness.
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email is already registered")

    user = User(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        date_of_birth=payload.date_of_birth,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=UserOut)
async def login(payload: LoginIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    # Same error for "no such user" and "wrong password" so the response
    # doesn't leak which emails are registered.
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return user
