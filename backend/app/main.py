from html import escape
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import get_settings
from .schemas import RsvpRequest, RsvpResponse
from .telegram import TelegramDeliveryError, send_rsvp_notification

app = FastAPI(title="Wedding Invitation API", version="1.0.0")

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


def build_message(payload: RsvpRequest) -> str:
    status_line = "✅ Придёт" if payload.attending else "❌ Не сможет прийти"
    lines = [
        "<b>Новый ответ на приглашение</b>",
        f"Гость: {escape(payload.full_name)}",
        status_line,
    ]
    if payload.response_text:
        lines.append(f"Ответ гостя: {escape(payload.response_text)}")
    return "\n".join(lines)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/rsvp", response_model=RsvpResponse)
async def submit_rsvp(payload: RsvpRequest) -> RsvpResponse:
    message = build_message(payload)

    try:
        await send_rsvp_notification(settings, message)
    except TelegramDeliveryError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return RsvpResponse(success=True)


# --- Отдача собранного Angular-фронтенда тем же процессом (монолит) ---
# Docker-сборка (см. Dockerfile в корне репозитория) кладёт собранный
# фронтенд в ./static рядом с этим пакетом. Локально, если запускаете
# backend отдельно без сборки фронтенда, папки не будет — тогда просто
# работают только /api/* эндпоинты, монтирование пропускается.
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="frontend")
