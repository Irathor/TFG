export type FuelKey = 'gasoleo_a' | 'gasoleo_premium' | 'gasolina_95' | 'gasolina_98';

/** Nombre de la propiedad de precio correspondiente en OilStationProperties. */
export const FUEL_PROPERTY: Record<FuelKey, string> = {
    gasoleo_a: 'Precio_Gasoleo_A',
    gasoleo_premium: 'Precio_Gasoleo_Premium',
    gasolina_95: 'Precio_Gasolina_95_E5',
    gasolina_98: 'Precio_Gasolina_98_E5',
};

export const FUEL_LABEL: Record<FuelKey, string> = {
    gasoleo_a: 'Gasóleo A',
    gasoleo_premium: 'Gasóleo Premium',
    gasolina_95: 'Gasolina 95',
    gasolina_98: 'Gasolina 98',
};

export const FUEL_OPTIONS: Array<{ key: FuelKey; label: string }> =
    (Object.keys(FUEL_LABEL) as FuelKey[]).map(key => ({ key, label: FUEL_LABEL[key] }));
