"""
Минимальный клиент Telegram Bot API — единственная "бэкенд-часть"
проекта: пересылает ответ гостя в чат организаторам.
"""

import httpx

from .config import Settings

TELEGRAM_API_URL = "https://api.telegram.org/bot{token}/sendMessage"


class TelegramDeliveryError(RuntimeError):
    """Telegram API вернул ошибку или запрос не удался."""


async def send_rsvp_notification(settings: Settings, text: str) -> None:
    url = TELEGRAM_API_URL.format(token=settings.telegram_bot_token)
    payload = {
        "chat_id": settings.telegram_chat_id,
        "text": text,
        "parse_mode": "HTML",
    }

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            response = await client.post(url, json=payload)
        except httpx.HTTPError as exc:
            raise TelegramDeliveryError(f"Не удалось обратиться к Telegram API: {exc}") from exc

    if response.status_code != 200:
        raise TelegramDeliveryError(
            f"Telegram API ответил с ошибкой {response.status_code}: {response.text}"
        )
