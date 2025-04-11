<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "heatmaps_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Αποτυχία σύνδεσης: " . $conn->connect_error);
}

mysqli_set_charset($conn, "utf8");
?>
