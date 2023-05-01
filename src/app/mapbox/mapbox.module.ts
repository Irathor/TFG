import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { LoadingComponent } from './components/loading/loading.component';
import { MapViewComponent } from './screens/map-view/map-view.component';
import { MapComponent } from './components/map/map.component';

import { PrimeNGModule } from '../prime-ng/prime-ng.module';
import { SearchResultsComponent } from './components/search-results/search-results.component';



@NgModule({
  providers: [
    CurrencyPipe
  ],
  declarations: [
    MapViewComponent,
    MapComponent,
    LoadingComponent,
    SearchResultsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    FormsModule
  ],
  //Se crea este exports para decir qué es lo que queremos mostrar como pantalla principal
  exports: [
    MapViewComponent
  ]
})
export class MapboxModule { }
