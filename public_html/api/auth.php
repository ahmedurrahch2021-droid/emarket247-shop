<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Resolve the requested action from the query string (?action=) OR the request
// body. The site/admin frontend sends {action:"login", ...} in the JSON POST
// body, so reading $_GET alone made every POST action (login, register, logout,
// test_db) fall through to the 404 "Invalid authentication endpoint" below.
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$action = $_GET['action'] ?? (is_array($input) ? ($input['action'] ?? '') : '');

if (!$pdo) {
    sendJsonResponse([
        'status' => 'error',
        'message' => 'Database connection failed. Please check your Hostinger database credentials in config.php.'
    ], 500);
}

if ($action === 'register' && $method === 'POST') {
    $fullName = trim($input['full_name'] ?? '');
    $email = strtolower(trim($input['email'] ?? ''));
    $phone = trim($input['phone'] ?? '');
    $password = $input['password'] ?? '';
    $city = trim($input['city'] ?? 'Dhaka');
    $address = trim($input['address'] ?? '');

    if (empty($fullName) || empty($email) || empty($password)) {
        sendJsonResponse(['success' => false, 'error' => 'Full name, email, and password are required.'], 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse(['success' => false, 'error' => 'Invalid email address format.'], 400);
    }

    // Check if email already registered
    $stmt = $pdo->prepare("SELECT id FROM emk_users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendJsonResponse(['success' => false, 'error' => 'An account with this email address already exists.'], 409);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $insert = $pdo->prepare("INSERT INTO emk_users (full_name, email, phone, password_hash, role, city, address) VALUES (?, ?, ?, ?, 'customer', ?, ?)");
    $insert->execute([$fullName, $email, $phone, $hash, $city, $address]);
    $userId = $pdo->lastInsertId();

    session_regenerate_id(true);
    $user = [
        'id' => (int)$userId,
        'full_name' => $fullName,
        'email' => $email,
        'phone' => $phone,
        'role' => 'customer',
        'city' => $city,
        'address' => $address
    ];
    $_SESSION['user'] = $user;

    sendJsonResponse([
        'success' => true,
        'message' => 'Account created successfully.',
        'csrf_token' => rotateCsrfToken(),
        'user' => $user
    ], 201);
}

// ---------------------------------------------------------------------------
// Login throttling. Counters live outside the web root in the system temp
// directory (no schema change, works on shared Hostinger). Keyed by the
// TARGET ACCOUNT, not the session, so discarding cookies does not reset the
// budget for brute-forcing one mailbox. 5 failures opens a 15-minute lock;
// a successful sign-in clears the counter. Responses stay generic.
// ---------------------------------------------------------------------------

function loginThrottleFile($email) {
    return sys_get_temp_dir() . '/emk-login-' . hash('sha256', strtolower($email));
}

function loginThrottleState($email) {
    $file = loginThrottleFile($email);
    if (!is_file($file)) return ['fails' => 0, 'until' => 0];
    $state = json_decode((string)@file_get_contents($file), true);
    return is_array($state) ? $state + ['fails' => 0, 'until' => 0] : ['fails' => 0, 'until' => 0];
}

function loginThrottleFail($email) {
    $state = loginThrottleState($email);
    $state['fails'] = (int)$state['fails'] + 1;
    if ($state['fails'] >= 5) {
        $state['until'] = time() + 15 * 60;
    }
    @file_put_contents(loginThrottleFile($email), json_encode($state), LOCK_EX);
}

function loginThrottleClear($email) {
    @unlink(loginThrottleFile($email));
}

if ($action === 'login' && $method === 'POST') {
    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        sendJsonResponse(['success' => false, 'error' => 'Email and password are required.'], 400);
    }

    $throttle = loginThrottleState($email);
    if ($throttle['until'] > time()) {
        sendJsonResponse(['success' => false, 'error' => 'Too many failed attempts. Please try again later.'], 429);
    }

    $stmt = $pdo->prepare("SELECT * FROM emk_users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        loginThrottleFail($email);
        sendJsonResponse(['success' => false, 'error' => 'Invalid email or password credentials.'], 401);
    }

    loginThrottleClear($email);

    session_regenerate_id(true);

    unset($user['password_hash']);
    $_SESSION['user'] = $user;
    sendJsonResponse([
        'success' => true,
        'message' => 'Sign in successful.',
        'user' => $user,
        // Privilege level changed: rotate the CSRF token and hand the new one
        // to the client for subsequent write requests.
        'csrf_token' => rotateCsrfToken()
    ]);
}

if ($action === 'logout' && $method === 'POST') {
    $_SESSION = [];
    session_destroy();
    sendJsonResponse(['success' => true, 'message' => 'Signed out.']);
}

if ($action === 'get_session' && $method === 'GET') {
    if (isset($_SESSION['user'])) {
        sendJsonResponse([
            'success' => true,
            'user' => $_SESSION['user'],
            'csrf_token' => issueCsrfToken()
        ]);
    } else {
        sendJsonResponse(['success' => false, 'error' => 'Not authenticated.', 'csrf_token' => issueCsrfToken()], 200);
    }
}

if ($action === 'test_db' && ($method === 'GET' || $method === 'POST')) {
    checkAdmin();
    try {
        $pdo->query("SELECT 1");
        sendJsonResponse([
            'success' => true,
            'message' => 'Database connection successful.'
        ]);
    } catch (Exception $e) {
        sendJsonResponse([
            'success' => false,
            'error' => 'Database connection failed.'
        ], 500);
    }
}

sendJsonResponse(['success' => false, 'error' => 'Invalid authentication endpoint.'], 404);
