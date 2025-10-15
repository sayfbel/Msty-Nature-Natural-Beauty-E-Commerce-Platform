<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id'] ?? 0);

    if ($id > 0) {
        // 🧹 Fetch the product first to delete its images
        $stmt = $pdo->prepare("SELECT image, images FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            // 🧾 Delete main image + gallery images from uploads
            $imagePaths = json_decode($product['images'], true) ?? [];
            if (!empty($product['image'])) $imagePaths[] = $product['image'];

            foreach ($imagePaths as $img) {
                $path = "./" . $img;
                if (file_exists($path)) unlink($path);
            }

            // 🗑️ Delete from DB
            $deleteStmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
            $deleteStmt->execute([$id]);

            echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Product not found']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid ID']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
