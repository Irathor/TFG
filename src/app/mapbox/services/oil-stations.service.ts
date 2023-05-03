import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OilStations } from '../interfaces/oilstations';
import { SolrApiClient } from '../api';
import { SolrRequest } from '../interfaces/solrRequest';

@Injectable({
  providedIn: 'root'
})
export class OilStationsService {
  
  //public oilStationsInfo: string | '' | undefined;

  constructor(private solr: SolrApiClient) { }

  public getOilStationsInfo(solrRequest: SolrRequest = {}): Observable<OilStations> {

    let fq: string = '';
    let fq_provincias: string = '';
    let fq_estaciones: string = '';
    //Si el objeto de búsqueda tiene el filtro estación añadimos el filtro correspondiente
    //this.fq='&fq=Estacion:repsol';
    //this.fq="&fq=Latitud:[40.3 TO 43.8]&fq=Longitud:[-3.73 TO -2.42]"

    /*return this.http.get<OilStations[]> ('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/');*/
    /*return this.solr.get<OilStations> ("http://localhost:8983/solr/oilStations/select?indent=true&q.op=OR&q=*:*"
                                        +fq
                                        +"&fl=Estacion,Provincia,Latitud,Longitud,Precio_Gasoleo_A,Precio_Gasoleo_Premium,Precio_Gasolina_95_E5,Precio_Gasolina_98_E5"
                                        +"&facet=true&facet.sort=count"
                                        +"&facet.mincount=1"
                                        +"&facet.field=Estacion_str"
                                        +"&facet.field=Provincia_str"
                                        +"&facet.range.start=0&facet.range.end=3&facet.range.gap=0.5"
                                        +"&facet.range=Precio_Gasoleo_A"
                                        +"&facet.range=Precio_Gasoleo_Premium"
                                        +"&facet.range=Precio_Gasolina_95_E5"
                                        +"&facet.range=Precio_Gasolina_98_E5"
                                        +"&rows=1000");*/
    //console.log(solrRequest.provincias, solrRequest.estaciones)

    if (!!solrRequest.provincias){
      
      fq_provincias += solrRequest.provincias.map(p => 'Provincia_str:"' + p +'"').join(' OR ');

    }

    if (!!solrRequest.estaciones){

      fq_estaciones += solrRequest.estaciones.map(p => 'Estacion_str:"' + p +'"').join(' OR ');

    }

    if (!!fq_provincias && !fq_estaciones){
      fq = fq_provincias;
    } else if(!fq_provincias && !!fq_estaciones){
      fq = fq_estaciones;
    } else if(!!fq_provincias && !!fq_estaciones){
      fq = '(' + fq_provincias + ')' +' AND ' + '(' + fq_estaciones + ')';
    }

    if (fq == ''){
      this.solr.numRows= 0;
    }else{
      this.solr.numRows= 11880;
    }

    console.log(fq)

    return this.solr.get<OilStations>(`&fq=${fq}`);
    /*return this.solr.get<OilStations>(`&fq=${fq}&facet.range.start=0&facet.range.end=3&facet.range.gap=0.5` 
                                      +"&facet.field=Estacion_str"
                                      +"&facet.field=Provincia_str"
                                      +"&facet.range=Precio_Gasoleo_A"
                                      +"&facet.range=Precio_Gasoleo_Premium"
                                      +"&facet.range=Precio_Gasolina_95_E5"
                                      +"&facet.range=Precio_Gasolina_98_E5");*/

                                        
  }
}
