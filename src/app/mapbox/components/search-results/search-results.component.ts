import { Component } from '@angular/core';
import { Feature } from '../../interfaces/places';
import { MapService, GeolocationsService } from '../../services';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {


  public selectedId: string = '';

  constructor(
    private geoLocationsService: GeolocationsService,
    private mapService: MapService
    ){}

  get isLoadingPlaces(): boolean {
    return this.geoLocationsService.isLoadingPlaces;
  }

  get places(): Feature[] {
    return this.geoLocationsService.places;
  }

  flyTo(place: Feature){
    this.selectedId=place.id;

    const[lng, lat] = place.center;

    this.mapService.flyto([lng, lat]);
  }

  getDirections(place: Feature){

    if(!this.geoLocationsService.userLocation){
      throw Error('No se ha podido Geolocalizar');
    }

    this.geoLocationsService.hideMenuPlaces();

    const start = this.geoLocationsService.userLocation;
    const end = place.center as [number, number];

    this.mapService.getRoutBetweenPoints(start, end);
  }

}
