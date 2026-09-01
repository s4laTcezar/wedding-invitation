# Сайт-приглашение на свадьбу

Маленький проект из двух частей:

- **frontend/** — Angular (TypeScript). Сайт с 4 экранами:
  Главная, Детали, RSVP, Игра. Сверстан по присланному макету.
- **backend/** — Python (FastAPI). Единственная задача — принять ответ
  гостя из формы RSVP и переслать его в Telegram-бота организаторам.

Гость никак не аутентифицируется и ничего не хранится в базе данных —
всё, что нужно организаторам, приходит сообщением в Telegram.

В продакшне это **один монолитный сервис**: Docker собирает Angular и
кладёт готовые файлы внутрь того же образа, что и backend — FastAPI сам
отдаёт и сайт, и `/api/*`. Один процесс, один домен, без CORS. Локально
для разработки удобнее держать их отдельно (см. ниже) — Angular
пересобирается на лету, а не при каждом изменении.

## Быстрый старт для разработки (Windows 11)

### 1. Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# впишите в .env свой TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID — см. backend/README.md
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend (в новом окне терминала)

```powershell
cd frontend
npm install
npm start
```

Откройте `http://localhost:4200`.

### Или одной командой

После того как выполнили установку один раз (venv + npm install + .env),
можно запускать оба сервера сразу:

```powershell
.\dev.ps1
```

## Продакшн: Docker + Render

Корневой `Dockerfile` — многоступенчатая (multi-stage) сборка:

```
Стадия 1 (node)   →  npm ci && npm run build   →  готовый Angular (dist/frontend/browser)
Стадия 2 (python) →  pip install               →  копирует готовый Angular как ./static
                                                 →  FastAPI отдаёт и /api/*, и статику
```

При каждом пуше в GitHub Render сам пересобирает образ по этому
Dockerfile — вручную собирать фронтенд и коммитить `dist` не нужно.

### Проверить сборку локально (нужен Docker Desktop)

```powershell
docker build -t wedding-invitation .
docker run --rm -p 8000:8000 `
  -e TELEGRAM_BOT_TOKEN=ваш_токен `
  -e TELEGRAM_CHAT_ID=ваш_chat_id `
  wedding-invitation
```

Откройте `http://localhost:8000` — должен открыться сайт, а
`http://localhost:8000/api/health` — вернуть `{"status":"ok"}`.

### Деплой на Render

1. Залейте проект в GitHub (`git init`, `git add .`, `git commit`, `git push`).
2. На [render.com](https://render.com) → **New → Web Service** → выберите репозиторий.
3. Render сам увидит корневой `Dockerfile` и предложит **Environment: Docker** —
   оставьте как есть, Root Directory оставьте пустым (корень репозитория).
4. В разделе **Environment** добавьте переменные `TELEGRAM_BOT_TOKEN` и
   `TELEGRAM_CHAT_ID` (те же значения, что в локальном `.env`).
5. Instance Type — **Free**. Деплой.

Render передаёт порт через переменную `PORT` — `CMD` в Dockerfile уже
это учитывает, ничего донастраивать не нужно. Готовый сайт будет
доступен по адресу вида `https://your-app.onrender.com` — это и есть
сайт, и API одновременно, никакого отдельного фронтенд-хостинга не нужно.

> Бесплатный инстанс Render засыпает после 15 минут без запросов и
> просыпается ~30–60 секунд на первый запрос — нормально для
> свадебного сайта с редкими визитами.

## Как это работает

**В разработке** (два процесса):

```
Гость открывает сайт (Angular, localhost:4200)
        │  заполняет форму на вкладке RSVP
        ▼
POST /api/rsvp  →  backend (FastAPI, localhost:8000)
        │
        ▼
Telegram Bot API  →  сообщение в чат/группу организаторам
```

**В продакшне** (один процесс в одном Docker-контейнере):

```
Гость открывает https://your-app.onrender.com
        │
        ▼
FastAPI: "/" и статика  →  отдаёт собранный Angular
POST "/api/rsvp"        →  тот же процесс пересылает в Telegram Bot API
```

## Где что менять

| Что                                   | Файл                                                |
|----------------------------------------|------------------------------------------------------|
| Имена, дата, адреса, вопросы игры     | `frontend/src/app/core/models/wedding-config.ts`     |
| Токен бота и chat_id (локально)       | `backend/.env`                                       |
| Токен бота и chat_id (Render)         | Environment Variables в настройках сервиса на Render |
| Адрес backend для фронтенда в dev     | `frontend/src/environments/environment.development.ts` |
| Домены, которым разрешён доступ к API | `backend/app/config.py` (`cors_origins`) — в проде не критично, всё на одном домене |

## Дальнейшие шаги

- Подставить реальное фото пары вместо плейсхолдера
  (см. комментарий в `invite-page.component.scss`).
- Свой домен вместо `*.onrender.com` — настраивается в Render →
  Settings → Custom Domains, бесплатно.

Подробности по каждой части — в `frontend/README.md` и `backend/README.md`.
