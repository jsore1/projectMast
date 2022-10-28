<?php
class Database {
    private $host = "localhost";
    private $dbName = "projectmast_db";
    private $userName = "root";
    private $password = "";
    public $conn;

    // Получаем соедиение с БД
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->dbName, $this->userName, $this->password);
            $this->conn->exec("set names utf8");
        } catch (PDOException $exception) {
            echo "Ошибка подключения: " . $exception->getMessage();
        }

        return $this->conn;
    }

}
?>