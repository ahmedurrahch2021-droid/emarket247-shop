-- ==============================================================================
-- eMarket247 — three product additions 2026-09-21
--
-- ONE FILE, RUN ONCE. Paste whole file -> Go. Safe to rerun.
-- Run AFTER the matching build is deployed. Slugs are final. Prices untouched.
--
-- Adds the three pieces that were photographed but never listed: the floral trio
-- necklace, the openwork floral ring and the teardrop hoop earrings. The build
-- already ships their product pages, their card in the shop and category grids
-- and their ItemList entries; this file is what makes the admin panel and the
-- live API aware of them, so prices, stock and material can be set through the
-- dashboard afterwards.
--
-- `sku` and `slug` are both UNIQUE, so INSERT IGNORE turns a second run into a
-- no-op instead of a duplicate-key error.
--
-- Every commerce fact is left unset on purpose: price NULL, is_price_pending 1
-- (the honest "price on request" state the storefront already renders), stock
-- and material NULL. Nothing here invents a specification.
--
-- Run in: Hostinger -> phpMyAdmin -> select the storefront database -> SQL tab.
-- ==============================================================================

SET NAMES utf8mb4;

INSERT IGNORE INTO `emk_products`
  (`sku`, `slug`, `title_en`, `title_bn`, `category`, `price`,
   `is_price_pending`, `material`, `stock_status`, `stock_qty`,
   `lead_en`, `lead_bn`, `image_url`, `is_active`)
VALUES
  ('EMK-NECK-049', 'emarket247-floral-trio-gold-tone-necklace', 'Floral Trio Gold-Tone Necklace', 'তিন-ফুলের সোনালি হার', 'Necklaces', NULL, 1, NULL, NULL, NULL, 'Catalog record in preparation. Specifications, price, and availability are pending approval.', 'ক্যাটালগ রেকর্ড প্রস্তুত হচ্ছে। স্পেসিফিকেশন, মূল্য ও প্রাপ্যতা অনুমোদনের অপেক্ষায়।', '/assets/images/products/emarket247-floral-gold-tone-necklace-02.webp', 1),
  ('EMK-RING-050', 'emarket247-gold-floral-openwork-ring', 'Openwork Floral Gold-Tone Ring', 'খোলা-নকশার ফুলেল সোনালি আংটি', 'Rings', NULL, 1, NULL, NULL, NULL, 'Catalog record in preparation. Specifications, price, and availability are pending approval.', 'ক্যাটালগ রেকর্ড প্রস্তুত হচ্ছে। স্পেসিফিকেশন, মূল্য ও প্রাপ্যতা অনুমোদনের অপেক্ষায়।', '/assets/images/products/emarket247-gold-floral-openwork-ring.webp', 1),
  ('EMK-EARR-051', 'emarket247-gold-tone-teardrop-hoop-earrings', 'Teardrop Stone-Link Gold-Tone Hoop Earrings', 'জলবিন্দু স্টোন-লিংক সোনালি হুপ কানের দুল', 'Earrings', NULL, 1, NULL, NULL, NULL, 'Catalog record in preparation. Specifications, price, and availability are pending approval.', 'ক্যাটালগ রেকর্ড প্রস্তুত হচ্ছে। স্পেসিফিকেশন, মূল্য ও প্রাপ্যতা অনুমোদনের অপেক্ষায়।', '/assets/images/products/emarket247-gold-tone-teardrop-hoop-earrings-15.webp', 1);

-- ------------------------------------------------------------------------------
-- VERIFY — expect 3 rows, each with a NULL price, is_price_pending = 1 and
-- is_active = 1.
-- ------------------------------------------------------------------------------
SELECT `slug`, `sku`, `category`, `title_en`, `price`, `is_price_pending`, `is_active`
  FROM `emk_products`
 WHERE `slug` IN (
   'emarket247-floral-trio-gold-tone-necklace',
   'emarket247-gold-floral-openwork-ring',
   'emarket247-gold-tone-teardrop-hoop-earrings'
 )
 ORDER BY `slug`;

-- ==============================================================================
-- ROLLBACK — only if the owner decides to remove them. Commented out on purpose.
-- Deactivating rather than deleting keeps the rows (and any price already set on
-- them) recoverable; the storefront treats is_active = 0 as not published.
-- ==============================================================================
-- UPDATE `emk_products` SET `is_active` = 0
--  WHERE `slug` IN ('emarket247-floral-trio-gold-tone-necklace',
--                  'emarket247-gold-floral-openwork-ring',
--                  'emarket247-gold-tone-teardrop-hoop-earrings');
