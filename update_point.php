<?php
require_once('connect_db.php');

if (isset($_POST['id']) && isset($_POST['date']) && isset($_POST['url']) && isset($_POST['description'])) {
	$id = $_POST['id'];
	$date = $_POST['date'];
	$url = $_POST['url'];
	
	$sql_point = "SELECT * FROM `point_list` WHERE `id` = :id";
	$stmt_point = $db->prepare($sql_point);
	$stmt_point->execute([':id' => $id]);
	while ($row = $stmt_point->fetch(PDO::FETCH_LAZY)) {
		$array = [':point_id' => $row->id, ':url' => $row->url_image, ':date' => $row->date];
	}
	
	$sql_archive = "INSERT INTO `img_archive` (`url`, `description`, `date`, `point_id`) VALUES (:url, :date, '0000-00-00', :point_id)";
	$stmt_archive = $db->prepare($sql_archive);
	$stmt_archive->execute($array);
	
	$id = $_POST['id'];
	$date = $_POST['description'];
	$url = $_POST['url'];
	$sql = "UPDATE `point_list` SET `date` = :date, `url_image` = :url WHERE `id` = :id";
	$stmt = $db->prepare($sql);
	$stmt->execute([':date' => $date, ':url' => $url, ':id' => $id]);
	echo 1;
} else {
	echo -1;
}
?>