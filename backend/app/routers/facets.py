from fastapi import APIRouter

from ..dependencies import solr
from ..schemas import FacetItem, FacetsResponse
from ..state import facets_cache

router = APIRouter(prefix="/api", tags=["facets"])


def _parse_facet_pairs(pairs: list) -> list[FacetItem]:
    # Solr devuelve los facets como una lista plana [nombre, count, nombre, count, ...]
    return [FacetItem(name=str(pairs[i]), count=pairs[i + 1]) for i in range(0, len(pairs), 2)]


@router.get("/facets", response_model=FacetsResponse)
async def get_facets():
    """Listas de provincias y estaciones disponibles, para poblar los filtros.
    Siempre sobre el dataset completo (no se filtran entre sí).

    El dataset solo cambia una vez al día (la ingesta programada), así que
    se cachea en memoria y se invalida justo cuando una ingesta termina
    (ver ingestion.run_ingestion), en vez de recalcular el facet en cada carga."""

    if facets_cache.value is not None:
        return FacetsResponse(**facets_cache.value)

    params = {
        "q": "*:*",
        "rows": 0,
        "facet": "true",
        "facet.field": ["Estacion", "Provincia"],
        "facet.mincount": 1,
        "facet.sort": "count",
        "facet.limit": 500,
        # "Estacion" mezcla marcas reales (Repsol, Cepsa...) con identificadores
        # propios de gasolineras sin marca (p.ej. "Nº 10.935"), lo que deja miles
        # de valores que solo aparecen una vez. Un mincount más alto para este
        # campo concreto filtra ese ruido y deja solo cadenas con presencia real,
        # sin necesidad de tocar Provincia (que sí es un conjunto pequeño y cerrado).
        "f.Estacion.facet.mincount": 5,
        "wt": "json",
    }

    result = await solr.query(params)
    fields = result["facet_counts"]["facet_fields"]

    response = FacetsResponse(
        provincias=_parse_facet_pairs(fields.get("Provincia", [])),
        estaciones=_parse_facet_pairs(fields.get("Estacion", [])),
    )
    facets_cache.value = response.model_dump()
    return response
