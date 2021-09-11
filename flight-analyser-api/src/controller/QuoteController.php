<?php

namespace Controller;

class QuoteController
{
    private DatabaseController $databaseController;

    public function __construct()
    {
        $this->databaseController = new DatabaseController();
    }

    /**
     * @return array
     */
    public function getQuotes(): array
    {
        $columns = [
            'Quote.*',
            'Origin.Name' => 'Origin',
            'Destination.Name' => 'Destination',
            'Country.Name' => 'CountryName'
        ];

        $joins = [[
            'Type' => 'INNER',
            'Table' => 'Place',
            'Alias' => 'Origin',
            'ForeignKey' => 'Quote.OriginID',
            'PrimaryKey' => 'Origin.PlaceID'
        ], [
            'Type' => 'INNER',
            'Table' => 'Place',
            'Alias' => 'Destination',
            'ForeignKey' => 'Quote.DestinationID',
            'PrimaryKey' => 'Destination.PlaceID'
        ], [
            'Type' => 'INNER',
            'Table' => 'Country',
            'ForeignKey' => 'Quote.Country',
            'PrimaryKey' => 'Country.Code'
        ]];

        return $this->databaseController
            ->select('Quote', $columns, [], $joins);
    }
}