from pydantic import BaseModel, Field


class RsvpRequest(BaseModel):
    full_name: str = Field(alias="fullName", min_length=2, max_length=120)
    attending: bool
    response_text: str | None = Field(default=None, alias="responseText", max_length=500)

    model_config = {"populate_by_name": True}


class RsvpResponse(BaseModel):
    success: bool
    detail: str | None = None
