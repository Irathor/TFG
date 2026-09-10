from datetime import datetime

from pydantic import BaseModel


class FacetItem(BaseModel):
    name: str
    count: int


class FacetsResponse(BaseModel):
    provincias: list[FacetItem]
    estaciones: list[FacetItem]


class ReindexResult(BaseModel):
    source_total: int
    indexed: int
    pruned: int


class IngestionStatusResponse(BaseModel):
    last_success_at: datetime | None
    last_error_at: datetime | None
    last_error: str | None
    last_source_total: int | None
    last_indexed: int | None
    last_pruned: int | None
