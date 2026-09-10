import { FuelKey } from './fuel';

export interface OilStationsFilter {
    provincias?: string[];
    estaciones?: string[];
    precio?: number[];
    /** Combustible sobre el que aplica el rango de precio. Por defecto, Gasóleo A. */
    combustible?: FuelKey;
    /** Centro y radio (en km) para buscar solo gasolineras cercanas a un punto. */
    cercaDe?: { lat: number; lon: number; radioKm: number };
}
