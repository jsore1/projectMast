<?php
class Inspection {
    private $conn;

    public $id;
    public $date;
    public $numberObject;
    public $description;
    public $secondName;
    public $reportBool;
    public $reportText;

    public function __construct($db) {
        $this->conn = $db;
    }
}
?>