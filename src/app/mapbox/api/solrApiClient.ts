import { HttpClient, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class SolrApiClient extends HttpClient {
    
    public baseUrl: string = 'http://localhost:8983/solr/oilStations/select?indent=true&q.op=OR&q=*:*';
    public numRows: number = 0;
    public frStart: number = 0;
    public frEnd: number = 3;
    public frGap: number = 0.5;

    facet_params = {
        'facet.range.start': this.frStart,
        'facet.range.end': this.frEnd,
        'facet.range.gap': this.frGap,
        'facet.field': ['Estacion_str', 'Provincia_str'],
        'facet.range': ['Precio_Gasoleo_A', 'Precio_Gasoleo_Premium', 'Precio_Gasolina_95_E5', 'Precio_Gasolina_98_E5']
    }

    constructor( handler: HttpHandler){
        super(handler);
    }

    public override get<T>(url: string){

        url = this.baseUrl + url;

        return super.get<T>(url, {
            params: {
                fl: 'Estacion,Provincia,Latitud,Longitud,Precio_Gasoleo_A,Precio_Gasoleo_Premium,Precio_Gasolina_95_E5,Precio_Gasolina_98_E5',
                facet: true,
                'facet.sort': 'count',
                'facet.mincount': 1,
                ...this.facet_params,
                rows: this.numRows
            }
        });

    }

}
