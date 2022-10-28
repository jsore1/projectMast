<?php
include_once "./database.php";

include_once "./point.php";

if (isset($_POST['x']) && isset($_POST['y']) && isset($_POST['name']) && isset($_POST['title']) && isset($_POST['date']) && isset($_POST['url'])) {
	$database = new Database();
	$db = $database->getConnection();
	$point = new Point($db);
	$point->add(
		$_POST["x"],
		$_POST["y"],
		$_POST["name"],
		$_POST["title"],
		$_POST["date"],
		$_POST["url"]
	);
	echo 1;
} else {
	echo -1;
}
?>