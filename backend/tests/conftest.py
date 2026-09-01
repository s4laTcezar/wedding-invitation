import os

# Тестовые значения переменных окружения, чтобы Settings() не падал
# при импорте приложения без файла .env.
os.environ.setdefault("TELEGRAM_BOT_TOKEN", "test-token")
os.environ.setdefault("TELEGRAM_CHAT_ID", "12345")
