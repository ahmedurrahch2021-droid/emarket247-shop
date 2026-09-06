<?php
/**
 * eMarket247 Fashion & Jewellery — Hostinger Database Configuration & Connection
 * 
 * Instructions for Hostinger:
 * 1. Log in to Hostinger hPanel -> Databases -> Management.
 * 2. Enter your Database Name, Username, and Password below.
 * 3. Or define them in your environment variables.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://emarket247.shop');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_httponly' => true,
        'cookie_secure' => true, // Ensure production Hostinger uses HTTPS
        'cookie_samesite' => 'Strict',
    ]);
}

// Authorization Helper Functions
function checkAuth() {
    if (!isset($_SESSION['user'])) {
        sendJsonResponse(['status' => 'error', 'message' => 'Unauthorized Access.'], 401);
    }
}

function checkAdmin() {
    checkAuth();
    if ($_SESSION['user']['role'] !== 'admin') {
        sendJsonResponse(['status' => 'error', 'message' => 'Admin Access Required.'], 403);
    }
}

// Database Configuration
// Must be set via environment variables in production
$dbHost = getenv('DB_HOST');
$dbPort = getenv('DB_PORT') ?: '3306';
$dbName = getenv('DB_NAME');
$dbUser = getenv('DB_USER');
$dbPass = getenv('DB_PASS');

if (!$dbHost || !$dbName || !$dbUser || !$dbPass) {
    if (PHP_SAPI !== 'cli') {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database environment configuration missing.']);
        exit;
    } else {
        die("Error: Database environment configuration missing.\n");
    }
}

define('DB_HOST', $dbHost);
define('DB_PORT', $dbPort);
define('DB_NAME', $dbName);
define('DB_USER', $dbUser);
define('DB_PASS', $dbPass);
define('DB_PREFIX', 'emk_');

function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    try {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        return null;
    }
}

function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}
