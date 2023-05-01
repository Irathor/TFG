import { Injectable } from '@angular/core';

import { PlacesResponse, Feature } from '../interfaces/places';
import { MapService } from './map.service';
import { PlacesApiClient } from '../api';
import { OilStationsService } from './oil-stations.service';
import { Doc, OilStations } from '../interfaces/oilstations';
import { Observable, tap } from 'rxjs';
import { SolrRequest } from '../interfaces/solrRequest';

@Injectable({
  providedIn: 'root'
})
export class GeolocationsService {

  userLocation?:[number,number];

  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];


  get locationReady(): boolean {
    return !!this.userLocation; //Si hay valor devuelvo un true (De ahí la doble negación)
  }

  constructor(
    private placesApi: PlacesApiClient,
    private mapService: MapService,
    private oilStations: OilStationsService
    ) {
    this.getUserLocation(); //Llamamos la función para obtener la geolocalización del usuario una vez nada más se haga uso de este servicio
   }

  public async getUserLocation(): Promise<[number,number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({coords})=> { //Desestructuro los datos de entrada para tomar el que necesito, las coordenadas
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation); 
        },
        (e) => {
          alert(e);
          reject();
        }
      );
    });
  }

  getPlacesByQuery(query:string = ''){

    if(!this.userLocation){
      throw Error('No se ha podido geolocalizar');
    }

    if(query.length === 0){
      this.isLoadingPlaces = false;
      this.hideMenuPlaces();
      return;
    }

    this.isLoadingPlaces = true;

    this.placesApi.get<PlacesResponse>(`/${query}.json`, {
      params:{
        proximity: this.userLocation.join(',')
      }
    }).subscribe(resp => {
        this.isLoadingPlaces=false;
        this.places=resp.features;

        //Para crear un marcador de los lugares que encontremos en el momento de buscarlos
        this.mapService.createMarkersFromPlaces(this.places, this.userLocation!);
      });
  }

  getOilStations(req: SolrRequest = {}): Observable<OilStations> {
    let oilStationLocation: Array<Doc> = [];

    return this.oilStations.getOilStationsInfo(req).pipe(
      tap(resp => {
        resp.response.docs.forEach((doc)=>{
          oilStationLocation.push(doc);
        })
        this.mapService.createMarkersFromOilStations(oilStationLocation);
      })
    );
  }

  getOilStationsNoPaint(req: SolrRequest = {}): Observable<OilStations> {
    let oilStationLocation: Array<Doc> = [];

    return this.oilStations.getOilStationsInfo(req).pipe(
      tap(resp => {
        resp.response.docs.forEach((doc)=>{
          oilStationLocation.push(doc);
        })
      })
    );
  }

  hideMenuPlaces(){
    this.places = [];
  }

}
