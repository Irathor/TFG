import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Map, Marker, Popup } from 'maplibre-gl';
import { GeolocationsService, MapService } from '../../services';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    standalone: false
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

    const map = new Map({
      container: this.principalElement?.nativeElement,
      style: this.mapService.initialStyleUrl,
      center: this.geolocationsService.userLocation,
      zoom: 14
    });

    const popup = new Popup({closeButton: false,
                                      className: 'popup'})
      .setHTML(`<strong>${this.geolocationsService.userLocation}</strong>`);


    new Marker({color: '#e53935'})
      .setLngLat(this.geolocationsService.userLocation)
      .setPopup(popup)
      .addTo(map)

    //Inicializo el mapa a la entrada del servicio
    this.mapService.setMap(map);

  }

}
