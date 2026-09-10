import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { OilStationsCollection } from "../interfaces/oilstations";
import { OilStationsFilter } from "../interfaces/oilStationsFilter";
import { FacetsResponse } from "../interfaces/facets";

@Injectable({
    providedIn: 'root'
})
export class OilStationsApiClient {

    private readonly baseUrl = '/api';

    constructor(private readonly http: HttpClient) { }

    getOilStations(filter: OilStationsFilter = {}): Observable<OilStationsCollection> {
        let params = new HttpParams();

        for (const provincia of filter.provincias ?? []) {
            params = params.append('provincias', provincia);
        }
        for (const estacion of filter.estaciones ?? []) {
            params = params.append('estaciones', estacion);
        }
        if (filter.precio?.[0] != null) {
            params = params.set('precio_min', filter.precio[0]);
        }
        if (filter.precio?.[1] != null) {
            params = params.set('precio_max', filter.precio[1]);
        }
        if (filter.combustible) {
            params = params.set('combustible', filter.combustible);
        }
        if (filter.cercaDe) {
            params = params
                .set('lat', filter.cercaDe.lat)
                .set('lon', filter.cercaDe.lon)
                .set('radius_km', filter.cercaDe.radioKm);
        }

        return this.http.get<OilStationsCollection>(`${this.baseUrl}/oil-stations`, { params });
    }

    getFacets(): Observable<FacetsResponse> {
        return this.http.get<FacetsResponse>(`${this.baseUrl}/facets`);
    }

}
