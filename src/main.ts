import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
 
Mapboxgl.accessToken = 'pk.eyJ1IjoiaXJhdGhvciIsImEiOiJjbDZhcm44YjUwOXJ0M2RucHVvMHlhaWw1In0.fCGrrS344j7mpV4X7UdX0Q';

if (!navigator.geolocation) {
  alert('No se puede geolocalizar'); //Mostrar el error al usuario
  throw new Error('No se puede geolocalizar'); //Mostrar el error por consola
}

//Renderizado de la aplicación
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
