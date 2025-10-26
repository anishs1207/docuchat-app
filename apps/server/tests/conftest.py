import pytest
from httpx import AsyncClient
from apps.server.main import app


@pytest.fixture(scope="module")
async def client():
    async with AsyncClient(app=app, base_url="http://test") as c:
        yield c
