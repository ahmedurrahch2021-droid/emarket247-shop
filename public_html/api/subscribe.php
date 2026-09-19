<?php
/**
 * Newsletter subscription endpoint.
 *
 * A subscription is NOT an account: it stores only an email, a language and a
 * source. Accounts live in emk_users and are created through auth.php. The
 * subscribe response tells the storefront whether this email already belongs
 * to an account, so the UI can point the visitor at their account instead of
 * duplicating the invitation.
 *
 * POST { email, language?, source? }  -> { success, alreadySubscribed?, hasAccount?, message }
 *
 * Consent: the endpoint records the subscription but the storefront keeps the
 * honest copy ("sign-up opens when the consent workflow is connected") unless
 * the owner flips the emk_settings key 'allow_subscriptions' to '1'. Without
 * that flag the endpoint refuses to store anything.
 */
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
if (!$pdo) {
    sendJsonResponse(['success' => false, 'error' => 'Database connection failed.'], 500);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['success' => false, 'error' => 'Method not allowed.'], 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$email = strtolower(trim($input['email'] ?? ''));
$language = ($input['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
$source = substr(trim($input['source'] ?? 'footer'), 0, 100);

// Subscriptions stay off until the owner enables them in store settings.
$stmt = $pdo->prepare("SELECT setting_value FROM emk_settings WHERE setting_key = 'allow_subscriptions' LIMIT 1");
$stmt->execute();
$allowed = $stmt->fetchColumn();
if ($allowed !== '1') {
    sendJsonResponse([
        'success' => false,
        'error' => $language === 'bn'
            ? 'সাবস্ক্রিপশন সংগ্রহ এখনো চালু হয়নি।'
            : 'Subscription collection is not enabled yet.',
        'notEnabled' => true
    ], 503);
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse([
        'success' => false,
        'error' => $language === 'bn' ? 'সঠিক ইমেইল ঠিকানা দিন।' : 'Please enter a valid email address.'
    ], 400);
}

$emailHash = hash('sha256', $email);

// Does this email already have an account?
$accountStmt = $pdo->prepare("SELECT id FROM emk_users WHERE email = ? LIMIT 1");
$accountStmt->execute([$email]);
$hasAccount = (bool)$accountStmt->fetch();

// Current subscription state, if any.
$subStmt = $pdo->prepare("SELECT id, status FROM emk_subscribers WHERE email_hash = ? LIMIT 1");
$subStmt->execute([$emailHash]);
$existing = $subStmt->fetch();

if ($existing && $existing['status'] === 'active') {
    sendJsonResponse([
        'success' => true,
        'alreadySubscribed' => true,
        'hasAccount' => $hasAccount,
        'message' => $language === 'bn'
            ? 'এই ইমেইলটি ইতিমধ্যে তালিকাভুক্ত।'
            : 'This email is already on the list.'
    ]);
}

if ($existing) {
    // Previously unsubscribed — re-activate rather than duplicate.
    $upd = $pdo->prepare("UPDATE emk_subscribers SET status = 'active', language = ?, source = ? WHERE id = ?");
    $upd->execute([$language, $source, $existing['id']]);
} else {
    $ins = $pdo->prepare("INSERT INTO emk_subscribers (email, email_hash, status, language, source) VALUES (?, ?, 'active', ?, ?)");
    $ins->execute([$email, $emailHash, $language, $source]);
}

sendJsonResponse([
    'success' => true,
    'alreadySubscribed' => false,
    'hasAccount' => $hasAccount,
    'message' => $hasAccount
        ? ($language === 'bn' ? 'ধন্যবাদ! এই ইমেইলে একটি অ্যাকাউন্টও রয়েছে।' : 'Thank you! An account also exists for this email.')
        : ($language === 'bn' ? 'ধন্যবাদ! আপনি তালিকাভুক্ত হয়েছেন।' : 'Thank you! You are on the list.')
]);
