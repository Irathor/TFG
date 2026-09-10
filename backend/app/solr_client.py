from typing import Any

import httpx


class SolrClient:
    """Cliente HTTP mínimo contra un core de Solr en modo standalone.

    Mantiene un único httpx.AsyncClient para todo su ciclo de vida en vez de
    abrir una conexión nueva en cada método: Solr se consulta en cada carga
    de filtro, así que reutilizar la conexión (keep-alive/pool) evita pagar
    el coste de un nuevo handshake TCP en cada petición."""

    def __init__(self, base_url: str, collection: str):
        self._select_url = f"{base_url}/solr/{collection}/select"
        self._update_url = f"{base_url}/solr/{collection}/update"
        # 60s: cubre con margen tanto las consultas normales (rápidas) como
        # los lotes de indexación masiva (los más lentos de todos).
        self._client = httpx.AsyncClient(timeout=60)

    async def aclose(self) -> None:
        await self._client.aclose()

    async def query(self, params: dict[str, Any]) -> dict:
        resp = await self._client.get(self._select_url, params=params)
        resp.raise_for_status()
        return resp.json()

    async def delete_all(self) -> None:
        resp = await self._client.post(
            self._update_url,
            params={"commit": "true"},
            json={"delete": {"query": "*:*"}},
        )
        resp.raise_for_status()

    async def get_all_ids(self) -> set[str]:
        """IDs actualmente indexados, para poder calcular qué borrar tras un upsert."""
        resp = await self._client.get(self._select_url, params={
            "q": "*:*",
            "fl": "id",
            "rows": 200000,
            "wt": "json",
        })
        resp.raise_for_status()
        docs = resp.json()["response"]["docs"]
        return {doc["id"] for doc in docs}

    async def delete_by_ids(self, ids: list[str], batch_size: int = 2000) -> None:
        if not ids:
            return

        for i in range(0, len(ids), batch_size):
            batch = ids[i : i + batch_size]
            resp = await self._client.post(self._update_url, json={"delete": batch})
            resp.raise_for_status()

        commit_resp = await self._client.post(self._update_url, params={"commit": "true"}, json={})
        commit_resp.raise_for_status()

    async def add_documents(self, docs: list[dict], batch_size: int = 2000) -> None:
        """Indexa en lotes y confirma (commit) una sola vez al final.
        Es un upsert: Solr sobreescribe cualquier documento existente con el
        mismo id, no hace falta borrar antes."""
        for i in range(0, len(docs), batch_size):
            batch = docs[i : i + batch_size]
            resp = await self._client.post(self._update_url, json=batch)
            resp.raise_for_status()

        commit_resp = await self._client.post(self._update_url, params={"commit": "true"}, json={})
        commit_resp.raise_for_status()
