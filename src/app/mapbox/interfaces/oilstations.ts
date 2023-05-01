export interface OilStations {
    responseHeader: ResponseHeader;
    response:       Response;
    facet_counts:   FacetCounts;
}

export interface FacetCounts {
    facet_queries:   Facet;
    facet_fields:    FacetFields;
    facet_ranges:    FacetRanges;
    facet_intervals: Facet;
    facet_heatmaps:  Facet;
}

export interface FacetFields {
    Estacion_str:  Array<number | string>;
    Provincia_str: Array<Provincia | number>;
}

export enum Provincia {
    Albacete = "ALBACETE",
    Alicante = "ALICANTE",
    Almería = "ALMERÍA",
    ArabaÁlava = "ARABA/ÁLAVA",
    Asturias = "ASTURIAS",
    Badajoz = "BADAJOZ",
    BalearsIlles = "BALEARS (ILLES)",
    Barcelona = "BARCELONA",
    Bizkaia = "BIZKAIA",
    Burgos = "BURGOS",
    Cantabria = "CANTABRIA",
    CastellónCastelló = "CASTELLÓN / CASTELLÓ",
    Ceuta = "CEUTA",
    CiudadReal = "CIUDAD REAL",
    CoruñaA = "CORUÑA (A)",
    Cuenca = "CUENCA",
    Cáceres = "CÁCERES",
    Cádiz = "CÁDIZ",
    Córdoba = "CÓRDOBA",
    Gipuzkoa = "GIPUZKOA",
    Girona = "GIRONA",
    Granada = "GRANADA",
    Guadalajara = "GUADALAJARA",
    Huelva = "HUELVA",
    Huesca = "HUESCA",
    Jaén = "JAÉN",
    León = "LEÓN",
    Lleida = "LLEIDA",
    Lugo = "LUGO",
    Madrid = "MADRID",
    Melilla = "MELILLA",
    Murcia = "MURCIA",
    Málaga = "MÁLAGA",
    Navarra = "NAVARRA",
    Ourense = "OURENSE",
    Palencia = "PALENCIA",
    PalmasLas = "PALMAS (LAS)",
    Pontevedra = "PONTEVEDRA",
    RiojaLa = "RIOJA (LA)",
    Salamanca = "SALAMANCA",
    SantaCruzDeTenerife = "SANTA CRUZ DE TENERIFE",
    Segovia = "SEGOVIA",
    Sevilla = "SEVILLA",
    Soria = "SORIA",
    Tarragona = "TARRAGONA",
    Teruel = "TERUEL",
    Toledo = "TOLEDO",
    ValenciaValència = "VALENCIA / VALÈNCIA",
    Valladolid = "VALLADOLID",
    Zamora = "ZAMORA",
    Zaragoza = "ZARAGOZA",
    Ávila = "ÁVILA",
}

export interface Facet {
}

export interface FacetRanges {
    Precio_Gasoleo_A:       PrecioGasol;
    Precio_Gasoleo_Premium: PrecioGasol;
    Precio_Gasolina_95_E5:  PrecioGasol;
    Precio_Gasolina_98_E5:  PrecioGasol;
}

export interface PrecioGasol {
    counts: Array<number | string>;
    gap:    number;
    start:  number;
    end:    number;
}

export interface Response {
    numFound:      number;
    start:         number;
    numFoundExact: boolean;
    docs:          Doc[];
}

export interface Doc {
    Latitud:                 number;
    Longitud:                number;
    Provincia:               Provincia;
    Estacion:                string;
    Precio_Gasoleo_A?:       number;
    Precio_Gasolina_95_E5?:  number;
    Precio_Gasoleo_Premium?: number;
    Precio_Gasolina_98_E5?:  number;
}

export interface ResponseHeader {
    status: number;
    QTime:  number;
    params: Params;
}

export interface Params {
    "facet.range":       string[];
    q:                   string;
    "facet.field":       string[];
    "facet.range.gap":   string;
    indent:              string;
    fl:                  string;
    "q.op":              string;
    rows:                string;
    facet:               string;
    "facet.sort":        string;
    "facet.range.start": string;
    "facet.range.end":   string;
}
