from app.routers.oil_stations import _build_fq


def test_no_filters_returns_none():
    assert _build_fq([], [], None, None, "gasoleo_a", None, None, None) is None


def test_provincias_filter():
    fq = _build_fq(["MADRID", "BARCELONA"], [], None, None, "gasoleo_a", None, None, None)
    assert fq == '(Provincia:"MADRID" OR Provincia:"BARCELONA")'


def test_estaciones_filter():
    fq = _build_fq([], ["REPSOL"], None, None, "gasoleo_a", None, None, None)
    assert fq == '(Estacion:"REPSOL")'


def test_precio_filters_default_fuel():
    fq = _build_fq([], [], 1.0, 2.0, "gasoleo_a", None, None, None)
    assert fq == "Precio_Gasoleo_A:[1.0 TO 2.0]"


def test_precio_filters_use_selected_fuel():
    fq = _build_fq([], [], 1.0, 2.0, "gasolina_98", None, None, None)
    assert fq == "Precio_Gasolina_98_E5:[1.0 TO 2.0]"


def test_precio_min_only_uses_open_upper_bound():
    fq = _build_fq([], [], 1.5, None, "gasoleo_a", None, None, None)
    assert fq == "Precio_Gasoleo_A:[1.5 TO *]"


def test_precio_max_only_uses_open_lower_bound():
    fq = _build_fq([], [], None, 1.5, "gasoleo_a", None, None, None)
    assert fq == "Precio_Gasoleo_A:[* TO 1.5]"


def test_combines_all_filters_with_and():
    fq = _build_fq(["MADRID"], ["REPSOL"], 1.0, 2.0, "gasoleo_a", None, None, None)
    assert fq.count(" AND ") == 2
    assert 'Provincia:"MADRID"' in fq
    assert 'Estacion:"REPSOL"' in fq
    assert "Precio_Gasoleo_A:[1.0 TO 2.0]" in fq


def test_radius_filter_adds_geofilt_clause():
    fq = _build_fq([], [], None, None, "gasoleo_a", 40.4168, -3.7038, 5)
    assert fq == "{!geofilt sfield=location pt=40.4168,-3.7038 d=5}"


def test_radius_filter_requires_all_three_params():
    # Si falta cualquiera de los tres, no se aplica el filtro geoespacial.
    assert _build_fq([], [], None, None, "gasoleo_a", 40.4168, None, 5) is None
    assert _build_fq([], [], None, None, "gasoleo_a", None, -3.7038, 5) is None
    assert _build_fq([], [], None, None, "gasoleo_a", 40.4168, -3.7038, None) is None
