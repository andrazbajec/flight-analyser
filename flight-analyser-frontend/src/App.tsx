import React, { useState, useEffect } from 'react';
import './App.css';
import FetchHelper from "./helper/FetchHelper";
import { QuoteDB, AppState } from "./interface/BaseInterface";
import dayjs from "dayjs";

const App = () => {
    const [getState, setState] = useState<AppState>({
        Quotes: []
    });

    const getQuotes = async () => {
        const quotes: QuoteDB[] = await FetchHelper.get('http://localhost:8000/getQuotes') as QuoteDB[];
        setState({ ...getState, Quotes: quotes });
    }

    useEffect(() => {
        getQuotes().then();
    }, [])

    return (
        <div className="App">
            <table className="quotes-table">
                <tr>
                    <td>ID</td>
                    <td>Price</td>
                    <td>Is direct flight</td>
                    <td>Origin ID</td>
                    <td>Destination ID</td>
                    <td>Departure date</td>
                    <td>Country of booking</td>
                </tr>
                {
                    getState.Quotes.map((quote: QuoteDB) => {
                        return (
                            <tr>
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
            </table>
        </div>
    );
}

export default App;
