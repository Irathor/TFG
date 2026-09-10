import httpx

# Definimos el schema explícitamente en vez de confiar en el modo "schemaless"
# de Solr: por defecto, adivina cualquier número como tipo multivaluado
# (pdoubles/plongs), lo que acaba devolviendo listas de un elemento en vez de
# valores simples. Con esto Estacion/Provincia quedan como "string" (exact
# match, aptos para filtrar y facetar sin necesidad de un campo *_str aparte).
FIELDS: list[dict] = [
    {"name": "IDEESS", "type": "pint", "multiValued": False},
    {"name": "IDMunicipio", "type": "pint", "multiValued": False},
    {"name": "IDProvincia", "type": "pint", "multiValued": False},
    {"name": "IDCCAA", "type": "pint", "multiValued": False},
    {"name": "Latitud", "type": "pdouble", "multiValued": False},
    {"name": "Longitud", "type": "pdouble", "multiValued": False},
    {"name": "location", "type": "location", "multiValued": False},
    {"name": "BioEtanol", "type": "pdouble", "multiValued": False},
    {"name": "Ester_met_lico", "type": "pdouble", "multiValued": False},
    {"name": "Precio_Gasoleo_A", "type": "pdouble", "multiValued": False},
    {"name": "Precio_Gasoleo_B", "type": "pdouble", "multiValued": False},
    {"name": "Precio_Gasoleo_Premium", "type": "pdouble", "multiValued": False},
    {"name": "Precio_Gasolina_95_E5", "type": "pdouble", "multiValued": False},
    {"name": "Precio_Gasolina_98_E5", "type": "pdouble", "multiValued": False},
    {"name": "Estacion", "type": "string", "multiValued": False},
    {"name": "Provincia", "type": "string", "multiValued": False},
    {"name": "Municipio", "type": "string", "multiValued": False},
    {"name": "Localidad", "type": "string", "multiValued": False},
    {"name": "Direccion", "type": "string", "multiValued": False},
    {"name": "Horario", "type": "string", "multiValued": False},
    {"name": "Margen", "type": "string", "multiValued": False},
    {"name": "Remision", "type": "string", "multiValued": False},
    {"name": "C.P.", "type": "string", "multiValued": False},
    {"name": "Tipo_Venta", "type": "string", "multiValued": False},
]


async def ensure_schema(base_url: str, collection: str) -> None:
    """Crea o corrige los campos anteriores en el schema de Solr. Idempotente:
    se puede llamar en cada arranque del backend sin efectos secundarios."""

    schema_url = f"{base_url}/solr/{collection}/schema"

    async with httpx.AsyncClient(timeout=30) as client:
        existing = await client.get(f"{schema_url}/fields")
        existing.raise_for_status()
        existing_names = {f["name"] for f in existing.json()["fields"]}

        commands: dict[str, list[dict]] = {}
        for field in FIELDS:
            key = "replace-field" if field["name"] in existing_names else "add-field"
            commands.setdefault(key, []).append(field)

        if commands:
            resp = await client.post(schema_url, json=commands)
            resp.raise_for_status()
