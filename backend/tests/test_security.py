import pytest
from fastapi import HTTPException

from app import security


@pytest.fixture(autouse=True)
def reset_admin_token(monkeypatch):
    monkeypatch.setattr(security.settings, "admin_token", None)
    yield


async def test_no_token_configured_allows_any_request():
    await security.require_admin_token(x_admin_token=None)  # no debe lanzar


async def test_rejects_missing_token_when_configured(monkeypatch):
    monkeypatch.setattr(security.settings, "admin_token", "secreto")
    with pytest.raises(HTTPException) as exc_info:
        await security.require_admin_token(x_admin_token=None)
    assert exc_info.value.status_code == 401


async def test_rejects_wrong_token_when_configured(monkeypatch):
    monkeypatch.setattr(security.settings, "admin_token", "secreto")
    with pytest.raises(HTTPException) as exc_info:
        await security.require_admin_token(x_admin_token="incorrecto")
    assert exc_info.value.status_code == 401


async def test_accepts_correct_token_when_configured(monkeypatch):
    monkeypatch.setattr(security.settings, "admin_token", "secreto")
    await security.require_admin_token(x_admin_token="secreto")  # no debe lanzar
