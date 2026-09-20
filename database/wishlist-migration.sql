-- ============================================================================
-- eMarket247 — Wishlist persistence for signed-in customers
--
-- Guests keep their wishlist in the browser and never touch the database or
-- the API. This table exists only so a customer who signs in can open the same
-- saved list on another device.
--
-- Run once on Hostinger (hPanel → Databases → phpMyAdmin → SQL), on the same
-- database the storefront already uses. Safe to re-run: it creates the table
-- only when it is missing and never deletes or rewrites existing rows.
-- ============================================================================

CREATE TABLE IF NOT EXISTS `emk_wishlist_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_wishlist_user_slug` (`user_id`, `slug`),
  KEY `idx_wishlist_user` (`user_id`),
  CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`)
    REFERENCES `emk_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- A row may only ever point at a product the catalogue actually publishes.
-- product.php and the storefront resolve slugs against emk_products, so a
-- stale slug would be a broken link rather than a wishlist entry.
-- (Slug validation against emk_products.is_active is enforced in
-- public_html/api/wishlist.php on every write.)
