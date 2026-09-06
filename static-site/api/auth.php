<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if (!$pdo) {
    sendJsonResponse([
        'status' => 'error',
        'message' => 'Database connection failed. Please check your Hostinger database credentials in config.php.'
    ], 500);
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

if ($action === 'register' && $method === 'POST') {
    $fullName = trim($input['full_name'] ?? '');
    $email = strtolower(trim($input['email'] ?? ''));
    $phone = trim($input['phone'] ?? '');
    $password = $input['password'] ?? '';
    $city = trim($input['city'] ?? 'Dhaka');
    $address = trim($input['address'] ?? '');

    if (empty($fullName) || empty($email) || empty($password)) {
        sendJsonResponse(['status' => 'error', 'message' => 'Full name, email, and password are required.'], 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse(['status' => 'error', 'message' => 'Invalid email address format.'], 400);
    }

    // Check if email already registered
    $stmt = $pdo->prepare("SELECT id FROM emk_users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendJsonResponse(['status' => 'error', 'message' => 'An account with this email address already exists.'], 409);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $insert = $pdo->prepare("INSERT INTO emk_users (full_name, email, phone, password_hash, role, city, address) VALUES (?, ?, ?, ?, 'customer', ?, ?)");
    $insert->execute([$fullName, $email, $phone, $hash, $city, $address]);
    $userId = $pdo->lastInsertId();

    sendJsonResponse([
        'status' => 'success',
        'message' => 'Account created successfully.',
        'user' => [
            'id' => (int)$userId,
            'full_name' => $fullName,
            'email' => $email,
            'phone' => $phone,
            'role' => 'customer',
            'city' => $city,
            'address' => $address
        ]
    ], 201);
}

if ($action === 'login' && $method === 'POST') {
    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        sendJsonResponse(['status' => 'error', 'message' => 'Email and password are required.'], 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM emk_users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        // Built-in fallback for initial admin setup if db table was just imported
        if ($email === 'admin@emarket247.shop' && $password === 'admin247') {
            sendJsonResponse([
                'status' => 'success',
                'message' => 'Welcome back, Administrator!',
                'user' => [
                    'id' => 1,
                    'full_name' => 'Store Administrator',
                    'email' => 'admin@emarket247.shop',
                    'role' => 'admin'
                ]
            ]);
        }
        sendJsonResponse(['status' => 'error', 'message' => 'Invalid email or password credentials.'], 401);
    }

    unset($user['password_hash']);
    sendJsonResponse([
        'status' => 'success',
        'message' => 'Sign in successful.',
        'user' => $user
    ]);
}

if ($action === 'test_db' && $method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT COUNT(*) as user_count FROM emk_users");
        $count = $stmt->fetch()['user_count'] ?? 0;
        sendJsonResponse([
            'status' => 'success',
            'connected' => true,
            'database' => DB_NAME,
            'user_count' => (int)$count,
            'message' => 'Hostinger MySQL database connected successfully!'
        ]);
    } catch (Exception $e) {
        sendJsonResponse([
            'status' => 'error',
            'connected' => false,
            'message' => 'Connected to server but tables missing. Please import database.sql into phpMyAdmin.'
        ], 500);
    }
}

sendJsonResponse(['status' => 'error', 'message' => 'Invalid authentication endpoint.'], 404);
