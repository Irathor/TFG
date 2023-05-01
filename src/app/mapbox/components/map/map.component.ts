import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import mapboxgl from 'mapbox-gl';
import { GeolocationsService, MapService } from '../../services';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @ViewChild('principal') principalElement?: ElementRef

  constructor(
    private geolocationsService: GeolocationsService,
    private mapService: MapService
    ) { }

  ngAfterViewInit(): void {

    //Controlo lanzando un error por consola que haya geolocalización a este punto de la aplicación
    if(!this.geolocationsService.userLocation) {
      throw Error('No se ha podido geolocalizar');
    }
    
    const map = new mapboxgl.Map({
      container: this.principalElement?.nativeElement,
      style: 'mapbox://styles/mapbox/navigation-guidance-night-v2', // style del mapa
      center: this.geolocationsService.userLocation,
      zoom: 14
    });

    const popup = new mapboxgl.Popup({closeButton: false, 
                                      className: 'popup'})
      .setHTML(`<strong>${this.geolocationsService.userLocation}</strong>`);


    const myMarker = new mapboxgl.Marker({color: '#FFDAB9'})
      .setLngLat(this.geolocationsService.userLocation)
      .setPopup(popup)
      .addTo(map)

    //Inicializo el mapa a la entrada del servicio
    this.mapService.setMap(map);

  }

}
