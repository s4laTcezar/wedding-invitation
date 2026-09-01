# Запускает backend и frontend для разработки в двух отдельных окнах PowerShell.
# Предполагается, что вы уже один раз выполнили установку по README
# (создали backend/.venv и настроили backend/.env, сделали frontend npm install).
#
# Запуск: из корня проекта   ->   .\dev.ps1

$root = $PSScriptRoot

Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "cd `"$root\backend`"; .venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000"
)

Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "cd `"$root\frontend`"; npm start"
)

Write-Host "Backend:  http://localhost:8000/docs"
Write-Host "Frontend: http://localhost:4200"
