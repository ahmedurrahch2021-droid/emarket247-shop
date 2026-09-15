<?php
/**
 * eMarket247 — one-time administrator provisioning helper.
 *
 * Usage:  php database/create-admin.php admin@emarket247.shop
 *
 * Why this exists: the schema deliberately ships without an administrator row.
 * A default password committed to the repository is a public password. This
 * script asks for the password interactively, hashes it locally with bcrypt,
 * and prints one INSERT statement to paste into phpMyAdmin.
 *
 * The plaintext password is never stored, echoed, or logged.
 *
 * This file lives outside public_html and must never be uploaded to the server.
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This script may only be run from the command line.\n");
    exit(1);
}

$email = strtolower(trim($argv[1] ?? ''));
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "Usage: php database/create-admin.php <admin-email>\n");
    exit(1);
}

$fullName = trim((string)readline("Administrator full name [Store Administrator]: "));
if ($fullName === '') {
    $fullName = 'Store Administrator';
}
$phone = trim((string)readline("Contact phone (optional): "));

/** Read a password without printing it to the terminal. */
function promptHidden(string $label): string
{
    fwrite(STDOUT, $label);
    $usedStty = false;
    $sttyState = '';
    if (function_exists('shell_exec') && stripos(PHP_OS_FAMILY, 'Windows') === false) {
        $sttyState = (string)shell_exec('stty -g 2>/dev/null');
        if ($sttyState !== '') {
            shell_exec('stty -echo 2>/dev/null');
            $usedStty = true;
        }
    }
    $value = (string)fgets(STDIN);
    if ($usedStty) {
        shell_exec('stty ' . $sttyState . ' 2>/dev/null');
    }
    fwrite(STDOUT, "\n");
    return trim($value, "\r\n");
}

$password = promptHidden('Choose a password (minimum 12 characters): ');
$confirm  = promptHidden('Repeat the password: ');

if ($password !== $confirm) {
    fwrite(STDERR, "The two passwords do not match. Nothing was generated.\n");
    exit(1);
}
if (strlen($password) < 12) {
    fwrite(STDERR, "Password is too short. Use at least 12 characters.\n");
    exit(1);
}

$hash = password_hash($password, PASSWORD_BCRYPT);
unset($password, $confirm);

if (!is_string($hash) || $hash === '') {
    fwrite(STDERR, "Failed to generate a password hash.\n");
    exit(1);
}

$quote = static fn (string $value): string => "'" . str_replace("'", "''", $value) . "'";

echo "\nRun this once in phpMyAdmin (SQL tab), then delete it from your clipboard:\n\n";
echo "INSERT INTO `emk_users` (`full_name`, `email`, `phone`, `password_hash`, `role`)\n";
echo "VALUES (" . $quote($fullName) . ", " . $quote($email) . ", " . $quote($phone) . ", " . $quote($hash) . ", 'admin');\n\n";
echo "Sign in at /en/admin/ with that email and the password you just chose.\n";
