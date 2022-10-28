<?php
class ArchiveImage {
    private $conn;

    public $id;
    public $url;
    public $description;
    public $date;
    public $pointId;

    public function __construct($db) {
        $this->conn = $db;
    }
}
?>