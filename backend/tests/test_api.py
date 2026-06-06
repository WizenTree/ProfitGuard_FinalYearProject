from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    # Assuming your health endpoint returns a 200 OK
    assert response.status_code == 200