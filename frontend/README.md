# Frontend — Angular (TypeScript)

Сайт-приглашение: 4 экрана (вкладки) — «Главная», «Детали», «RSVP», «Игра».
Верстался по присланному макету (`Wedding_Invitation_Website.pdf`).

## Настройка (Windows 11, PowerShell)

Нужен установленный [Node.js](https://nodejs.org/) (LTS, версия 20 или новее).

```powershell
cd frontend
npm install
```

## Запуск для разработки

```powershell
npm start
```

Откроется на `http://localhost:4200`. Чтобы форма RSVP реально отправлялась,
убедитесь, что backend запущен на `http://localhost:8000`
(см. `../backend/README.md`); адрес настроен в
`src/environments/environment.development.ts`.

## Сборка

```powershell
npm run build
```

Результат — `dist/frontend/browser`. В продакшне эту сборку делает
Docker (см. корневой `Dockerfile`) — вручную собирать и никуда
заливать не нужно, `apiUrl` в `src/environments/environment.ts` уже
настроен как относительный путь `/api`, который работает сам по себе,
когда FastAPI отдаёт и сайт, и API с одного домена (см. корневой
`README.md`, раздел «Продакшн: Docker + Render»).

Роутинг сделан через hash-адреса (`#/rsvp`, `#/details`) — переходы
между вкладками не требуют запросов к серверу и отдельной настройки
rewrite-правил.

> В `angular.json` инлайнинг Google Fonts при сборке отключен
> (`optimization.fonts: false`) — иначе прод-сборка требует доступа к
> fonts.googleapis.com именно в момент сборки, а не только в браузере
> у гостя. Шрифты по-прежнему подключены через `styles.scss`, просто
> браузер загружает их сам во время работы сайта.

## Где менять контент

Все тексты, имена, дату, адреса и вопросы игры — в одном файле:

```
src/app/core/models/wedding-config.ts
```

## Структура

```
frontend/src/app/
  components/
    invite-page/     # главный экран: монограмма, фото, имена, конверт
    details-page/    # церемония / банкет / проживание / как добраться
    rsvp-page/        # форма ответа на приглашение
    game-page/        # мини-игра "угадайка" на 3 раунда
    tab-nav/           # нижняя навигация по вкладкам
  core/
    models/            # wedding-config.ts, интерфейсы RSVP
    services/           # rsvp.service.ts — отправка ответа на backend
```
