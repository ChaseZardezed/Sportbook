from passlib.context import CryptContext

# bcrypt is pinned <4.0 in requirements.txt - passlib 1.7.4's bcrypt backend
# breaks on bcrypt>=4.0 (it reads a __about__.__version__ attribute that
# newer bcrypt releases removed).
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
