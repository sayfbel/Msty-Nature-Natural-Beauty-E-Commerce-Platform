<?php
include 'config.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$stmt = $pdo->query("SELECT * FROM products ORDER BY id DESC");
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($data as &$p) {
    // Main image
    if (isset($p['image']) && !empty($p['image'])) {
        $p['image'] = "http://localhost/new-store/api/" . $p['image'];
    }

    // Multiple images
    if (isset($p['images']) && !empty($p['images'])) {
        $images = json_decode($p['images'], true); // decode JSON string
        if (is_array($images)) {
            $images = array_map(fn($img) => "http://localhost/new-store/api/" . $img, $images);
            $p['images'] = $images;
        } else {
            $p['images'] = [$p['image']]; // fallback
        }
    } else {
        $p['images'] = [$p['image']]; // fallback
    }
}

echo json_encode($data);
?>
