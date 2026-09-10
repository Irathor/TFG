export interface FacetItem {
    name: string;
    count: number;
}

export interface FacetsResponse {
    provincias: FacetItem[];
    estaciones: FacetItem[];
}
