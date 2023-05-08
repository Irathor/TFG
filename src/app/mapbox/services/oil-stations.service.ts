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
    let fq_precio: string = '';
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

    if (!!solrRequest.provincias && solrRequest.provincias.length > 0){
      
      fq_provincias += solrRequest.provincias.map(p => 'Provincia_str:"' + p +'"').join(' OR ');

      if (fq == ''){
        fq = '(' + fq_provincias + ')';
      }else{
        fq = fq + ' AND (' + fq_provincias + ')';
      }

    }

    if (!!solrRequest.estaciones && solrRequest.estaciones.length > 0){

      console.log(solrRequest.estaciones)
      fq_estaciones += solrRequest.estaciones.map(p => 'Estacion_str:"' + p +'"').join(' OR ');

      console.log('estaciones ' + fq_estaciones)
      if (fq === ''){
        fq = '(' + fq_estaciones + ')';
      }else{
        fq = fq + ' AND (' + fq_estaciones + ')';
      }

    }

    if (!!solrRequest.precio){

      let min = !!solrRequest.precio[0] ? solrRequest.precio[0] : '*';
      let max = !!solrRequest.precio[1] ? solrRequest.precio[1]: '*';

      fq_precio = '(Precio_Gasoleo_A:[' + solrRequest.precio[0] + ' TO ' + solrRequest.precio[1] + '] OR ' 
                  + 'Precio_Gasoleo_Premium:[' + solrRequest.precio[0] + ' TO ' + solrRequest.precio[1] + '] OR '
                  + 'Precio_Gasolina_95_E5:[' + solrRequest.precio[0] + ' TO ' + solrRequest.precio[1] + '] OR '
                  + 'Precio_Gasolina_98_E5:[' + solrRequest.precio[0] + ' TO ' + solrRequest.precio[1] + '])';

      if (fq === ''){
        fq = fq_precio;
      }else{
        fq = fq + ' AND ' + fq_precio;
      }

    }

    

    /*if (!!fq_provincias && !fq_estaciones){
      fq = fq_provincias;
    } else if(!fq_provincias && !!fq_estaciones){
      fq = fq + ' AND ' + fq_estaciones;
    } else if(!!fq_provincias && !!fq_estaciones){
      fq = fq + ' AND ' + '(' + fq_provincias + ')' +' AND ' + '(' + fq_estaciones + ')';
    }*/

    /*if (fq == ''){
      this.solr.numRows= 0;
    }else{
      this.solr.numRows= 11880;
    }*/

    if (!!fq_estaciones || !!fq_provincias){
      this.solr.numRows= 11880;
    }else{
      this.solr.numRows= 0;
    }

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
