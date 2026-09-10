from fastapi import APIRouter, Depends

from ..ingestion import run_ingestion
from ..schemas import IngestionStatusResponse, ReindexResult
from ..security import require_admin_token
from ..state import ingestion_status

router = APIRouter(prefix="/api", tags=["admin"])


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/admin/status", response_model=IngestionStatusResponse)
async def get_ingestion_status():
    """Para comprobar de un vistazo (o desde un monitor externo) que la
    ingesta diaria sigue funcionando: cuándo fue la última vez con éxito,
    cuántas gasolineras se cargaron, y el último error si lo hay."""
    return IngestionStatusResponse(
        last_success_at=ingestion_status.last_success_at,
        last_error_at=ingestion_status.last_error_at,
        last_error=ingestion_status.last_error,
        last_source_total=ingestion_status.last_source_total,
        last_indexed=ingestion_status.last_indexed,
        last_pruned=ingestion_status.last_pruned,
    )


@router.post("/admin/reindex", response_model=ReindexResult, dependencies=[Depends(require_admin_token)])
async def trigger_reindex():
    """Dispara la ingesta manualmente, sin esperar al cron diario.
    Útil en el primer arranque (Solr vacío) y para pruebas."""
    result = await run_ingestion()
    return ReindexResult(**result)
