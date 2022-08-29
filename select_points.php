<?php
require_once('connect_db.php');
$stmt = $db->query("SELECT * FROM `point_list`");
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