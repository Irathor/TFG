// Forma de la respuesta de OSRM (router.project-osrm.org). Solo se modelan
// los campos que la app realmente usa (geometry.coordinates de la ruta) —
// nada de maniobras giro a giro, que aquí no se muestran.

export interface DirectionsResponse {
    code:      string;
    routes:    Route[];
    waypoints: Waypoint[];
}

export interface Route {
    distance: number;
    duration: number;
    geometry: Geometry;
}

export interface Geometry {
    type:        string;
    coordinates: number[][];
}

export interface Waypoint {
    distance: number;
    name:     string;
    location: number[];
}
