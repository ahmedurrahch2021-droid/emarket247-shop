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

// Resolve the request body and the requested action. The admin panel sends
// {action:"create|update|delete", ...} in the JSON POST body, while the public
// storefront still uses plain HTTP verbs (GET to list). We therefore derive a
// single "operation" from the action if present, otherwise from the HTTP method
// — so both callers work and admin writes are no longer silently misrouted.
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$action = $_GET['action'] ?? (is_array($input) ? ($input['action'] ?? '') : '');

$op = $action;
if ($op === '') {
    if ($method === 'GET') {
        $op = 'list';
    } elseif ($method === 'POST') {
        $op = 'create';
    } elseif ($method === 'PUT' || $method === 'PATCH') {
        $op = 'update';
    } elseif ($method === 'DELETE') {
        $op = 'delete';
    }
}

// GET / list: Fetch products with optional filtering (public storefront + admin)
if ($op === 'list') {
    $category = $_GET['category'] ?? '';
    $search = $_GET['search'] ?? '';
    $includeInactive = ($_GET['all'] ?? '') === '1';

    // Listing inactive/soft-deleted rows is an admin-only view.
    if ($includeInactive) {
        checkAdmin();
    }

    $sql = "SELECT * FROM emk_products";
    $where = [];
    $params = [];

    if (!$includeInactive) {
        $where[] = "is_active = 1";
    }

    if (!empty($category) && $category !== 'all') {
        $where[] = "category = ?";
        $params[] = $category;
    }

    if (!empty($search)) {
        $where[] = "(title_en LIKE ? OR sku LIKE ? OR material LIKE ?)";
        $wildcard = "%{$search}%";
        $params[] = $wildcard;
        $params[] = $wildcard;
        $params[] = $wildcard;
    }

    if ($where) {
        $sql .= " WHERE " . implode(' AND ', $where);
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

// create: Upload / Create a new product (admin only)
if ($op === 'create') {
    checkAdmin();

    $titleEn = trim($input['title_en'] ?? $input['title'] ?? '');
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
        // Duplicate SKU/slug (UNIQUE constraint) or other insert failure.
        if ($e->getCode() === '23000') {
            sendJsonResponse(['success' => false, 'error' => 'A product with this SKU already exists.'], 409);
        }
        sendJsonResponse(['success' => false, 'error' => 'Failed to insert product.'], 500);
    }
}

// update: Update an existing product (admin only)
if ($op === 'update') {
    checkAdmin();

    // Identify via SKU or numeric ID.
    $id = isset($input['id']) && is_numeric($input['id']) ? (int)$input['id'] : 0;
    $sku = trim($input['sku'] ?? '');
    // The admin panel keys products by SKU and may pass it as `id`.
    if ($id <= 0 && $sku === '' && isset($input['id']) && !is_numeric($input['id'])) {
        $sku = trim((string)$input['id']);
    }

    if ($id <= 0 && empty($sku)) {
        sendJsonResponse(['success' => false, 'error' => 'Valid product ID or SKU is required.'], 400);
    }

    // If a price is provided, publishing it clears the "price pending" flag
    // unless the caller explicitly set the flag.
    if (isset($input['price']) && !isset($input['is_price_pending'])) {
        $input['is_price_pending'] = ((float)$input['price'] > 0) ? 0 : 1;
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

    if ($stmt->rowCount() === 0) {
        // Either the row does not exist or the values were identical. Verify existence.
        $check = $pdo->prepare($id > 0 ? "SELECT id FROM emk_products WHERE id = ?" : "SELECT id FROM emk_products WHERE sku = ?");
        $check->execute([$id > 0 ? $id : $sku]);
        if (!$check->fetch()) {
            sendJsonResponse(['success' => false, 'error' => 'No product found for the given ID or SKU.'], 404);
        }
    }

    sendJsonResponse(['success' => true, 'message' => 'Product updated successfully.']);
}

// delete: Soft-delete a product (admin only). Accepts id/sku from body or query.
if ($op === 'delete') {
    checkAdmin();

    $id = 0;
    $sku = '';
    $rawId = $input['id'] ?? $_GET['id'] ?? null;
    if ($rawId !== null && is_numeric($rawId)) {
        $id = (int)$rawId;
    } elseif ($rawId !== null) {
        $sku = trim((string)$rawId);
    }
    if ($sku === '') {
        $sku = trim($input['sku'] ?? $_GET['sku'] ?? '');
    }

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

    if ($stmt->rowCount() === 0) {
        sendJsonResponse(['success' => false, 'error' => 'No product found to delete.'], 404);
    }

    sendJsonResponse(['success' => true, 'message' => 'Product has been deleted.']);
}

sendJsonResponse(['success' => false, 'error' => 'Invalid product endpoint or action.'], 404);
