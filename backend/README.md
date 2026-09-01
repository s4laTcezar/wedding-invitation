# Backend — FastAPI → Telegram

Единственная задача бэкенда: принять ответ гостя с сайта (`POST /api/rsvp`)
и переслать его в Telegram-бота организаторам.

## 1. Создайте Telegram-бота

1. В Telegram напишите **@BotFather** → `/newbot`, следуйте инструкциям.
   В итоге получите токен вида `123456789:AA...` — это `TELEGRAM_BOT_TOKEN`.
2. Узнайте `chat_id`, куда бот будет присылать сообщения:
   - если хотите получать ответы себе в личку — напишите боту **@userinfobot**,
     он покажет ваш числовой `id`;
   - если хотите слать в общую группу — добавьте бота в группу и возьмите
     `chat_id` группы (например, через **@getidsbot**), учтите, что у групп
     `chat_id` обычно отрицательный, это нормально.
3. **Обязательно напишите вашему боту `/start`** (или добавьте его в группу) —
   иначе Telegram API откажется слать сообщения, пока пользователь/группа
   не инициировали диалог с ботом.

## 2. Настройка окружения (Windows 11, PowerShell)

```powershell
cd backend

# создать и активировать виртуальное окружение
python -m venv .venv
.venv\Scripts\Activate.ps1

# установить зависимости
pip install -r requirements.txt

# создать файл с настройками
copy .env.example .env
# откройте .env в любом редакторе и впишите свои TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID
```

> Если PowerShell блокирует запуск скриптов активации — выполните один раз
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## 3. Запуск сервера для разработки

```powershell
uvicorn app.main:app --reload --port 8000
```

Сервер поднимется на `http://localhost:8000`.
Проверить, что всё живо: `http://localhost:8000/api/health` → `{"status":"ok"}`.

Интерактивная документация API (Swagger UI): `http://localhost:8000/docs`.

## 4. Тесты

```powershell
pip install -r requirements-dev.txt
pytest
```

## Структура

```
backend/
  app/
    main.py       # FastAPI: /api/health, /api/rsvp, + отдаёт собранный
                    # фронтенд из ./static (см. корневой Dockerfile)
    schemas.py     # Pydantic-модели запроса/ответа
    telegram.py    # клиент Telegram Bot API (httpx)
    config.py       # настройки из .env (pydantic-settings)
  tests/            # pytest-тесты
  requirements.txt
  .env.example
```

Локально папки `static/` не будет (её создаёт Docker-сборка) — это
нормально, `main.py` при старте проверяет, есть ли она, и если нет,
просто не монтирует раздачу статики. Работают только `/api/*`.

## Продакшн

Деплой в связке с фронтендом одним Docker-образом на Render —
см. `Dockerfile` и раздел «Продакшн: Docker + Render» в корневом
`README.md`. Там же — что нужно донастроить (переменные окружения,
CORS в проде не критичен, т.к. всё на одном домене).
