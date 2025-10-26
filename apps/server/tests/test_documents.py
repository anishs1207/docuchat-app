@pytest.mark.asyncio
async def test_list_documents(client):
    response = await client.get("/documents")
    assert response.status_code == 200
    assert "available_documents" in response.json()
    assert "sample.pdf" in response.json()["available_documents"]
