export interface AppState {
    Quotes: QuoteDB[];
}

export interface QuoteDB {
    QuoteID: number;
    Price: number;
    Direct: number;
    OriginID: number;
    DestinationID: number;
    DepartureDate: number;
    DateAdded: string;
    Country: string;
}