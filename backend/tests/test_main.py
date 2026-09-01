from fastapi.testclient import TestClient

from app.main import app, build_message
from app.schemas import RsvpRequest


client = TestClient(app)


def test_health() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_build_message_attending() -> None:
    payload = RsvpRequest(fullName="Иван Иванов", attending=True, responseText="Ура!")
    text = build_message(payload)
    assert "Иван Иванов" in text
    assert "Придёт" in text
    assert "Ура!" in text


def test_build_message_not_attending() -> None:
    payload = RsvpRequest(fullName="Пётр", attending=False)
    text = build_message(payload)
    assert "Не сможет прийти" in text
