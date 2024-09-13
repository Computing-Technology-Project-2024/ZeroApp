from pydantic import BaseModel


class AccountDto(BaseModel):
    email: str
    password: str
