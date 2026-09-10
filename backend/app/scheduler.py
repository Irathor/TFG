import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from .config import settings
from .ingestion import run_ingestion

logger = logging.getLogger("scheduler")

scheduler = AsyncIOScheduler()


def start_scheduler() -> None:
    scheduler.add_job(
        run_ingestion,
        trigger=CronTrigger(hour=settings.ingestion_hour, minute=settings.ingestion_minute),
        id="daily_ingestion",
        replace_existing=True,
        misfire_grace_time=3600,
    )
    scheduler.start()
    logger.info(
        "Scheduler iniciado: ingesta diaria programada a las %02d:%02d.",
        settings.ingestion_hour,
        settings.ingestion_minute,
    )
