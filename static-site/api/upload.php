<?php
/**
 * eMarket247 — Admin product image upload.
 *
 * Security contract for this endpoint:
 * 1. Only an authenticated admin session may upload (checkAdmin).
 * 2. The file type is decided by INSPECTING THE BYTES on the server, never by
 *    the client-supplied $_FILES['image']['type'] header, which is attacker
 *    controlled.
 * 3. The stored extension comes from a fixed whitelist keyed by the detected
 *    type. The original filename is never trusted, so "invoice.php" cannot
 *    become a stored ".php" file.
 * 4. The storage directory additionally refuses to execute scripts
 *    (see public_html/assets/images/.htaccess) as defence in depth.
 */

require_once __DIR__ . '/config.php';
checkAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['success' => false, 'error' => 'Invalid request method.'], 405);
}

$maxBytes = 5 * 1024 * 1024;

/** Detected image type => the only extension we will ever write for it. */
$allowedTypes = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];

$file = $_FILES['image'] ?? null;

if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    sendJsonResponse(['success' => false, 'error' => 'File upload failed. Please try again.'], 400);
}

// Guarantees the path really is a PHP-managed upload, not an arbitrary
// server path smuggled into the request.
if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
    sendJsonResponse(['success' => false, 'error' => 'Invalid upload.'], 400);
}

$size = (int)($file['size'] ?? 0);
if ($size <= 0) {
    sendJsonResponse(['success' => false, 'error' => 'The uploaded file is empty.'], 400);
}
if ($size > $maxBytes) {
    sendJsonResponse(['success' => false, 'error' => 'File is too large. Maximum size is 5MB.'], 400);
}

// --- Type detection gate 1: magic bytes via fileinfo -------------------------
$detectedType = '';
if (function_exists('finfo_open')) {
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    if ($finfo !== false) {
        $detectedType = (string)finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
    }
}

// --- Type detection gate 2: it must decode as a real raster image ------------
$imageInfo = @getimagesize($file['tmp_name']);
if ($imageInfo === false || empty($imageInfo[0]) || empty($imageInfo[1])) {
    sendJsonResponse(['success' => false, 'error' => 'The file is not a valid image.'], 400);
}
$imageType = image_type_to_mime_type($imageInfo[2]);

// When fileinfo is unavailable, getimagesize is the single source of truth.
if ($detectedType === '') {
    $detectedType = $imageType;
}

// Both detectors must agree, which blocks polyglot files that carry a valid
// image header in front of executable script content.
if ($detectedType !== $imageType) {
    sendJsonResponse(['success' => false, 'error' => 'The file is not a valid image.'], 400);
}

if (!isset($allowedTypes[$detectedType])) {
    sendJsonResponse(['success' => false, 'error' => 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.'], 400);
}

$extension = $allowedTypes[$detectedType];

$uploadDir = __DIR__ . '/../assets/images/products/';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
    sendJsonResponse(['success' => false, 'error' => 'Failed to create upload directory.'], 500);
}

// Unpredictable name: no caller-controlled characters, no path traversal.
try {
    $token = bin2hex(random_bytes(8));
} catch (Exception $e) {
    sendJsonResponse(['success' => false, 'error' => 'Upload could not be processed.'], 500);
}

$filename = 'emk-' . $token . '-' . time() . '.' . $extension;
$destination = $uploadDir . $filename;

if (file_exists($destination)) {
    sendJsonResponse(['success' => false, 'error' => 'Upload could not be processed.'], 500);
}

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    sendJsonResponse(['success' => false, 'error' => 'Failed to store the uploaded file.'], 500);
}

@chmod($destination, 0644);

sendJsonResponse([
    'success' => true,
    'path'    => '/assets/images/products/' . $filename,
    'message' => 'Image uploaded successfully.',
]);
