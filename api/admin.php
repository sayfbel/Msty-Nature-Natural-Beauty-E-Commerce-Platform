<?php
include 'config.php';

// 🧾 جلب الطلبات
$orders = $pdo->query("SELECT * FROM orders ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);

// 🧱 إضافة منتج جديد
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $price = $_POST['price'];
    $description = $_POST['description'];
    $offer = 0 - abs($_POST['offer'] ?? 0);
    $tax = 0 + abs($_POST['tax'] ?? 0);

    $images = [];
    if (!empty($_FILES['images']['name'][0])) {
        $uploadDir = './uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
            if ($_FILES['images']['error'][$index] !== UPLOAD_ERR_OK) continue;
            if ($_FILES['images']['size'][$index] > 2 * 1024 * 1024) {
                echo "<script>alert('⚠️ Une image dépasse 2MB');</script>";
                continue;
            }
            $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!in_array($_FILES['images']['type'][$index], $allowedTypes)) {
                echo "<script>alert('❌ Type de fichier non autorisé!');</script>";
                continue;
            }

            $fileName = time() . '_' . basename($_FILES['images']['name'][$index]);
            $target = $uploadDir . $fileName;

            if (move_uploaded_file($tmpName, $target)) {
                $images[] = 'uploads/' . $fileName;
            }
        }
    }

    $mainImage = $images[0] ?? '';

    // ✅ Fixed: 7 columns → 7 placeholders
    $stmt = $pdo->prepare("INSERT INTO products (title, price, description, image, images, offer, tax) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$title, $price, $description, $mainImage, json_encode($images), $offer, $tax]);

    echo "<script>alert('✅ Product added successfully!'); window.location.href='admin.php';</script>";
    exit;
}
// 🗑️ حذف جميع الطلبات
if (isset($_GET['delete_all_orders'])) {
    $pdo->exec("DELETE FROM orders");
    echo "<script>alert('🗑️ All orders deleted successfully!'); window.location.href='admin.php';</script>";
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>🛍️ Admin Panel</title>
<style>
  /* 🌟 Global Style */
  body {
    font-family: 'Poppins', sans-serif;
    background: #f4f5f7;
    color: #1f1f1f;
    margin: 0;
    padding: 20px;
  }

  /* 🧭 Page Title */
  h2 {
    font-size: 22px;
    color: #222;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* 🧾 Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    margin-bottom: 40px;
  }

  th, td {
    padding: 14px 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
    font-size: 15px;
  }

  th {
    background: #fff;
    color: #444;
    font-weight: 600;
    text-transform: uppercase;
  }

  tr:hover {
    background-color: #fafafa;
  }

  /* 🧠 Cards for cart details */
  .cart-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cart-item {
    display: flex;
    align-items: center;
    gap: 15px;
    background: #fafafa;
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }

  .cart-item img {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    object-fit: cover;
    border: 1px solid #ddd;
  }

  .cart-info strong {
    font-size: 15px;
    color: #222;
  }

  .cart-info small {
    color: #666;
  }

  /* 🧩 Form */
  form {
    background: #fff;
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    max-width: 600px;
    margin: 40px auto;
  }

  input, textarea {
    width: 95%;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #ddd;
    margin-top: 10px;
    font-size: 15px;
    transition: border-color 0.2s;
  }

  input:focus, textarea:focus {
    border-color: #007bff;
    outline: none;
  }

  /* 🖼️ Image Preview */
  .preview-container {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .preview-container img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #ddd;
  }

  /* 🧱 Buttons */
  button {
    padding: 12px 18px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.3s ease;
  }

  button:hover {
    opacity: 0.9;
  }

  button[type="submit"] {
    background: #000;
    color: white;
  }

  button.delete-btn {
    background: #d9534f;
    color: white;
  }

  button.delete-btn:hover {
    background: #b52b27;
  }

  button.export {
    margin-right: 10px;
    background: #007bff;
    color: white;
  }

  button.export.excel {
    background: #28a745;
  }

  /* 🧭 Footer */
  footer {
    text-align: center;
    color: #777;
    padding: 20px 0;
    font-size: 14px;
    margin-top: 30px;
  }

</style>
</head>
<body>

    <h2>📦 Commandes</h2>

    <!-- 🔘 أزرار التصدير -->
    <div style="margin-bottom: 15px;">
    <button onclick="exportTableToPDF()" style="padding:8px 15px; background:#007bff; color:white; border:none; border-radius:5px;">📄 Export PDF</button>
    <button onclick="exportTableToExcel()" style="padding:8px 15px; background:#28a745; color:white; border:none; border-radius:5px;">📊 Export Excel</button>
    <button onclick="deleteAllOrders()" style="padding:8px 15px; background:#d9534f; color:white; border:none; border-radius:5px;">🗑️ Delete All Orders</button>
    </div>

    <table id="ordersTable" border="1" cellspacing="0" cellpadding="8">
        <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Number</th>
            <th>Offer</th>
            <th>Tax</th>
            <th>Total</th>
            <th>Détails</th>
            <th>Date</th>
        </tr>
        <?php foreach ($orders as $o): ?>
            <tr>
                <td><?= $o['id'] ?></td>
                <td><?= htmlspecialchars($o['fullname']) ?></td>
                <td><?= htmlspecialchars($o['phone']) ?></td>
                <td><?= htmlspecialchars($o['offer']) ?>%</td>
                <td><?= htmlspecialchars($o['tax']) ?>%</td>
                <td><strong><?= $o['total'] ?> MAD</strong></td>
                <td>
                <?php 
                $cartData = json_decode($o['cart'], true);
                if (is_array($cartData)): ?>
                    <div class="cart-details">
                    <?php foreach ($cartData as $item): 
                    $image = isset($item['image']) ? str_replace("http://localhost/new-store/api/", "", $item['image']) : '';
                    ?>
                    <div class="cart-item">
                        <img src="<?= htmlspecialchars($image) ?>" alt="" width="50">
                        <div class="cart-info">
                        <strong><?= htmlspecialchars($item['title']) ?></strong>
                        <small>Prix: <?= $item['price'] ?> MAD</small>
                        <small>Quantité: <?= $item['qty'] ?></small>
                        <?php if (!empty($item['size'])): ?>
                            <small>Taille: <?= htmlspecialchars($item['size']) ?></small>
                        <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <em>No details available</em>
                <?php endif; ?>
                </td>
                <td><?= $o['created_at'] ?></td>
            </tr>
        <?php endforeach; ?>
    </table>

    <hr>
    <h2>🛒 Add New Product</h2>
    <form method="POST" enctype="multipart/form-data" id="productForm">
        <input type="text" name="title" placeholder="Product Title" required>
        <input type="number" step="0.01" name="price" placeholder="Price (MAD)" required>
        <textarea name="description" placeholder="Description" required></textarea>
        <input type="number" name="offer" placeholder="Offer %" min="0" max="100">
        <input type="number" name="tax" placeholder="tax delivery" min="0" max="100">
        <input type="file" id="images" accept="image/*">
        <div class="preview-container" id="preview"></div>
        <button type="submit">Add Product</button>
    </form>
    <hr>
    <h2>🧾 Products List</h2>
    <table id="productTable">
        <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Offer</th>
            <th>tax</th>
            <th>Actions</th>
        </tr>
        <?php
        $products = $pdo->query("SELECT * FROM products ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
        foreach ($products as $p): ?>
        <tr id="product-<?= $p['id'] ?>">
            <td><?= $p['id'] ?></td>
            <td><img src="./<?= htmlspecialchars($p['image']) ?>" width="60" style="border-radius:6px;"></td>
            <td><?= htmlspecialchars($p['title']) ?></td>
            <td><?= $p['price'] ?> MAD</td>
            <td><?= $p['offer'] ?>%</td>
            <td><?= $p['tax'] ?>%</td>
            <td>
                <button onclick="deleteProduct(<?= $p['id'] ?>)">🗑️ Delete</button>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>

<!-- ✅ Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.29/jspdf.plugin.autotable.min.js"></script>
<script>

  const input = document.getElementById('images');
  const preview = document.getElementById('preview');
  let selectedFiles = []; // store selected files

  function updatePreview() {
      preview.innerHTML = '';
      selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = e => {
          const container = document.createElement('div');
          container.style.position = 'relative';
          container.style.display = 'inline-block';
          container.style.marginRight = '10px';

          const img = document.createElement('img');
          img.src = e.target.result;
          img.style.width = '80px';
          img.style.height = '80px';
          img.style.objectFit = 'cover';
          img.style.borderRadius = '8px';
          img.style.border = '1px solid #ddd';
          container.appendChild(img);

          const removeBtn = document.createElement('button');
          removeBtn.innerHTML = '❌';
          Object.assign(removeBtn.style, {
            position: 'absolute', top: '-8px', right: '-8px', border: 'none',
            background: '#d9534f', color: '#fff', borderRadius: '50%', cursor: 'pointer',
            width: '20px', height: '20px', fontSize: '12px', padding: '0'
          });
          removeBtn.onclick = () => {
            selectedFiles.splice(index, 1);
            updatePreview();
          };
          container.appendChild(removeBtn);

          preview.appendChild(container);
        };
        reader.readAsDataURL(file);
      });
  }
  // 🗑️ حذف جميع الطلبات
  function deleteAllOrders() {
    if (confirm("⚠️ Are you sure you want to delete ALL orders? This action cannot be undone!")) {
      window.location.href = "admin.php?delete_all_orders=1";
    }
  }

  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    // check file size/type
    if (file.size > 2 * 1024 * 1024) {
      alert('⚠️ Image too large (max 2MB)');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('❌ Type de fichier non autorisé!');
      return;
    }

    selectedFiles.push(file);
    updatePreview();

    input.value = ''; // reset input to allow re-upload same file if removed
  });

  // override form submit to include dynamic files
  const form = document.getElementById('productForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);

    selectedFiles.forEach(file => formData.append('images[]', file));

    fetch(form.action || '', {
      method: 'POST',
      body: formData
    })
    .then(res => res.text())
    .then(data => {
      // Instead of replacing the page, show notification
      showNotification("✅ Product added successfully!");
      form.reset();
      selectedFiles = [];
      updatePreview();
      
      // Optionally, reload the products table after a short delay
      setTimeout(() => {
        location.reload();
      }, 1500);
    })
    .catch(err => {
      console.error(err);
      showNotification("❌ Error adding product!");
    });
  });

  function showNotification(text) {
    const box = document.createElement('div');
    box.textContent = text;
    Object.assign(box.style, {
      position: 'fixed', top: '20px', right: '20px', background: '#303030', color: 'white',
      padding: '15px 20px', borderRadius: '10px', boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
      zIndex: '9999', fontWeight: 'bold', transition: 'opacity 0.5s'
    });
    document.body.appendChild(box);
    setTimeout(() => { box.style.opacity = '0'; setTimeout(() => box.remove(), 500); }, 4000);
  }

  function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    fetch("http://localhost/new-store/api/delete_product.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${id}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            document.getElementById(`product-${id}`).remove();
            showNotification("🗑️ " + data.message);
        } else {
            alert("❌ " + data.message);
        }
    })
    .catch(err => alert("Error deleting product: " + err));
  }

  // 📄 تصدير PDF
  function exportTableToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("📦 Liste des Commandes", 14, 15);
    doc.autoTable({ html: '#ordersTable', startY: 20, theme: 'grid', headStyles: { fillColor: [41,128,185] } });
    doc.save('commandes.pdf');
  }

  // 📊 تصدير Excel (CSV)
  function exportTableToExcel() {
    const table = document.getElementById("ordersTable");
    let csv = [];
    for (let i = 0; i < table.rows.length; i++) {
        let row = [], cols = table.rows[i].querySelectorAll("td, th");
        for (let j = 0; j < cols.length; j++)
        row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
        csv.push(row.join(","));
    }
    let csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
    let downloadLink = document.createElement("a");
    downloadLink.download = "commandes.csv";
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.click();
  }
</script>
</body>
</html>
<script>
  let lastOrderCount = document.querySelectorAll("#ordersTable tr").length - 1;

  // ✅ إعداد الصوت
  const notificationSound = new Audio("http://localhost/new-store/api/Audio/mixkit-correct-answer-tone-2870.mp3");
  notificationSound.volume = 0.7; // 🔊 حجم متوسط

  // ✅ تحديث الطلبات تلقائيًا
  async function refreshOrders() {
    try {
      const response = await fetch("http://localhost/new-store/api/fetch_orders.php?time=" + Date.now());
      const data = await response.json();

      if (!Array.isArray(data)) return; // تأكد أن النتيجة صحيحة

      // 🔔 إذا العدد تغيّر
      if (data.length !== lastOrderCount) {
        // ✅ تشغيل الصوت فقط إذا الطلبات زادت
        if (data.length > lastOrderCount) {
          // تشغيل الصوت بعد تفاعل المستخدم
          if (typeof notificationSound.play === "function") {
            notificationSound.currentTime = 0;
            notificationSound.play().catch(err => console.log("🔇 Audio not allowed yet:", err));
          }
          showNotification("🆕 Nouvelle commande reçue !");
        }

        lastOrderCount = data.length;

        // 🧾 تحديث الجدول
        const table = document.getElementById("ordersTable");
        table.innerHTML = `
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Number</th>
            <th>Total</th>
            <th>Détails</th>
            <th>Date</th>
          </tr>
        `;

        data.forEach(o => {
          const cartData = JSON.parse(o.cart || "[]");
          const detailsHTML = cartData.map(item => `
            <div class="cart-item">
              <img src="${item.image?.replace('http://localhost/new-store/api/', '') || ''}" width="50">
              <div class="cart-info">
                <strong>${item.title}</strong>
                <small>Prix: ${item.price} MAD</small>
                <small>Quantité: ${item.qty}</small>
                ${item.size ? `<small>Taille: ${item.size}</small>` : ""}
              </div>
            </div>
          `).join('');

          table.innerHTML += `
            <tr>
              <td>${o.id}</td>
              <td>${o.fullname}</td>
              <td>${o.phone}</td>
              <td><strong>${o.total} MAD</strong></td>
              <td><div class="cart-details">${detailsHTML}</div></td>
              <td>${o.created_at}</td>
            </tr>
          `;
        });
      }
    } catch (error) {
      console.error("❌ Error refreshing orders:", error);
    }
  }

  // ✅ إشعار مرئي
  function showNotification(text) {
    const box = document.createElement('div');
    box.textContent = text;
    Object.assign(box.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#303030',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '10px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
      zIndex: '9999',
      fontWeight: 'bold',
      transition: 'opacity 0.5s',
    });
    document.body.appendChild(box);
    setTimeout(() => { box.style.opacity = '0'; setTimeout(() => box.remove(), 500); }, 4000);
  }

  // 🔄 التحديث كل 5 ثواني
  setInterval(refreshOrders, 5000);

  // 📢 المتصفحات الحديثة تتطلب تفاعل المستخدم لتفعيل الصوت
  document.body.addEventListener('click', () => {
    notificationSound.play().then(() => {
      notificationSound.pause();
      notificationSound.currentTime = 0;
    }).catch(() => {});
  }, { once: true });
</script>
