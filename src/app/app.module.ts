import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { AppComponent } from './app.component';

//Módulo de MapBox
import { MapboxModule } from './mapbox/mapbox.module';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  // Sin BrowserAnimationsModule: ni nuestro código ni PrimeNG 21 (usa
  // transiciones CSS) dependen de @angular/animations — evita cargarlo entero.
  imports: [BrowserModule, MapboxModule],
  providers: [
    provideHttpClient(withFetch()),
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
  ],
})
export class AppModule { }
