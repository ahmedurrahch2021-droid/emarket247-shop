<?php
require_once __DIR__ . '/config.php';
checkAdmin(); // Ensure only admins can upload

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['success' => false, 'error' => 'Invalid request method.'], 405);
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    sendJsonResponse(['success' => false, 'error' => 'File upload failed. Error code: ' . $_FILES['image']['error']], 400);
}

$file = $_FILES['image'];

// 1. Validate File Type
$allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
if (!in_array($file['type'], $allowedMimes)) {
    sendJsonResponse(['success' => false, 'error' => 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.'], 400);
}

// 2. Validate File Size (Max 5MB)
if ($file['size'] > 5 * 1024 * 1024) {
    sendJsonResponse(['success' => false, 'error' => 'File is too large. Maximum size is 5MB.'], 400);
}

// 3. Define Upload Directory
$uploadDir = __DIR__ . '/../assets/images/products/';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
         sendJsonResponse(['success' => false, 'error' => 'Failed to create upload directory.'], 500);
    }
}

// 4. Create a unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'emk-' . substr(md5(uniqid()), 0, 8) . '-' . time() . '.' . strtolower($extension);
$destination = $uploadDir . $filename;

// 5. Move the file
if (move_uploaded_file($file['tmp_name'], $destination)) {
    // Return the path relative to the root (public_html)
    $relativePath = '/assets/images/products/' . $filename;
    sendJsonResponse([
        'success' => true,
        'path' => $relativePath,
        'message' => 'Image uploaded successfully.'
    ]);
} else {
    sendJsonResponse(['success' => false, 'error' => 'Failed to move uploaded file.'], 500);
}
?>
