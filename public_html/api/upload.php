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
 * 5. After those checks, the image is re-encoded to WebP (long edge 1600 px,
 *    EXIF stripped, at most 200 KB). The original bytes are never stored.
 */

require_once __DIR__ . '/config.php';
checkAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['success' => false, 'error' => 'Invalid request method.'], 405);
}

$maxBytes = 5 * 1024 * 1024;
$maxLongEdge = 1600;
$maxOutputBytes = 200 * 1024;

/** Detected image type => accepted input. Stored files are always .webp. */
$allowedTypes = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];

function emkNoImageEncoder() {
    sendJsonResponse([
        'success' => false,
        'error' => 'The server cannot process images. Enable PHP GD with WebP support or Imagick, then try again.'
    ], 500);
}

function emkExifOrientation($path) {
    if (!function_exists('exif_read_data')) {
        return 1;
    }
    $exif = @exif_read_data($path);
    if (!is_array($exif) || empty($exif['Orientation'])) {
        return 1;
    }
    return (int)$exif['Orientation'];
}

function emkGdApplyOrientation($im, $orientation) {
    if ($im === false) {
        return false;
    }
    switch ($orientation) {
        case 2:
            imageflip($im, IMG_FLIP_HORIZONTAL);
            return $im;
        case 3:
            $rotated = imagerotate($im, 180, 0);
            imagedestroy($im);
            return $rotated;
        case 4:
            imageflip($im, IMG_FLIP_VERTICAL);
            return $im;
        case 5:
            imageflip($im, IMG_FLIP_VERTICAL);
            $rotated = imagerotate($im, -90, 0);
            imagedestroy($im);
            return $rotated;
        case 6:
            $rotated = imagerotate($im, -90, 0);
            imagedestroy($im);
            return $rotated;
        case 7:
            imageflip($im, IMG_FLIP_HORIZONTAL);
            $rotated = imagerotate($im, -90, 0);
            imagedestroy($im);
            return $rotated;
        case 8:
            $rotated = imagerotate($im, 90, 0);
            imagedestroy($im);
            return $rotated;
        default:
            return $im;
    }
}

function emkGdLoadImage($path, $imageType) {
    switch ($imageType) {
        case IMAGETYPE_JPEG:
            return function_exists('imagecreatefromjpeg') ? @imagecreatefromjpeg($path) : false;
        case IMAGETYPE_PNG:
            return function_exists('imagecreatefrompng') ? @imagecreatefrompng($path) : false;
        case IMAGETYPE_WEBP:
            return function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : false;
        case IMAGETYPE_GIF:
            return function_exists('imagecreatefromgif') ? @imagecreatefromgif($path) : false;
        default:
            return false;
    }
}

function emkGdEncodeWebp($im, $quality) {
    if (!function_exists('imagewebp')) {
        return false;
    }
    ob_start();
    $ok = imagewebp($im, null, $quality);
    $blob = ob_get_clean();
    if ($ok !== true || !is_string($blob) || $blob === '') {
        return false;
    }
    return $blob;
}

function emkResizeTruecolor($src, $dstW, $dstH) {
    $dst = imagecreatetruecolor($dstW, $dstH);
    if ($dst === false) {
        return false;
    }
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefill($dst, 0, 0, $transparent);
    imagealphablending($src, true);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $dstW, $dstH, imagesx($src), imagesy($src));
    return $dst;
}

function emkReencodeWithImagick($sourcePath, $maxLongEdge, $maxOutputBytes) {
    if (!class_exists('Imagick')) {
        return null;
    }
    try {
        $formats = Imagick::queryFormats('WEBP');
        if (!is_array($formats) || $formats === []) {
            return null;
        }
        $im = new Imagick();
        $im->readImage($sourcePath);
        if (method_exists($im, 'autoOrient')) {
            $im->autoOrient();
        }
        $im->stripImage();
        $im->setImageFormat('WEBP');
        $quality = 82;
        $edge = $maxLongEdge;
        for ($attempt = 0; $attempt < 12; $attempt++) {
            $frame = clone $im;
            $width = $frame->getImageWidth();
            $height = $frame->getImageHeight();
            $long = max($width, $height);
            if ($long > $edge) {
                $scale = $edge / $long;
                $frame->resizeImage(
                    max(1, (int)round($width * $scale)),
                    max(1, (int)round($height * $scale)),
                    Imagick::FILTER_LANCZOS,
                    1
                );
            }
            $frame->setImageCompressionQuality($quality);
            $blob = $frame->getImageBlob();
            $frame->clear();
            $frame->destroy();
            if (is_string($blob) && $blob !== '' && strlen($blob) <= $maxOutputBytes) {
                $im->clear();
                $im->destroy();
                return $blob;
            }
            if ($quality > 45) {
                $quality -= 8;
            } else {
                $edge = (int)floor($edge * 0.85);
                $quality = 70;
                if ($edge < 800) {
                    break;
                }
            }
        }
        $im->clear();
        $im->destroy();
    } catch (Exception $e) {
        return null;
    }
    return null;
}

function emkReencodeWithGd($sourcePath, $imageInfo, $maxLongEdge, $maxOutputBytes) {
    if (!function_exists('imagewebp') || !function_exists('imagecreatetruecolor')) {
        return null;
    }
    $src = emkGdLoadImage($sourcePath, $imageInfo[2]);
    if ($src === false) {
        return null;
    }
    if (function_exists('imagepalettetotruecolor') && !imageistruecolor($src)) {
        imagepalettetotruecolor($src);
    }
    $src = emkGdApplyOrientation($src, emkExifOrientation($sourcePath));
    if ($src === false) {
        return null;
    }
    $srcW = imagesx($src);
    $srcH = imagesy($src);
    $quality = 82;
    $edge = $maxLongEdge;
    $blob = null;
    for ($attempt = 0; $attempt < 12; $attempt++) {
        $long = max($srcW, $srcH);
        $scale = $long > $edge ? ($edge / $long) : 1;
        $dstW = max(1, (int)round($srcW * $scale));
        $dstH = max(1, (int)round($srcH * $scale));
        $frame = ($scale < 1) ? emkResizeTruecolor($src, $dstW, $dstH) : $src;
        if ($frame === false) {
            imagedestroy($src);
            return null;
        }
        $encoded = emkGdEncodeWebp($frame, $quality);
        if ($frame !== $src) {
            imagedestroy($frame);
        }
        if (is_string($encoded) && $encoded !== '' && strlen($encoded) <= $maxOutputBytes) {
            $blob = $encoded;
            break;
        }
        if ($quality > 45) {
            $quality -= 8;
        } else {
            $edge = (int)floor($edge * 0.85);
            $quality = 70;
            if ($edge < 800) {
                break;
            }
        }
    }
    imagedestroy($src);
    return $blob;
}

function emkImagickSupportsWebp() {
    if (!class_exists('Imagick')) {
        return false;
    }
    try {
        $formats = Imagick::queryFormats('WEBP');
        return is_array($formats) && $formats !== [];
    } catch (Exception $e) {
        return false;
    }
}

function emkGdSupportsWebp() {
    return function_exists('imagewebp') && function_exists('imagecreatetruecolor');
}

function emkReencodeProductImage($sourcePath, $imageInfo, $maxLongEdge, $maxOutputBytes) {
    if (!emkImagickSupportsWebp() && !emkGdSupportsWebp()) {
        emkNoImageEncoder();
    }
    $blob = emkReencodeWithImagick($sourcePath, $maxLongEdge, $maxOutputBytes);
    if (!is_string($blob) || $blob === '') {
        $blob = emkReencodeWithGd($sourcePath, $imageInfo, $maxLongEdge, $maxOutputBytes);
    }
    if (!is_string($blob) || $blob === '') {
        sendJsonResponse([
            'success' => false,
            'error' => 'The image could not be compressed under 200 KB. Try a smaller photo.'
        ], 400);
    }
    if (strlen($blob) > $maxOutputBytes) {
        sendJsonResponse([
            'success' => false,
            'error' => 'The image could not be compressed under 200 KB. Try a smaller photo.'
        ], 400);
    }
    return $blob;
}

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

$webpBytes = emkReencodeProductImage($file['tmp_name'], $imageInfo, $maxLongEdge, $maxOutputBytes);

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

$filename = 'emk-' . $token . '-' . time() . '.webp';
$destination = $uploadDir . $filename;

if (file_exists($destination)) {
    sendJsonResponse(['success' => false, 'error' => 'Upload could not be processed.'], 500);
}

$written = file_put_contents($destination, $webpBytes, LOCK_EX);
if ($written === false || $written !== strlen($webpBytes) || !is_file($destination) || filesize($destination) > $maxOutputBytes) {
    if (is_file($destination)) {
        @unlink($destination);
    }
    sendJsonResponse(['success' => false, 'error' => 'Failed to store the uploaded file.'], 500);
}

@chmod($destination, 0644);

sendJsonResponse([
    'success' => true,
    'path'    => '/assets/images/products/' . $filename,
    'message' => 'Image uploaded successfully.',
]);
