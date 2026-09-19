-- ==============================================================================
-- Migration: newsletter subscription table
-- Run once in Hostinger phpMyAdmin (or mysql CLI) after the base database.sql.
-- Idempotent: safe to re-run.
--
-- Subscriptions are NOT accounts. An account (emk_users) holds credentials and
-- personal data; a subscription is just an email on the announcement list. The
-- two are linked only opportunistically: if a subscriber later creates an
-- account with the same email, emk_subscribers.status surfaces that so the
-- storefront can greet them differently. No data is copied either way.
-- ==============================================================================

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `emk_subscribers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(191) NOT NULL,
  `email_hash` CHAR(64) NOT NULL,            -- SHA-256 of lowercase email, for duplicate checks without exposing plaintext in logs
  `status` ENUM('active', 'unsubscribed') NOT NULL DEFAULT 'active',
  `language` ENUM('en', 'bn') NOT NULL DEFAULT 'en',
  `source` VARCHAR(100) NOT NULL DEFAULT 'footer',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_subscribers_email_hash` (`email_hash`),
  INDEX `idx_subscribers_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
