import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

import { Feature, PlacesResponse } from "../interfaces/places";

// Geocoder gratuito de OpenStreetMap (komoot), sin token ni registro.
// https://github.com/komoot/photon — uso razonable, sin abusar del servicio público.
const PHOTON_URL = "https://photon.komoot.io/api/";

interface PhotonProperties {
    osm_id?: number;
    osm_type?: string;
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
}

interface PhotonFeature {
    geometry: { coordinates: [number, number] };
    properties: PhotonProperties;
}

interface PhotonResponse {
    type: string;
    features: PhotonFeature[];
}

@Injectable({
    providedIn: 'root'
})
export class PlacesApiClient {

    constructor(private readonly http: HttpClient) { }

    /** Busca lugares por texto libre, con sesgo opcional hacia una posición (p.ej. la del usuario). */
    search(query: string, proximity?: [number, number], limit: number = 4): Observable<PlacesResponse> {
        // La instancia pública de Photon solo soporta lang=default|de|en|fr;
        // "default" da el nombre en el idioma local del sitio (en España, español).
        let params = new HttpParams()
            .set('q', query)
            .set('lang', 'default')
            .set('limit', limit);

        if (proximity) {
            const [lon, lat] = proximity;
            params = params.set('lon', lon).set('lat', lat);
        }

        return this.http.get<PhotonResponse>(PHOTON_URL, { params }).pipe(
            map(resp => ({
                type: resp.type,
                features: resp.features.map(toFeature)
            }))
        );
    }

}

function toFeature(raw: PhotonFeature): Feature {
    const p = raw.properties;
    const id = `${ p.osm_type ?? 'osm' }${ p.osm_id ?? '' }`;
    const text = p.name || p.street || '';
    const placeParts = [p.street, p.city, p.state, p.country].filter(Boolean);

    return {
        id,
        text,
        place_name: placeParts.length ? placeParts.join(', ') : text,
        center: raw.geometry.coordinates
    };
}
