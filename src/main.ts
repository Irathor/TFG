import { provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// MapLibre GL JS no necesita ningún token: el estilo del mapa se sirve
// gratis desde OpenFreeMap (ver map.component.ts).

// Nota: no hace falta enableProdMode() — el build de producción de Angular CLI
// ya elimina el código de solo-desarrollo a nivel de compilación (Ivy), la
// llamada en tiempo de ejecución es un no-op heredado de versiones antiguas.

if (!navigator.geolocation) {
  alert('No se puede geolocalizar'); //Mostrar el error al usuario
  throw new Error('No se puede geolocalizar'); //Mostrar el error por consola
}

platformBrowserDynamic().bootstrapModule(AppModule, {
    applicationProviders: [provideZoneChangeDetection({ eventCoalescing: true })],
  })
  .catch(err => console.error(err));
