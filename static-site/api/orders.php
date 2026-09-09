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

// Resolve the request body and requested action. The storefront checkout sends
// {action:"create", ...} and the admin dashboard sends {action:"update_status"}
// in the JSON POST body; the admin order list uses GET. We derive a single
// "operation" from the action when present, otherwise from the HTTP method, so
// body-action callers are no longer misrouted (which silently dropped writes).
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$action = $_GET['action'] ?? (is_array($input) ? ($input['action'] ?? '') : '');

$op = $action;
if ($op === '') {
    if ($method === 'GET') {
        $op = 'list';
    } elseif ($method === 'POST') {
        $op = 'create';
    } elseif ($method === 'PATCH' || $method === 'PUT') {
        $op = 'update_status';
    }
}

// list: All customer orders & inquiries (admin dashboard)
if ($op === 'list') {
    checkAdmin();
    $status = $_GET['status'] ?? '';
    $sql = "SELECT * FROM emk_orders";
    $params = [];

    if (!empty($status) && $status !== 'all') {
        $sql .= " WHERE status = ?";
        $params[] = $status;
    }

    $sql .= " ORDER BY id DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    sendJsonResponse([
        'success' => true,
        'count' => count($orders),
        'orders' => $orders
    ]);
}

// create: Place a new bag checkout inquiry or order (public)
if ($op === 'create') {
    $customerName = trim($input['customer_name'] ?? '');
    $customerPhone = trim($input['customer_phone'] ?? '');
    $customerEmail = trim($input['customer_email'] ?? '');
    $customerAddress = trim($input['customer_address'] ?? '');
    $items = $input['items'] ?? [];
    $notes = trim($input['notes'] ?? '');
    $userId = !empty($input['user_id']) ? (int)$input['user_id'] : null;

    if (empty($customerName) || empty($customerPhone)) {
        sendJsonResponse(['success' => false, 'error' => 'Customer name and phone number are required.'], 400);
    }

    // Authoritative server-side total calculation.
    $totalAmount = 0;
    foreach ($items as $item) {
        $sku = $item['sku'] ?? null;
        $qty = (int)($item['qty'] ?? 1);
        if ($qty <= 0) {
            $qty = 1; // Default to 1 if a non-positive value is provided.
        }
        if ($sku) {
            $stmt = $pdo->prepare("SELECT price, is_price_pending FROM emk_products WHERE sku = ?");
            $stmt->execute([$sku]);
            $product = $stmt->fetch();
            if ($product && !$product['is_price_pending']) {
                $totalAmount += ((float)$product['price'] * $qty);
            }
        }
    }

    $orderRef = 'EMK-' . date('Ymd') . '-' . rand(1000, 9999);
    $itemsJson = json_encode($items, JSON_UNESCAPED_UNICODE);

    try {
        $stmt = $pdo->prepare("INSERT INTO emk_orders
            (order_ref, user_id, customer_name, customer_phone, customer_email, customer_address, items_json, total_amount, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)");

        $stmt->execute([
            $orderRef, $userId, $customerName, $customerPhone, $customerEmail,
            $customerAddress, $itemsJson, $totalAmount, $notes
        ]);

        $orderId = $pdo->lastInsertId();

        sendJsonResponse([
            'success' => true,
            'message' => 'Order inquiry received. Our team will contact you shortly.',
            'order_ref' => $orderRef,
            'order_id' => (int)$orderId,
            'calculated_total' => $totalAmount
        ], 201);
    } catch (PDOException $e) {
        sendJsonResponse(['success' => false, 'error' => 'Failed to record order.'], 500);
    }
}

// update_status: Change an order's status (admin only)
if ($op === 'update_status') {
    checkAdmin();
    $orderId = (int)($input['id'] ?? 0);
    $status = trim($input['status'] ?? '');

    $allowed = ['pending', 'contacted', 'confirmed', 'dispatched', 'delivered', 'cancelled'];
    if ($orderId <= 0 || !in_array($status, $allowed)) {
        sendJsonResponse(['success' => false, 'error' => 'Invalid order ID or status value.'], 400);
    }

    $stmt = $pdo->prepare("UPDATE emk_orders SET status = ? WHERE id = ?");
    $stmt->execute([$status, $orderId]);

    if ($stmt->rowCount() === 0) {
        $check = $pdo->prepare("SELECT id FROM emk_orders WHERE id = ?");
        $check->execute([$orderId]);
        if (!$check->fetch()) {
            sendJsonResponse(['success' => false, 'error' => "No order found with ID #{$orderId}."], 404);
        }
    }

    sendJsonResponse(['success' => true, 'message' => "Order #{$orderId} status updated to {$status}."]);
}

sendJsonResponse(['success' => false, 'error' => 'Invalid order endpoint or action.'], 404);
