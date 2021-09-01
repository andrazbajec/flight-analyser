<?php

namespace Controller;

use JetBrains\PhpStorm\Pure;

class RouteController
{
    private QuoteController $quoteController;

    public function __construct()
    {
        $this->quoteController = new QuoteController();
    }

    /**
     * @param string $method
     * @param string $uri
     * @return array
     */
    function parseRoute(string $method, string $uri): array
    {
        switch ($method) {
            case 'GET':
                switch ($uri) {
                    case '/':
                        return ['data' => 'sample'];
                    case '/getQuotes':
                        return $this->quoteController->getQuotes();
                }
                break;
        }
        return [];
    }
}