<?php
require_once 'config.php';

$conn = new mysqli('localhost', 'looge_user', 'W72W5ik5YFGiJEMe', 'looge_db');

if ($conn->connect_error) {
    die('Database connection failed: ' . $conn->connect_error);
}
$conn->set_charset('utf8mb4');
?>