<?php
require_once('connect_db.php');

if (isset($_POST['x']) && isset($_POST['y']) && isset($_POST['name']) && isset($_POST['title']) && isset($_POST['date']) && isset($_POST['url'])) {
	$x = $_POST['x'];
	$y = $_POST['y'];
	$name = $_POST['name'];
	$title = $_POST['title'];
	$date = $_POST['date'];
	$url = $_POST['url'];
	$sql = "INSERT INTO `point_list` (`x`, `y`, `name`, `title`, `date`, `url_image`, `copter`, `mast`, `prop`) VALUES (:x,:y,:name,:title,:date,:url,0, 0, 0)";
	$stmt = $db->prepare($sql);
	$stmt->execute([':x' => $x, ':y' => $y, ':name' => $name, ':title' => $title, ':date' => $date, ':url' => $url]);
	echo 1;
} else {
	echo -1;
}
?>