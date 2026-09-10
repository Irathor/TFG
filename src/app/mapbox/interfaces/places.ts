// Forma ya adaptada desde la respuesta de Photon (geocoder de OpenStreetMap),
// no el formato original de ese proveedor — así el resto de la app
// (map.service, search-results...) no depende de qué geocoder se use.

export interface PlacesResponse {
    type: string;
    features: Feature[];
}

export interface Feature {
    id: string;
    /** Nombre corto (p.ej. "Puerta del Sol"). */
    text: string;
    /** Descripción larga para mostrar debajo del nombre. */
    place_name: string;
    /** [longitud, latitud] */
    center: number[];
}
