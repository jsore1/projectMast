<?php
$db_name = 'projectmast_db';
$login = 'root';
$pass = '';
$db = new PDO('mysql:host=localhost;dbname=' . $db_name .';charset=utf8;', $login, $pass);
?>