@pytest.mark.asyncio
async def test_chat_query(client):
    response = await client.get("/chat", params={"query": "What is the document about?"})
    assert response.status_code == 200
    assert "answer" in response.json()
    assert isinstance(response.json()["answer"], str)
