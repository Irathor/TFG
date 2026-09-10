import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { DirectionsResponse } from "../interfaces/directions";

// Servidor de demostración público de OSRM (patrocinado por FOSSGIS), gratuito
// y sin token — uso razonable, no pensado para tráfico de producción intenso.
// https://github.com/Project-OSRM/osrm-backend/wiki/Demo-server
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

@Injectable({
    providedIn: 'root'
})
export class DirectionsApiClient {

    constructor(private readonly http: HttpClient) { }

    getRoute(start: [number, number], end: [number, number]): Observable<DirectionsResponse> {
        const coords = `${ start.join(',') };${ end.join(',') }`;

        const params = new HttpParams()
            .set('alternatives', 'false')
            .set('geometries', 'geojson')
            .set('overview', 'full')
            .set('steps', 'false');

        return this.http.get<DirectionsResponse>(`${ OSRM_URL }/${ coords }`, { params });
    }

}
