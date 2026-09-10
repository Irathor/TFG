from .config import settings
from .solr_client import SolrClient

# Instancia única compartida por todos los routers.
solr = SolrClient(settings.solr_url, settings.solr_collection)
