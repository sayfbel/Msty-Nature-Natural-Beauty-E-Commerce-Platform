<?php
include 'config.php';

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

$fullname = $data['fullname'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$address = $data['address'] ?? '';
$cart = $data['cart'] ?? [];
$item['offer'] = $data['offer'] ?? '';
$item['tax'] = $data['tax'] ?? '';

$total = 0;

if (is_array($cart) && count($cart) > 0) {
    foreach ($cart as $item) {
        $price = floatval($item['price'] ?? 0);
        $qty = intval($item['qty'] ?? 1);
        $offer = floatval($item['offer'] ?? 0);
        $tax = floatval($item['tax'] ?? 0);

        // Calculate offer and tax per item
        $priceAfterOffer = $price * (1 - abs($offer) / 100);
        $priceWithTax = $priceAfterOffer * (1 + abs($tax) / 100);

        $item['finalPrice'] = round($priceWithTax, 2); // optional: store per item
        $total += $priceWithTax * $qty;
    }
}

$total = round($total, 2);

$stmt = $pdo->prepare("
    INSERT INTO orders (fullname, email, phone, address, cart, total, offer, tax)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->execute([
    $fullname,
    $email,
    $phone,
    $address,
    json_encode($cart),
    $total,
    $offer,
    $tax
]);

echo json_encode([
    'success' => true,
    'message' => 'Order placed successfully',
    'total' => $total
]);
