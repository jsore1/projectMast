<?php
class Point {
    private $conn;
    private $tableName = "point_list";

    public $x;
    public $y;
    public $name;
    public $title;
    public $date;
    public $url;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function add($x, $y, $name, $title, $date, $url) {
        $this->x = htmlspecialchars(strip_tags($x));
        $this->y = htmlspecialchars(strip_tags($y));
        $this->name = htmlspecialchars(strip_tags($name));
        $this->title = htmlspecialchars(strip_tags($title));
        $this->date = htmlspecialchars(strip_tags($date));
        $this->url = htmlspecialchars(strip_tags($url));

        $query = "INSERT INTO 
            " . $this->tableName . "  
            VALUES 
            (:x,:y,:name,:title,:date,:url, 0, 0, 0)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            ":x" => $this->x,
            ":y" => $this->y,
            ":name" => $this->name,
            ":title" => $this->title,
            ":date" => $this->date,
            ":url" => $this->url
        ]);
    }

    public function read() {
        $query = "SELECT * FROM " . $this->tableName;
        $stmt = $this->conn->query($query);
        
        return $stmt;
    }
}
?>