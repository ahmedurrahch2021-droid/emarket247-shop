<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if (!$pdo) {
    sendJsonResponse([
        'status' => 'error',
        'message' => 'Database connection failed. Check config.php.'
    ], 500);
}

// GET: Fetch products with optional filtering
if ($method === 'GET') {
    $category = $_GET['category'] ?? '';
    $search = $_GET['search'] ?? '';

    $sql = "SELECT * FROM emk_products WHERE is_active = 1";
    $params = [];

    if (!empty($category) && $category !== 'all') {
        $sql .= " AND category = ?";
        $params[] = $category;
    }

    if (!empty($search)) {
        $sql .= " AND (title_en LIKE ? OR sku LIKE ? OR material LIKE ?)";
        $wildcard = "%{$search}%";
        $params[] = $wildcard;
        $params[] = $wildcard;
        $params[] = $wildcard;
    }

    $sql .= " ORDER BY id DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    sendJsonResponse([
        'success' => true,
        'count' => count($products),
        'products' => $products
    ]);
}

// POST: Upload / Create or Update a product
if ($method === 'POST') {
    checkAdmin();
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $action = $input['action'] ?? 'create';

    $titleEn = trim($input['title'] ?? $input['title_en'] ?? '');
    $titleBn = trim($input['title_bn'] ?? '');
    $sku = trim($input['sku'] ?? $input['id'] ?? '');
    $category = trim($input['category'] ?? 'Rings');
    $price = (float)($input['price'] ?? 0);
    $isPricePending = isset($input['is_price_pending']) ? (int)$input['is_price_pending'] : ($price > 0 ? 0 : 1);
    $material = trim($input['material'] ?? '22K Gold Luster & Sterling Silver');
    $stockStatus = trim($input['stock_status'] ?? 'in_stock');
    $stockQty = (int)($input['stock_qty'] ?? 10);
    $leadEn = trim($input['lead_en'] ?? '');
    $leadBn = trim($input['lead_bn'] ?? '');
    $imageUrl = trim($input['image_url'] ?? '');
    $metalOptions = trim($input['metal_options'] ?? '22K Gold, Rose Gold, Sterling Silver, Antique Two-Tone');

    if (empty($titleEn)) {
        sendJsonResponse(['success' => false, 'error' => 'Product title in English is required.'], 400);
    }

    if ($action === 'update') {
        // Update existing product
        $id = isset($input['id']) && is_numeric($input['id']) ? (int)$input['id'] : 0;

        $fields = [];
        $params = [];
        $updatable = ['title_en', 'title_bn', 'category', 'price', 'is_price_pending', 'material', 'stock_status', 'stock_qty', 'lead_en', 'lead_bn', 'image_url', 'metal_options'];

        // Map input keys to DB columns
        $inputMap = [
            'title' => 'title_en',
            'id' => 'sku'
        ];

        foreach ($updatable as $col) {
            $inputKey = $inputMap[$col] ?? $col;
            if (isset($input[$inputKey])) {
                $fields[] = "`$col` = ?";
                $params[] = $input[$inputKey];
            }
        }

        // Ensure is_active is 1 if price is set
        if ($price > 0) {
            $fields[] = "`is_active` = 1";
        }

        if (empty($fields)) {
            sendJsonResponse(['success' => false, 'error' => 'No fields provided to update.'], 400);
        }

        if ($id > 0) {
            $params[] = $id;
            $sql = "UPDATE emk_products SET " . implode(', ', $fields) . " WHERE id = ?";
        } else {
            $params[] = $sku;
            $sql = "UPDATE emk_products SET " . implode(', ', $fields) . " WHERE sku = ?";
        }

        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            sendJsonResponse(['success' => true, 'message' => 'Product updated successfully.']);
        } catch (PDOException $e) {
            sendJsonResponse(['success' => false, 'error' => 'Update failed: ' . $e->getMessage()], 500);
        }
    } else {
        // Create new product
        if (empty($sku)) {
            $sku = 'EMK-' . strtoupper(substr($category, 0, 3)) . '-' . rand(1000, 9999);
        }

        if (empty($imageUrl)) {
            $imageUrl = '/assets/images/brand/emarket247-logo-transparent.png';
        }

        $slug = strtolower(preg_replace('/[^A-Za-z0-9-]+/', '-', $titleEn));
        $slug = trim($slug, '-') . '-' . substr(md5($sku), 0, 6);

        try {
            $stmt = $pdo->prepare("INSERT INTO emk_products
                (sku, slug, title_en, title_bn, category, price, is_price_pending, material, stock_status, stock_qty, lead_en, lead_bn, image_url, metal_options, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)");

            $stmt->execute([
                $sku, $slug, $titleEn, $titleBn, $category, $price, $isPricePending,
                $material, $stockStatus, $stockQty, $leadEn, $leadBn, $imageUrl, $metalOptions
            ]);

            $newId = $pdo->lastInsertId();

            sendJsonResponse([
                'success' => true,
                'message' => 'Product published successfully to Hostinger database.',
                'product' => [
                    'id' => (int)$newId,
                    'sku' => $sku,
                    'slug' => $slug,
                    'title_en' => $titleEn,
                    'title_bn' => $titleBn,
                    'category' => $category,
                    'price' => $price,
                    'is_price_pending' => $isPricePending,
                    'stock_status' => $stockStatus,
                    'image_url' => $imageUrl
                ]
            ], 201);
        } catch (PDOException $e) {
            sendJsonResponse(['success' => false, 'error' => 'Failed to insert product.'], 500);
        }
    }
}

// PUT / PATCH: Update existing product
if ($method === 'PUT') {
    checkAdmin();
    $input = json_decode(file_get_contents('php://input'), true);

    // Identify via SKU or ID
    $id = isset($input['id']) && is_numeric($input['id']) ? (int)$input['id'] : 0;
    $sku = trim($input['sku'] ?? '');

    if ($id <= 0 && empty($sku)) {
        sendJsonResponse(['success' => false, 'error' => 'Valid product ID or SKU is required.'], 400);
    }

    $fields = [];
    $params = [];

    $updatable = ['title_en', 'title_bn', 'category', 'price', 'is_price_pending', 'material', 'stock_status', 'stock_qty', 'lead_en', 'lead_bn', 'image_url', 'metal_options'];
    foreach ($updatable as $col) {
        if (isset($input[$col])) {
            $fields[] = "`$col` = ?";
            $params[] = $input[$col];
        }
    }

    if (empty($fields)) {
        sendJsonResponse(['success' => false, 'error' => 'No fields provided to update.'], 400);
    }

    if ($id > 0) {
        $params[] = $id;
        $sql = "UPDATE emk_products SET " . implode(', ', $fields) . " WHERE id = ?";
    } else {
        $params[] = $sku;
        $sql = "UPDATE emk_products SET " . implode(', ', $fields) . " WHERE sku = ?";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    sendJsonResponse(['success' => true, 'message' => 'Product updated successfully.']);
}

// DELETE: Soft delete or remove product
if ($method === 'DELETE') {
    checkAdmin();
    // Identify via SKU or ID
    $id = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : 0;
    $sku = trim($_GET['sku'] ?? '');

    if ($id <= 0 && empty($sku)) {
        sendJsonResponse(['success' => false, 'error' => 'Product ID or SKU is required.'], 400);
    }

    if ($id > 0) {
        $stmt = $pdo->prepare("UPDATE emk_products SET is_active = 0 WHERE id = ?");
        $stmt->execute([$id]);
    } else {
        $stmt = $pdo->prepare("UPDATE emk_products SET is_active = 0 WHERE sku = ?");
        $stmt->execute([$sku]);
    }

    sendJsonResponse(['success' => true, 'message' => "Product has been deleted."]);
}
