<?php
require_once('connect_db.php');

$sql = "SELECT * FROM `img_archive` WHERE `point_id` = :id ORDER BY `id` DESC LIMIT 2";
$stmt = $db->prepare($sql);
$stmt->execute([':id' => $_POST['id']]);
$array = array();
while ($row = $stmt->fetch(PDO::FETCH_LAZY)) {
    array_push($array, array(
        'url' => $row->url,
        'description' => $row->description
        )
    );
}
echo json_encode($array);
?>