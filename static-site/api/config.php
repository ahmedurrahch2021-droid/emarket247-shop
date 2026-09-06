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

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'u123456789_emarket247');
define('DB_USER', getenv('DB_USER') ?: 'u123456789_emarket_user');
define('DB_PASS', getenv('DB_PASS') ?: 'YourStrongPasswordHere');
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
