"""Estado compartido en memoria del proceso: caché de facets y estado de la
última ingesta. Al ser un único proceso (uvicorn sin workers múltiples) un
simple objeto en memoria es suficiente, sin necesidad de Redis ni similares."""

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any


@dataclass
class IngestionStatus:
    last_success_at: datetime | None = None
    last_error_at: datetime | None = None
    last_error: str | None = None
    last_source_total: int | None = None
    last_indexed: int | None = None
    last_pruned: int | None = None

    def record_success(self, source_total: int, indexed: int, pruned: int) -> None:
        self.last_success_at = datetime.now(timezone.utc)
        self.last_source_total = source_total
        self.last_indexed = indexed
        self.last_pruned = pruned
        self.last_error = None
        self.last_error_at = None

    def record_error(self, error: str) -> None:
        self.last_error_at = datetime.now(timezone.utc)
        self.last_error = error


@dataclass
class FacetsCache:
    value: dict[str, Any] | None = None

    def clear(self) -> None:
        self.value = None


ingestion_status = IngestionStatus()
facets_cache = FacetsCache()
