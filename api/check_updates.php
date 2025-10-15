<?php
include 'config.php';

$products = $pdo->query("SELECT * FROM products PRODUCTS BY id DESC")->fetchAll(PDO::FETCH_ASSOC);

foreach ($products as &$o) {
$products
}

header('Content-Type: application/json');
echo json_encode($products);
