<?php
$dsn = "mysql:host=localhost;dbname=newstore;charset=utf8mb4";
$username = "root";
$password = "";

try {
  $pdo = new PDO($dsn, $username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  die("DB connection failed: " . $e->getMessage());
}
?>
