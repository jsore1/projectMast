<?php
require_once('connect_db.php');
$stmt = $db->query("SELECT * FROM `tbl_with_data`");
$array = array();
while ($row = $stmt->fetch(PDO::FETCH_LAZY)) {
    array_push($array, array(
	'id' => $row->id,
	'date' => $row->date,
	'numberObject' => $row->number_object,
	'description' => $row->description,
	'secondName' => $row->second_name,
	'reportBool' => $row->report_bool,
	'reportText' => $row->report_text
	)
	);
}
echo json_encode($array);
?>