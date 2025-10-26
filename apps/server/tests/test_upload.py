import os
from config import settings


def test_sample_pdf_exists():
    assert os.path.exists("test_docs/sample.pdf")


@pytest.mark.asyncio
async def test_upload_pdf(client):
    with open("test_docs/sample.pdf", "rb") as f:
        response = await client.post(
            "/upload",
            files={"file": ("sample.pdf", f, "application/pdf")}
        )
    assert response.status_code == 200
    assert "chunks added" in response.json()["message"]
