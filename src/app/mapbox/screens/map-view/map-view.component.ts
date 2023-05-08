import { Component, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api';

import { GeolocationsService, MapService } from '../../services';

import { Facet } from '../../interfaces/facets';
import { SolrRequest } from '../../interfaces/solrRequest';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit{

  items!: MenuItem[];
  provincias!: Facet[];
  estaciones!: Facet[];
  
  selectedProvincias: string[] = [];
  selectedEstaciones: string[] = [];
  selectedPrecios: number[] = [0, 3];
  
  private debounceTimer?: NodeJS.Timeout;
  public infoReady: boolean = false;

  ngOnInit(): void {

    this.items = [
      {
          label: 'Centrar',
          icon: 'pi pi-fw pi-user', id: 'botonCentrar',
          command: () => {
            if(!this.geolocationsService.locationReady){
              throw Error('No se ha podido Geolocalizar');
            }
            if(!this.mapService.isMapReady){
              throw Error('No hay mapa disponible');
            }
            this.mapService.flyto(this.geolocationsService.userLocation!);
          }
      }
    ];

    let solrResponse = this.geolocationsService.getOilStationsNoPaint();

    solrResponse.subscribe(resp => {

      this.provincias = [];
      this.estaciones = [];

      for (let i = 0; i < resp.facet_counts.facet_fields.Provincia_str.length; i += 2) {
        let facetProvincias: Facet={name: resp.facet_counts.facet_fields.Provincia_str[i].toString(), count: Number(resp.facet_counts.facet_fields.Provincia_str[i + 1])};
        let facetEstaciones: Facet={name: resp.facet_counts.facet_fields.Estacion_str[i].toString(), count: Number(resp.facet_counts.facet_fields.Estacion_str[i + 1])};
        this.provincias.push(facetProvincias);
        this.estaciones.push(facetEstaciones);
      }

    })

  }

  constructor(
    private geolocationsService: GeolocationsService,
    private mapService: MapService
    ) { }

  get locationReady(){
    return this.geolocationsService.locationReady;
  }

  onQueryChanged(query: string = ''){
    if(this.debounceTimer){
      clearTimeout(this.debounceTimer);
      this.infoReady = false;
    }

    this.debounceTimer = setTimeout(()=>{
      if(query !==''){
        this.infoReady = true;
      }
      this.geolocationsService.getPlacesByQuery(query);
    }, 350);

  }

  selectProvincia(event: any){

    let req: SolrRequest = {provincias: event.value.map((item: any) => item.name), estaciones: this.selectedEstaciones.map((item: any) => item.name), precio: this.selectedPrecios};

    this.geolocationsService.getOilStations(req).subscribe();

  }

  selectEstacion(event: any){

    let req: SolrRequest = {provincias: this.selectedProvincias.map((item: any) => item.name), estaciones: event.value.map((item: any) => item.name), precio: this.selectedPrecios};

    this.geolocationsService.getOilStations(req).subscribe();

  }

  selectPrecio(event: any){

    let req: SolrRequest = {provincias: this.selectedProvincias.map((item: any) => item.name), estaciones: this.selectedEstaciones.map((item: any) => item.name), precio: event.values};

    this.geolocationsService.getOilStations(req).subscribe();
  }

}
