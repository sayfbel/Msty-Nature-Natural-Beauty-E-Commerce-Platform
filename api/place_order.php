<?php
include 'config.php';
header('Content-Type: application/json');
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

// Initialize total
$total = 0;

// Recalculate total correctly
if (is_array($cart) && count($cart) > 0) {
    foreach ($cart as $item) {
        $price = isset($item['price']) ? floatval($item['price']) : 0;
        $qty = isset($item['qty']) ? intval($item['qty']) : 1;
        $offer = isset($item['offer']) ? floatval($item['offer']) : 0;
        $tax = isset($item['tax']) ? floatval($item['tax']) : 0;

        // Step 1: apply discount
        $discountedPrice = $price * (1 - abs($offer)/100);

        // Step 2: apply tax
        $priceWithTax = $discountedPrice * (1 + $tax/100);

        // Step 3: multiply by quantity
        $total += $priceWithTax * $qty;
    }
}

// Round total to 2 decimals
$total = round($total, 2);

// Save order in database
$stmt = $pdo->prepare("
  INSERT INTO orders (fullname, email, phone, address, cart, total)
  VALUES (?, ?, ?, ?, ?, ?)
");
$stmt->execute([
  $fullname, $email, $phone, $address, json_encode($cart), $total
]);

echo json_encode([
  'success' => true,
  'message' => 'Order placed successfully',
  'total' => $total
]);
