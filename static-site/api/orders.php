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

// GET: List all customer orders & inquiries (for Admin Dashboard)
if ($method === 'GET') {
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
        'status' => 'success',
        'count' => count($orders),
        'orders' => $orders
    ]);
}

// POST: Place a new bag checkout inquiry or order
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    $customerName = trim($input['customer_name'] ?? '');
    $customerPhone = trim($input['customer_phone'] ?? '');
    $customerEmail = trim($input['customer_email'] ?? '');
    $customerAddress = trim($input['customer_address'] ?? '');
    $items = $input['items'] ?? [];
    $totalAmount = (float)($input['total_amount'] ?? 0);
    $notes = trim($input['notes'] ?? '');
    $userId = !empty($input['user_id']) ? (int)$input['user_id'] : null;

    if (empty($customerName) || empty($customerPhone)) {
        sendJsonResponse(['status' => 'error', 'message' => 'Customer name and phone number are required.'], 400);
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
            'status' => 'success',
            'message' => 'Order inquiry received. Our team will contact you shortly.',
            'order_ref' => $orderRef,
            'order_id' => (int)$orderId
        ], 201);
    } catch (PDOException $e) {
        sendJsonResponse(['status' => 'error', 'message' => 'Failed to record order: ' . $e->getMessage()], 500);
    }
}

// PATCH: Update order status (Admin)
if ($method === 'PATCH' || $method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $orderId = (int)($input['id'] ?? 0);
    $status = trim($input['status'] ?? '');

    $allowed = ['pending', 'contacted', 'confirmed', 'dispatched', 'delivered', 'cancelled'];
    if ($orderId <= 0 || !in_array($status, $allowed)) {
        sendJsonResponse(['status' => 'error', 'message' => 'Invalid order ID or status value.'], 400);
    }

    $stmt = $pdo->prepare("UPDATE emk_orders SET status = ? WHERE id = ?");
    $stmt->execute([$status, $orderId]);

    sendJsonResponse(['status' => 'success', 'message' => "Order #{$orderId} status updated to {$status}."]);
}
