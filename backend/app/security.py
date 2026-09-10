import logging

from fastapi import Header, HTTPException

from .config import settings

logger = logging.getLogger("security")
_warned_unprotected = False


async def require_admin_token(x_admin_token: str | None = Header(default=None)) -> None:
    """Protege los endpoints de administración. Si no hay ADMIN_TOKEN
    configurado, deja pasar pero avisa una vez en los logs."""

    if not settings.admin_token:
        global _warned_unprotected
        if not _warned_unprotected:
            logger.warning(
                "ADMIN_TOKEN no configurado: los endpoints /api/admin/* están "
                "abiertos sin autenticación. Configúralo antes de exponer el "
                "backend fuera de tu máquina."
            )
            _warned_unprotected = True
        return

    if x_admin_token != settings.admin_token:
        raise HTTPException(status_code=401, detail="Token de administración inválido o ausente")
