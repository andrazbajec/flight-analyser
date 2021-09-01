<?php

namespace Controller;

use Exception;
use PDO;

class DatabaseController
{
    private PDO $db;

    /**
     * @throws Exception
     */
    public function __construct()
    {
        $dsn = sprintf(
            'mysql:host=%s;dbname=%s;charset=utf8mb4',
            $_ENV['MYSQL_HOST'],
            $_ENV['MYSQL_DATABASE']
        );

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ];

        try {
            $db = new PDO($dsn, $_ENV['MYSQL_USER'], $_ENV['MYSQL_PASSWORD'], $options);
            $this->db = $db;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function select (string $table, array $columns = ['*'], array $condition = []): array
    {
        $sqlColumns = '';
        $params = [];

        $sql = sprintf(
            "SELECT %s FROM $table",
            implode(', ', $columns)
        );

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll();
    }
}