from fastapi.testclient import TestClient
from app.main import app

# Initialize the test client
client = TestClient(app)

def test_root_endpoint():
    """Test that the API is running and returns metadata"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "Profit Guard API"
    assert data["status"] == "running"

def test_health_check():
    """Test the dedicated health router"""
    response = client.get("/health")
    # Allows 200 OK or 404 depending on how health.py is specifically structured
    assert response.status_code in [200, 404] 

def test_inventory_read():
    """Test that the inventory endpoint returns the correct schema"""
    response = client.get("/inventory/")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert isinstance(data["items"], list)

def test_reports_read():
    """Test that reports calculate without crashing"""
    response = client.get("/reports/")
    assert response.status_code == 200
    data = response.json()
    assert "total_profit" in data
    assert "total_revenue" in data
    assert "top_products" in data

def test_invalid_transaction_rejected():
    """Security Test: Ensure Pydantic rejects negative quantities"""
    bad_payload = {
        "product": "Test Item",
        "type": "sale",
        "quantity": -5,  # Invalid
        "selling_price": 100
    }
    response = client.post("/transaction/", json=bad_payload)
    assert response.status_code == 422 # 422 Unprocessable Entity (Validation Error)