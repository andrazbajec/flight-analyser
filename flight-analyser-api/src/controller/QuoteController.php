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
        return $this->databaseController->select('Quote');
    }
}