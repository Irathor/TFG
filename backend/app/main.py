"""API de Gasolineras de España — Tali'Zorah se encarga de que estos datos tengan un buen hogar."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .dependencies import solr
from .routers import admin, facets, oil_stations
from .scheduler import scheduler, start_scheduler
from .schema import ensure_schema

logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await ensure_schema(settings.solr_url, settings.solr_collection)
    start_scheduler()
    yield
    scheduler.shutdown()
    await solr.aclose()


app = FastAPI(title="Gasolineras API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router)
app.include_router(facets.router)
app.include_router(oil_stations.router)
