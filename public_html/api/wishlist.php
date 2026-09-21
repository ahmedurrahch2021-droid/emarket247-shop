<?php
/**
 * eMarket247 — wishlist persistence for signed-in customers.
 *
 * Guests never reach this endpoint: a guest's wishlist lives entirely in the
 * browser and the storefront makes no request at all for them. A signed-in
 * customer's saved pieces are stored per user here, so the same list opens on
 * another device.
 *
 *   GET  /api/wishlist.php                                  -> { success: true, items: ["slug", ...] }
 *   POST /api/wishlist.php  {action:"replace", slugs:[...]}  -> replaces the stored list
 *   POST /api/wishlist.php  {action:"clear"}                 -> empties the stored list
 *
 * Design notes:
 * - config.php enforces the CSRF token on every non-GET request before this
 *   file reads any input, and the frontend sends X-CSRF-Token on every write.
 * - The session is checked before input is read; every statement uses bound
 *   parameters; slugs are validated against the published product rows so a
 *   wishlist entry can never reference something the catalogue does not have.
 * - Errors stay generic: nothing about the schema or the database is returned.
 */

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
if (!$pdo) {
    sendJsonResponse(['success' => false, 'error' => 'Wishlist is unavailable right now.'], 503);
}

// Authentication first, always: no input is read before this passes.
checkAuth();

$userId = (int) ($_SESSION['user']['id'] ?? 0);
if ($userId <= 0) {
    sendJsonResponse(['success' => false, 'error' => 'Unauthorized Access.'], 401);
}

// Matches the storefront's own cap (WISHLIST_MAX_ITEMS in assets/js/site.js).
$maxItems = 120;
$method = $_SERVER['REQUEST_METHOD'];

$readStoredSlugs = static function (PDO $pdo, int $userId): array {
    // 120 is a fixed server-side constant, not request data.
    $stmt = $pdo->prepare('SELECT slug FROM emk_wishlist_items WHERE user_id = ? ORDER BY id ASC LIMIT 120');
    $stmt->execute([$userId]);
    return array_map(static fn ($row) => (string) $row['slug'], $stmt->fetchAll());
};

$slugPattern = '/^[a-z0-9][a-z0-9-]{1,90}$/';

if ($method === 'GET') {
    sendJsonResponse(['success' => true, 'items' => $readStoredSlugs($pdo, $userId)]);
}

if ($method !== 'POST' && $method !== 'PUT' && $method !== 'PATCH') {
    sendJsonResponse(['success' => false, 'error' => 'Method not allowed.'], 405);
}

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    $payload = $_POST;
}

$action = strtolower(trim((string) ($payload['action'] ?? 'replace')));
if (!in_array($action, ['replace', 'clear'], true)) {
    sendJsonResponse(['success' => false, 'error' => 'Unsupported wishlist action.'], 422);
}

$requested = $payload['slugs'] ?? [];
if (!is_array($requested)) {
    $requested = [];
}

// Normalise, drop anything that is not a catalogue-shaped slug, de-duplicate and
// keep the caller's newest-first order.
$requestedSlugs = [];
foreach ($requested as $candidate) {
    if (!is_string($candidate)) {
        continue;
    }
    $slug = strtolower(trim($candidate));
    if (!preg_match($slugPattern, $slug) || isset($requestedSlugs[$slug])) {
        continue;
    }
    $requestedSlugs[$slug] = true;
    if (count($requestedSlugs) >= $maxItems) {
        break;
    }
}
$requestedSlugs = array_keys($requestedSlugs);

// Only published products may be stored. Anything refused is reported back
// rather than dropped in silence: the catalogue JSON the storefront renders
// from and emk_products can legitimately disagree (a piece published to the
// static catalogue but not yet present as a DB row), and a customer who saved
// such a piece would otherwise watch it sync nowhere, forever, with no signal
// to them or to us. The client keeps the piece on the device and stops
// re-offering it to this endpoint once it has been refused.
$published = [];
$rejected = [];
if ($action === 'replace' && $requestedSlugs) {
    $placeholders = implode(',', array_fill(0, count($requestedSlugs), '?'));
    $stmt = $pdo->prepare("SELECT slug FROM emk_products WHERE is_active = 1 AND slug IN ($placeholders)");
    $stmt->execute($requestedSlugs);
    $publishedSet = array_flip(array_map(static fn ($row) => (string) $row['slug'], $stmt->fetchAll()));
    foreach ($requestedSlugs as $slug) {
        if (isset($publishedSet[$slug])) {
            $published[] = $slug;
        } else {
            $rejected[] = $slug;
        }
    }
}

try {
    $pdo->beginTransaction();
    $delete = $pdo->prepare('DELETE FROM emk_wishlist_items WHERE user_id = ?');
    $delete->execute([$userId]);
    if ($published) {
        $insert = $pdo->prepare('INSERT IGNORE INTO emk_wishlist_items (user_id, slug) VALUES (?, ?)');
        foreach ($published as $slug) {
            $insert->execute([$userId, $slug]);
        }
    }
    $pdo->commit();
} catch (Throwable $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('wishlist write failed: ' . $error->getMessage());
    sendJsonResponse(['success' => false, 'error' => 'Wishlist could not be saved.'], 500);
}

// 'rejected' is the honest half of the answer: the slugs this endpoint would
// not store, named so the caller can stop offering them. It is always present
// on a write, empty when everything was kept.
sendJsonResponse([
    'success' => true,
    'items' => $readStoredSlugs($pdo, $userId),
    'rejected' => $rejected,
]);
