import React, { SyntheticEvent, useEffect, useState } from 'react';
import './App.css';
import FetchHelper from "./helper/FetchHelper";
import {
    AppState,
    DateGroupings,
    GroupKeys,
    GroupKeysEnum,
    QuoteDB,
    SortKeys,
    SortKeysEnum
} from "./interface/BaseInterface";
import dayjs, { Dayjs } from "dayjs";
import { Button, HStack } from "@chakra-ui/react";

const App = () => {
    const [getState, setState] = useState<AppState>({
        Quotes: [],
        OriginalQuotes: [],
        Groupings: {
            Default: true,
            Date: false,
            Origin: false,
            Destination: false
        },
        Sorting: {
            Key: SortKeysEnum.QUOTE_ID,
            Ascending: true
        }
    });

    let counter = 0;

    const baseUrl = process.env.REACT_APP_API_URL ?? '';

    const getQuotes = () => {
        FetchHelper.get(`${baseUrl}/getQuotes`)
            .then((quotes: QuoteDB[]) => {
                setState({...getState, Quotes: quotes, OriginalQuotes: quotes});

            });
    }

    useEffect(() => {
        getQuotes();
    }, []);

    const groupQuotes = (event: SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const type: GroupKeys = event.currentTarget.dataset.groupBy as GroupKeys;
        const groupings = getState.Groupings;

        if (type === GroupKeysEnum.RESET) {
            groupings.Default = true;
            groupings.Date = groupings.Origin = groupings.Destination = false;
            setState({...getState, Quotes: getState.OriginalQuotes, Groupings: groupings});
            return;
        }

        if ([GroupKeysEnum.DATE, GroupKeysEnum.ORIGIN, GroupKeysEnum.DESTINATION].includes(type)) {
            const dateGroupings: DateGroupings = {};
            let groupingKey = '';

            if (type === GroupKeysEnum.DATE) {
                groupingKey = 'DepartureDate';
            }

            if (type === GroupKeysEnum.ORIGIN) {
                groupingKey = 'OriginID';
            }

            if (type === GroupKeysEnum.DESTINATION) {
                groupingKey = 'DestinationID';
            }

            const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1)
            groupings.Default = false;
            // @ts-ignore
            groupings[typeCapitalized] = true;

            for (const quote of getState.Quotes) {
                // @ts-ignore
                const index = quote[groupingKey];

                if (!dateGroupings[index]) {
                    dateGroupings[index] = quote;
                    continue;
                }

                if (quote.Price < dateGroupings[index].Price) {
                    dateGroupings[index] = quote;
                }
            }

            setState({...getState, Quotes: Object.values(dateGroupings), Groupings: groupings});
        }
    }

    const sortQuotes = (event: SyntheticEvent<HTMLTableDataCellElement>) => {
        event.preventDefault();

        const type: SortKeys = event.currentTarget.dataset.field as SortKeys;

        const quotes = getState.Quotes;
        const sorting = getState.Sorting;
        const toggleSort = sorting.Key === type;
        let sortedQuotes = toggleSort ? quotes : [];

        sorting.Ascending = toggleSort ? !sorting.Ascending : true;

        // No need to re-sort by the same key
        if (!toggleSort) {
            sortedQuotes = quotes;

            // Bubble sort isn't very efficient - find a better solution
            for (let i = 0; i < quotes.length - 1; i++) {
                const currQuote = quotes[i] ?? null;
                const nextQuote = quotes[i + 1] ?? null;

                if (!nextQuote || !currQuote) {
                    continue;
                }

                let currValue: string | number = String(currQuote[type]).trim();
                let nextValue: string | number = String(nextQuote[type]).trim();

                if (type === SortKeysEnum.DEPARTURE_DATE) {
                    const currDate: Dayjs = dayjs(currValue, 'DD.MM.YYYY');
                    const nextDate: Dayjs = dayjs(nextValue, 'DD.MM.YYYY');

                    if (currDate.isAfter(nextDate)) {
                        // Switch elements
                        [quotes[i], quotes[i + 1]] = [quotes[i + 1], quotes[i]];
                        i -= 2;
                    }

                    continue;
                }

                currValue = Number.isNaN(currValue)
                    ? currValue
                    : Number.parseFloat(String(currValue));
                nextValue = Number.isNaN(nextValue)
                    ? nextValue
                    : Number.parseFloat(String(nextValue));

                if (currValue > nextValue) {
                    // Switch elements
                    [quotes[i], quotes[i + 1]] = [quotes[i + 1], quotes[i]];
                    i -= 2;
                }
            }

            sorting.Key = type;
        } else {
            sortedQuotes.reverse();
        }

        setState({...getState, Quotes: sortedQuotes, Sorting: sorting});
    }

    return (
        <div className="App">
            <HStack justify="space-evenly">
                <Button onClick={groupQuotes}
                        colorScheme="teal"
                        disabled={getState.Groupings.Default}
                        data-group-by={GroupKeysEnum.RESET}
                >
                    Reset groupings
                </Button>
                <Button onClick={groupQuotes}
                        colorScheme="teal"
                        disabled={getState.Groupings.Date}
                        data-group-by={GroupKeysEnum.DATE}
                >
                    Group by date
                </Button>
                <Button onClick={groupQuotes}
                        colorScheme="teal"
                        disabled={getState.Groupings.Origin}
                        data-group-by={GroupKeysEnum.ORIGIN}
                >
                    Group by origin
                </Button>
                <Button onClick={groupQuotes}
                        colorScheme="teal"
                        disabled={getState.Groupings.Destination}
                        data-group-by={GroupKeysEnum.DESTINATION}
                >
                    Group by destination
                </Button>
            </HStack>
            <table className="quotes-table">
                <thead>
                <tr>
                    <td onClick={sortQuotes} data-field={SortKeysEnum.QUOTE_ID}>ID</td>
                    <td onClick={sortQuotes} data-field={SortKeysEnum.PRICE}>Price</td>
                    <td onClick={sortQuotes} data-field={SortKeysEnum.DIRECT}>Is direct flight</td>
                    <td onClick={sortQuotes} data-field={SortKeysEnum.ORIGIN_ID}>Origin ID</td>
                    <td onClick={sortQuotes} data-field={SortKeysEnum.DESTINATION_ID}>Destination ID</td>
                    <td onClick={sortQuotes} data-field={SortKeysEnum.DEPARTURE_DATE}>Departure date</td>
                    <td onClick={sortQuotes} data-field={SortKeysEnum.COUNTRY}>Country of booking</td>
                </tr>
                </thead>
                <tbody>
                {
                    getState.Quotes.map((quote: QuoteDB) => {
                        counter++;
                        return (
                            <tr key={`quote-table-row-${counter}`}>
                                <td>{quote.QuoteID}</td>
                                <td>{quote.Price} €</td>
                                <td>{quote.Direct ? 'yes' : 'no'}</td>
                                <td>{quote.OriginID}</td>
                                <td>{quote.DestinationID}</td>
                                <td>{dayjs(quote.DepartureDate).format('DD.MM.YYYY')}</td>
                                <td>{quote.Country}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    );
}

export default App;
