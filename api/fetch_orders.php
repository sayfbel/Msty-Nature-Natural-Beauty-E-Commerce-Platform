<?php
include 'config.php';
header('Content-Type: application/json');

$orders = $pdo->query("SELECT * FROM orders ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($orders);
