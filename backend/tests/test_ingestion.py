from app.ingestion import _to_float, _to_int, transform_station


def test_to_float_converts_comma_decimal():
    assert _to_float("1,749") == 1.749


def test_to_float_handles_negative_comma_decimal():
    # Las longitudes vienen con signo negativo, p.ej. de Madrid hacia el oeste.
    assert _to_float("-3,703790") == -3.70379


def test_to_float_empty_or_none_is_none():
    assert _to_float("") is None
    assert _to_float(None) is None


def test_to_float_invalid_value_is_none():
    assert _to_float("no-numerico") is None


def test_to_int_converts_valid_string():
    assert _to_int("4375") == 4375


def test_to_int_invalid_value_is_none():
    assert _to_int("") is None
    assert _to_int(None) is None


def _raw_station(**overrides) -> dict:
    base = {
        "IDEESS": "4375",
        "IDMunicipio": "52",
        "IDProvincia": "02",
        "IDCCAA": "07",
        "Latitud": "39,211417",
        "Longitud (WGS84)": "-1,539167",
        "Rótulo": "Nº 10.935",
        "Provincia": "ALBACETE",
        "Precio Gasoleo A": "1,749",
        "Precio Gasoleo Premium": "",
    }
    base.update(overrides)
    return base


def test_transform_station_maps_fields_and_converts_types():
    doc = transform_station(_raw_station())

    assert doc is not None
    assert doc["id"] == "4375"
    assert doc["IDEESS"] == 4375
    assert doc["Latitud"] == 39.211417
    assert doc["Longitud"] == -1.539167
    assert doc["location"] == "39.211417,-1.539167"
    assert doc["Estacion"] == "Nº 10.935"
    assert doc["Provincia"] == "ALBACETE"
    assert doc["Precio_Gasoleo_A"] == 1.749


def test_transform_station_omits_blank_price_fields():
    doc = transform_station(_raw_station())
    # Un precio vacío en el origen no debe acabar como null/"" en Solr.
    assert "Precio_Gasoleo_Premium" not in doc


def test_transform_station_returns_none_without_coordinates():
    assert transform_station(_raw_station(Latitud="")) is None
    assert transform_station(_raw_station(**{"Longitud (WGS84)": ""})) is None


def test_transform_station_returns_none_without_ideess():
    assert transform_station(_raw_station(IDEESS="")) is None
