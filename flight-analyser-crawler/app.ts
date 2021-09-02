import dotenv from "dotenv";
import { Carrier, Country, CountryData, Place, Quote, QuoteData } from "./interfaces/BaseInterface";
import { CarrierDB, CountryDB, PlaceDB } from "./interfaces/DatabaseInterface";
import FetchHelper from "./helpers/FetchHelper";
import DatabaseHelper from "./helpers/DatabaseHelper";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import customParseFormat from "dayjs/plugin/customParseFormat"

async function main() {
    dotenv.config();
    dayjs.extend(isSameOrBefore);
    dayjs.extend(customParseFormat);

    const db = new DatabaseHelper();
    await db.init();

    const baseUrl = 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices';

    const headers = {
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
    };

    async function delay(ms: number = 1000) {
        return new Promise((res) => {
            setTimeout(res, ms);
        })
    }

    function getCurrencies() {
        const url = `${baseUrl}/reference/v1.0/currencies`;
        const config = {
            headers: headers
        };

        FetchHelper.get(url, config, 'getCurrencies');
    }

    async function getPlaces() {
        const country = 'UK';
        const query = 'Japan';
        const currency = 'GBP';
        const locale = 'en-GB';

        const url = `${baseUrl}/autosuggest/v1.0/${country}/${currency}/${locale}/`;

        const config = {
            params: {
                query: query
            },
            headers: headers
        }

        return await FetchHelper.get(url, config, 'getPlaces');
    }

    async function getCountries() {
        console.log('Getting countries from the API...');
        const config = {
            headers: headers
        };
        const url = `${baseUrl}/reference/v1.0/countries/en-US`;

        const data: CountryData = <CountryData>await FetchHelper.get(url, config, 'getCountries');

        console.log(`${data.Countries.length} countries received from the API...`);

        await addCountries(data.Countries);
    }

    async function addCountries(countriesArray: Country[]) {
        const countries = {};
        const [countryRows] = await db.select('Country');
        let countryCounter = 0;

        for (const country of countryRows as CountryDB[]) {
            // @ts-ignore
            countries[country.Code] = country;
        }

        let countryValues = '';
        const countryParams = [];

        for (const country of countriesArray) {
            // @ts-ignore
            const matchedCountry: CountryDB = countries[country.Code] ?? null;

            if (!matchedCountry) {
                countryCounter++;
                if (countryValues.length) {
                    countryValues += ',';
                }
                countryValues += '(?, ?)';
                countryParams.push(country.Code, country.Name);
                continue;
            }

            if (country.Code !== matchedCountry.Code || country.Name !== matchedCountry.Name) {
                throw new Error(`Carrier ${country.Name} can't be added as code ${country.Code} is already taken!`);
            }
        }

        if (countryValues.length) {
            console.log(`Saving ${countryCounter} countries to the database...`);
            const sql = `INSERT INTO Country(Code, Name)
                         VALUES ${countryValues};`;
            await db.query(sql, countryParams);
            console.log('Countries saved...')
        }
    }

    async function addPlaces(placesArray: Place[]) {
        const places = {};
        const [placeRows] = await db.select('Place');
        let placeCounter = 0;

        for (const place of placeRows as PlaceDB[]) {
            // @ts-ignore
            places[place.PlaceID] = place;
        }

        const countries = [];
        const stations = [];

        for (const place of placesArray) {
            // @ts-ignore
            const matchedPlace: PlaceDB | null = places[place.PlaceId] ?? null;

            if (!matchedPlace) {
                placeCounter++;
                switch (place.Type) {
                    case 'Country':
                        countries.push(place);
                        break;
                    case 'Station':
                        stations.push(place);
                        break;
                    default:
                        throw new Error(`${place.Type} is not a valid place type!`);
                }

                continue;
            }

            if (place.PlaceId !== matchedPlace.PlaceID
                || place.Name !== matchedPlace.Name
                || place.Type !== matchedPlace.Type
                || place.SkyscannerCode !== matchedPlace.SkyscannerCode
                || (place.IataCode ?? null) !== matchedPlace.IataCode
                || (place.CityName ?? null) !== matchedPlace.CityName
                || (place.CityId ?? null) !== matchedPlace.CityID
                || (place.CountryName ?? null) !== matchedPlace.CountryName
            ) {
                throw new Error(`Place ${place.Name} can't be added as ID ${place.PlaceId} is already taken!`);
            }
        }

        let countryValues = ''
        const countryParams = [];
        for (const country of countries) {
            if (countryValues.length) {
                countryValues += ', ';
            }
            countryValues += `(?, ?, ?, ?)`;
            countryParams.push(country.PlaceId, country.Name, country.Type, country.SkyscannerCode);
        }

        let sql = '';

        if (countryValues.length) {
            sql = `INSERT INTO Place(PlaceID, Name, Type, SkyscannerCode)
                   VALUES ${countryValues};`;
            await db.query(sql, countryParams);
        }

        let stationValues = ''
        const stationParams = [];
        for (const station of stations) {
            if (stationValues.length) {
                stationValues += ', ';
            }
            stationValues += `(?, ?, ?, ?, ?, ?, ?, ?)`;
            stationParams.push(station.PlaceId, station.Name, station.Type, station.SkyscannerCode, station.IataCode, station.CityName, station.CityId, station.CountryName);
        }

        if (stationValues.length) {
            sql = `INSERT INTO Place(PlaceID, Name, Type, SkyscannerCode, IataCode, CityName, CityID, CountryName)
                   VALUES ${stationValues};`;
            await db.query(sql, stationParams);
        }

        if (placeCounter) {
            console.log(`${placeCounter} new places were added...`);
        }
    }

    async function addCarriers(carriersArray: Carrier[]) {
        const carriers = {};
        const [carrierRows] = await db.select('Carrier');
        let carrierCounter = 0;

        for (const carrier of carrierRows as CarrierDB[]) {
            // @ts-ignore
            carriers[carrier.CarrierID] = carrier;
        }

        let carrierValues = '';
        const carrierParams = [];

        for (const carrier of carriersArray) {
            // @ts-ignore
            const matchedCarrier: CarrierDB = carriers[carrier.CarrierId] ?? null;

            if (!matchedCarrier) {
                carrierCounter++;
                if (carrierValues.length) {
                    carrierValues += ',';
                }
                carrierValues += '(?, ?)';
                carrierParams.push(carrier.CarrierId, carrier.Name);
                continue;
            }

            if (carrier.CarrierId !== matchedCarrier.CarrierID || carrier.Name !== matchedCarrier.Name) {
                throw new Error(`Carrier ${carrier.Name} can't be added as ID ${carrier.CarrierId} is already taken!`);
            }
        }

        if (carrierValues.length) {
            console.log(`${carrierCounter} new carriers were found...`);
            const sql = `INSERT INTO Carrier(CarrierID, Name)
                         VALUES ${carrierValues};`;
            await db.query(sql, carrierParams);
        }
    }

    async function addQuotes(quotesArray: Quote[], country: string) {
        const quoteParams = [];
        let quoteCounter = 0;
        let quoteValues = '';

        for (const quote of quotesArray) {
            if (quoteValues.length) {
                quoteValues += ', ';
                quoteCounter++;
            }
            quoteValues += '(?, ?, ?, ?, ?, ?)';
            quoteParams.push(quote.MinPrice, quote.Direct ? 1 : 0, quote.OutboundLeg.OriginId, quote.OutboundLeg.DestinationId, quote.OutboundLeg.DepartureDate, country)
        }

        if (quoteValues.length) {
            const sql = `INSERT INTO Quote(Price, Direct, OriginID, DestinationID, DepartureDate, Country)
                         VALUES ${quoteValues}`;
            await db.query(sql, quoteParams);
        }
    }

    async function browseQuotes(country: string, currency: string, locale: string, origin: string, destination: string, outboundDate: string) {
        const url = `${baseUrl}/browsequotes/v1.0/${country}/${currency}/${locale}/${origin}/${destination}/${outboundDate}`;

        const config = {
            params: {
                shortapikey: process.env.SHORT_API_KEY,
                apikey: '{shortapikey}'
            },
            headers: headers
        };

        console.log('Sending request to API for quotes...');
        const data: QuoteData = <QuoteData>await FetchHelper.get(url, config, 'browseQuotes');
        console.log(`${data.Quotes.length} quotes were found...`);

        await addPlaces(data.Places);
        await addCarriers(data.Carriers);
        await addQuotes(data.Quotes, country);
    }

    async function browseQuotesInRange(outboundDate: string) {
        const country = 'SI';
        const currency = 'EUR';
        const locale = 'en-US';
        const origin = 'IT-sky';
        const destination = 'JP-sky';
        browseQuotes(country, currency, locale, origin, destination, outboundDate).then(r => console.log(r));
    }

    async function getQuotesForAllCountries() {
        console.log('Getting quotes for all countries...')
        await getCountries();
        console.log('Got countries from API, saving to the database...');
        const [countryRows] = await db.select('Country');

        for (const country of countryRows as CountryDB[]) {
            let numberOfRequests = 0;
            let successfulRequest = false;
            while (numberOfRequests !== 10 && !successfulRequest) {
                numberOfRequests++;
                console.log(`Browsing quotes for ${country.Name}...`);
                try {
                    const currency = 'EUR';
                    const locale = 'en-US';
                    const origin = 'IT-sky';
                    const destination = 'JP-sky';
                    const outboundDate = '2022-08';

                    await browseQuotes(country.Code, currency, locale, origin, destination, outboundDate);
                    successfulRequest = true;
                } catch (e) {
                    console.log(`Exception when requesting quotes. Error: ${e.message}. Retry no. ${numberOfRequests}`)
                    await delay(10000);
                }
            }
        }
    }

    await getQuotesForAllCountries();
}

main().then(_ => console.log('APP FINISHED!'));