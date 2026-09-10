import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OilStationsCollection } from '../interfaces/oilstations';
import { OilStationsFilter } from '../interfaces/oilStationsFilter';
import { FacetsResponse } from '../interfaces/facets';
import { OilStationsApiClient } from '../api';

@Injectable({
  providedIn: 'root'
})
export class OilStationsService {

  constructor(private readonly api: OilStationsApiClient) { }

  getOilStationsInfo(filter: OilStationsFilter = {}): Observable<OilStationsCollection> {
    return this.api.getOilStations(filter);
  }

  getFacets(): Observable<FacetsResponse> {
    return this.api.getFacets();
  }
}
