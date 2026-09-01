"""
Настройки приложения. Значения читаются из переменных окружения
или файла .env (см. .env.example) через pydantic-settings.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Токен бота, выданный @BotFather
    telegram_bot_token: str
    # ID чата/группы, куда бот пришлёт ответы гостей.
    # Для личных сообщений — числовой chat_id вашего Telegram-аккаунта,
    # узнать можно, например, через бота @userinfobot.
    telegram_chat_id: str

    # Список источников (доменов фронтенда), которым разрешено
    # обращаться к API. Для локальной разработки достаточно значения
    # по умолчанию — при деплое замените на реальный домен сайта.
    cors_origins: list[str] = [
        "https://wedding-invitation-55wh.onrender.com",
    ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
