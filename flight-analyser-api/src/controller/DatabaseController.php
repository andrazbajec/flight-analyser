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

    /**
     * @param string $table
     * @param string[] $columns
     * @param array $condition
     * @param array $joins
     * @return array
     */
    public function select(string $table, array $columns = ['*'], array $condition = [], array $joins = []): array
    {
        $params = [];
        $columnsSql = '';
        $joinSql = '';

        foreach ($columns as $name => $alias) {
            // There is no alias on this column
            if (is_int($name)) {
                $name = $alias;
                $alias = null;
            }

            // Add comma to separate columns
            if (strlen($columnsSql)) {
                $columnsSql .= ', ';
            }

            $columnsSql .= $name;


            if ($alias) {
                $columnsSql .= sprintf(' %s', $alias);
            }
        }

        foreach ($joins as $join) {
            $joinType = $join['Type'];
            $joinTable = $join['Table'];
            $fKey = $join['ForeignKey'];
            $pKey = $join['PrimaryKey'];
            $alias = $join['Alias'] ?? '';

            $joinSql .= sprintf('%s JOIN %s %s ON %s = %s ', $joinType, $joinTable, $alias, $fKey, $pKey);
        }

        $sql = sprintf(
            "SELECT %s FROM $table %s",
            $columnsSql,
            $joinSql
        );

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll();
    }
}