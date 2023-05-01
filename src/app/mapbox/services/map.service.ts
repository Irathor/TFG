import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions';
import { Doc } from '../interfaces/oilstations';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?:Map;
  private markers: Marker[] = [];

  get isMapReady(){
    return !!this.map;
  }

  constructor(
    private directionsApi: DirectionsApiClient,
    private currencyPipe: CurrencyPipe
    ){}

  setMap(map: Map){
    this.map = map;
  }

  flyto(coords:LngLatLike){
    if (!this.isMapReady){
      throw Error('No se ha iniciado el mapa');
    }

    this.map?.flyTo({
      zoom: 14,
      center: coords
    });
  }

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]){
    if(!this.map){
      throw Error('Mapa no disponible');
    }

    this.markers.forEach(marker => marker.remove());
    const newMarkers = [];

    for(const place of places) {
      const [ lng, lat ] = place.center;
      const popup = new Popup()
              .setHTML(`
                <h6>${ place.text }</h6>
                <span>${ place.place_name }</span>
              `);

      const newMarker = new Marker()
              .setLngLat([lng, lat])
              .setPopup(popup)
              .addTo(this.map);

      newMarkers.push(newMarker);
    }

    this.markers = newMarkers;

    if(places.length === 0) {
      return;
    }

    // Adecuar el mapa a los lugares encontrados
    const bounds = new LngLatBounds();
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);

    this.map.fitBounds(bounds, {
      padding: 200
    })
  }

  createMarkersFromOilStations( places: Doc[] ){

    if( !this.map ){
      throw Error('Mapa no inicializado');
    }

    this.markers.forEach( marker => marker.remove() );
    const newMarkers = [];

    for(const place of places) {

      const coloresEstaciones: Record<string, string> = {
        REPSOL: '#03a9f4',
        CAMPSA: 'red',
        PETRONOR: 'blue',
        CEPSA: 'orange',
        SHELL: 'yellow',
        GALP: 'purple',
        BP: 'green'
      };
      
      let color = coloresEstaciones[place.Estacion as keyof typeof coloresEstaciones];
      
      if (!color) {
        // Si la clave no está en el objeto, asignamos un color por defecto
        color = 'grey';
      }

      const [ lng, lat ] = [place.Longitud, place.Latitud];
      const popup = new Popup()
              .setHTML(`
                <div style="text-align: center">
                  <h6><strong>${ place.Estacion }</strong><br></h6>
                </div>
                ${ place.Precio_Gasoleo_A != null ? '<span>Precio Gasóleo A: ' + this.currencyPipe.transform(place.Precio_Gasoleo_A, 'EUR')+'<br></span>' : '' }
                ${ place.Precio_Gasoleo_Premium != null ? '<span>Precio Gasóleo Premium: '+ this.currencyPipe.transform(place.Precio_Gasoleo_Premium, 'EUR')+'<br></span>' : '' }
                ${ place.Precio_Gasolina_95_E5 != null ? '<span>Precio Gasolina 95: '+ this.currencyPipe.transform(place.Precio_Gasolina_95_E5, 'EUR')+'<br></span>' : '' }
                ${ place.Precio_Gasolina_98_E5 != null ? '<span>Precio Gasolina 98: '+ this.currencyPipe.transform(place.Precio_Gasolina_98_E5, 'EUR')+'<br></span>' : '' }
              `);



      const newMarker = new Marker({color: color})
                .setLngLat([lng, lat])
                .setPopup( popup )
                .addTo( this.map );

      newMarkers.push( newMarker );
      
    }

    this.markers = newMarkers;

    if( places.length === 0 ) {
      return;
    }
  }

  getRoutBetweenPoints(start: [number, number], end: [number, number]){
    this.directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe(resp => this.drawPolyline(resp.routes[0]));
  }

  private drawPolyline(route: Route){
    //console.log({distance: route.distance/1000, duration: route.duration/60})

    if(!this.map){
      throw Error('No hay mapa disponible');
    }

    const coords = route.geometry.coordinates;
    const bounds = new LngLatBounds();

    coords.forEach(([lng, lat]) => {
      bounds.extend([lng, lat]);
    })

    this.map?.fitBounds(bounds, {
      padding:200
    });

    // Polyline (google maps) Linestring (Mapbox)
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      },
      maxzoom: 12,
      buffer: 0
    }

    // Para evitar el error a la hora de cambiar de ruta por el ID hay que limpiar ruta previa seleccionada
    if(this.map.getLayer('RouteString')){
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    this.map.addSource('RouteString', sourceData);

    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'orange',
        'line-width': 3
      }
    });

  }

}
