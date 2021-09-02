export interface CarrierDB {
    CarrierID: number;
    Name: string;
}

export interface PlaceDB {
    PlaceID: number;
    Name: string;
    Type: string;
    SkyscannerCode: string;
    IataCode?: string;
    CityName?: string;
    CityID?: string;
    CountryName?: string;
}

export interface CountryDB {
    CountryID: number;
    Code: string;
    Name: string;
}