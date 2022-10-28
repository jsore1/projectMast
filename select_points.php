<?php
include_once "./database.php";

include_once "./point.php";

$database = new Database();
$db = $database->getConnection();
$point = new Point($db);
$stmt = $point->read();
$array = array();
while ($row = $stmt->fetch(PDO::FETCH_LAZY)) {
	array_push($array, array(
		'id' => $row->id,
		'x' => $row->x,
		'y' => $row->y,
		'name' => $row->name,
		'title' => $row->title,
		'date' => $row->date,
		'url' => $row->url_image
		)
	);
}
echo json_encode($array);
?>