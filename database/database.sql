-- ==============================================================================
-- eMarket247 Fashion & Jewellery — Hostinger Database Schema
-- Compatible with MySQL 5.7+ / 8.0+ and MariaDB 10.3+ (Hostinger phpMyAdmin)
-- Character Set: utf8mb4 (supports English & Bengali unicode seamlessly)
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users Table (Customers and Store Administrators)
CREATE TABLE IF NOT EXISTS `emk_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(40) DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'admin', 'manager') NOT NULL DEFAULT 'customer',
  `address` TEXT DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `district` VARCHAR(100) DEFAULT 'Dhaka',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table (Bilingual Catalogue Records & Inventory)
-- Product facts without owner-approved values default to NULL. The application
-- must present them as unknown or "on request", never infer a category,
-- material, stock quantity, availability, or metal option.
CREATE TABLE IF NOT EXISTS `emk_products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sku` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `title_en` VARCHAR(255) NOT NULL,
  `title_bn` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(100) NOT NULL,
  `price` DECIMAL(12,2) DEFAULT NULL,
  `is_price_pending` TINYINT(1) NOT NULL DEFAULT 1,
  `material` VARCHAR(200) DEFAULT NULL,
  `stock_status` ENUM('in_stock', 'low_stock', 'made_to_order', 'out_of_stock') DEFAULT NULL,
  `stock_qty` INT DEFAULT NULL,
  `lead_en` TEXT DEFAULT NULL,
  `lead_bn` TEXT DEFAULT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `metal_options` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_products_category` (`category`),
  INDEX `idx_products_sku` (`sku`),
  INDEX `idx_products_status` (`stock_status`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Orders & Inquiries Table (WhatsApp & Online Checkout Inquiries)
CREATE TABLE IF NOT EXISTS `emk_orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_ref` VARCHAR(100) NOT NULL UNIQUE,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `customer_email` VARCHAR(191) DEFAULT NULL,
  `customer_address` TEXT DEFAULT NULL,
  `items_json` LONGTEXT NOT NULL,
  `total_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'BDT',
  `status` ENUM('pending', 'contacted', 'confirmed', 'dispatched', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_orders_ref` (`order_ref`),
  INDEX `idx_orders_status` (`status`),
  INDEX `idx_orders_customer_phone` (`customer_phone`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `emk_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Store Settings Table
CREATE TABLE IF NOT EXISTS `emk_settings` (
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` LONGTEXT DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Administrator account
--
-- This file intentionally creates NO administrator. A shared default password
-- committed to a repository is a published password: anyone who reads the file
-- can sign in to the live store the moment it is deployed.
--
-- Create the administrator once, after import, with a password only the owner
-- knows:
--
--   php database/create-admin.php admin@emarket247.shop
--
-- The script prompts for the password, generates a bcrypt hash locally, and
-- prints the single INSERT statement to run in phpMyAdmin. The plaintext
-- password is never written to a file, a log, or this repository.
--
-- See database/README_HOSTINGER_DB.md for the full setup sequence.

-- Initial Store Settings
INSERT INTO `emk_settings` (`setting_key`, `setting_value`) VALUES
('store_name', 'eMarket247 Fashion & Jewellery'),
('care_phone', '+8801740501062'),
('care_whatsapp', '+8801740501062'),
('currency', 'BDT'),
('currency_symbol', '৳'),
('allow_guest_inquiry', '1')
ON DUPLICATE KEY UPDATE `setting_value`=VALUES(`setting_value`);

SET FOREIGN_KEY_CHECKS = 1;
