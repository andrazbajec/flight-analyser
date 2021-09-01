export interface QuoteData {
    Quotes: Quote[];
    Carriers: Carrier[];
    Places: Place[];
    Currencies: Currency[];
}

export interface Quote {
    QuoteId: number;
    MinPrice: number;
    Direct: boolean;
    OutboundLeg: OutboundLeg;
    QuoteDateTime: string;
}

interface OutboundLeg {
    CarrierIds: number[];
    OriginId: number;
    DestinationId: number;
    DepartureDate: string;
}

export interface Carrier {
    CarrierId: number;
    Name: string;
}

export interface Place {
    Name: string;
    Type: string;
    PlaceId: number;
    SkyscannerCode: string;
    IataCode?: string;
    CityName?: string;
    CityId?: string;
    CountryName?: string;
}

export interface Currency {
    Code: string;
    Symbol: string;
    ThousandsSeparator: string;
    DecimalSeparator: string;
    SymbolOnLeft: boolean;
    SpaceBetweenAmountAndSymbol: boolean;
    RoundingCoefficient: number;
    DecimalDigits: number;
}

export interface CountryData {
    Countries: Country[];
}

export interface Country {
    Code: string;
    Name: string;
}