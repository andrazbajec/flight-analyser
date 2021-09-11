export interface AppState {
    Quotes: QuoteDB[];
    OriginalQuotes: QuoteDB[];
    Groupings: Groupings;
    Sorting: Sorting;
    LoadingQuotes: boolean;
}

interface Groupings {
    Default: boolean;
    Date: boolean;
    Origin: boolean;
    Destination: boolean;
}

interface Sorting {
    Key: SortKeys;
    Ascending: boolean;
}

export interface QuoteDB {
    QuoteID: number;
    Price: number;
    Direct: number;
    OriginID: number;
    Origin: string;
    DestinationID: number;
    Destination: string;
    DepartureDate: number;
    DateAdded: string;
    Country: string;
    CountryName: string;
}

export interface DateGroupings {
    [key: string]: QuoteDB
}

export enum GroupKeysEnum {
    RESET = 'reset',
    DATE = 'date',
    ORIGIN = 'origin',
    DESTINATION = 'destination'
}

export type GroupKeys = GroupKeysEnum.RESET
    | GroupKeysEnum.DATE
    | GroupKeysEnum.ORIGIN
    | GroupKeysEnum.DESTINATION;

export enum SortKeysEnum {
    QUOTE_ID = 'QuoteID',
    PRICE = 'Price',
    DIRECT = 'Direct',
    ORIGIN_ID = 'OriginID',
    ORIGIN = 'Origin',
    DESTINATION_ID = 'DestinationID',
    DESTINATION = 'Destination',
    DEPARTURE_DATE = 'DepartureDate',
    COUNTRY = 'Country'
}

export type SortKeys =
    SortKeysEnum.QUOTE_ID
    | SortKeysEnum.PRICE
    | SortKeysEnum.DIRECT
    | SortKeysEnum.ORIGIN_ID
    | SortKeysEnum.DESTINATION_ID
    | SortKeysEnum.DEPARTURE_DATE
    | SortKeysEnum.COUNTRY;