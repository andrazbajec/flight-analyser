<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require __DIR__ . '/vendor/autoload.php';

use Controller\DatabaseController;
use Controller\RouteController;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$db = new DatabaseController();
$routeController = new RouteController();

$response = $routeController->parseRoute($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

echo json_encode($response);