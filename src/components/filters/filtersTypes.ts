export const roomsOptions = [1, 2, 3, 4, 5] as const;
export type RoomsOption = typeof roomsOptions[number]
export const homeTypeOptions = [ 'house', 'townhome', 'multi-family', 'condos/co-ops', 'lots/land', 'apartment', 'manufactured'] as const
export type HomeTypeOption = typeof homeTypeOptions[number];;
export const dealTypeOptions = ['rent', 'sale'] as const;
export type DealTypeOption = typeof dealTypeOptions[number];

export interface Price {
    minPrice?: number | null;
    maxPrice?: number | null;
}

export interface FiltersOptions {
    creator?: string;
    location?: string | null;
    dealType?: DealTypeOption | null;
    price?: Price;
    bedrooms?: RoomsOption | null;
    bathrooms?: RoomsOption | null;
    homeType?: HomeTypeOption | null;
}
