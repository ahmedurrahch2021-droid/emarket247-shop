-- ==============================================================================
-- eMarket247 — category correction 2026-09-20
--
-- ONE FILE, RUN ONCE. Paste whole file → Go. Safe to rerun.
-- Run AFTER the matching build is deployed. Slugs unchanged. Prices/stock untouched.
--
-- Corrects the 8 photo-audited product identities only. It never touches `price`,
-- `is_price_pending`, `stock_status`, `stock_qty`, `material` or `is_active`, and
-- it never changes `slug`, so every published URL stays exactly as it is.
--
-- Why a migration and not a seed re-run: `database/seed_products.sql` is
-- intentionally a plain INSERT (not an upsert) so it can never overwrite product
-- facts that have since been approved in the admin. An already-seeded database
-- therefore still holds the old categories, titles, SKUs and image paths; this
-- file is what brings those rows forward.
--
-- Every statement is guarded so a second run changes nothing:
--   Step 1 — category + titles are set from a literal, so re-running is a no-op
--            once the row already carries the new values.
--   Step 2 — the new SKU is written only while the row still holds the OLD SKU.
--   Step 3 — the new image path is written only while the row still points at
--            the OLD filename.
--
-- Run in: Hostinger → phpMyAdmin → select the storefront database → SQL tab.
-- ==============================================================================

SET NAMES utf8mb4;

-- ------------------------------------------------------------------------------
-- STEP 1 — category and localized titles (8 rows)
-- Category values are the admin/DB labels, matching database/seed_products.sql.
-- ------------------------------------------------------------------------------
UPDATE `emk_products`
   SET `category` = 'Bracelets',
       `title_en` = 'Floral Charm-Chain Gold-Tone Bracelet',
       `title_bn` = 'ফুলেল চার্ম-চেইন সোনালি ব্রেসলেট'
 WHERE `slug` = 'emarket247-necklaces-16';

UPDATE `emk_products`
   SET `category` = 'Bracelets',
       `title_en` = 'Floral Station Gold-Tone Bracelet',
       `title_bn` = 'ফুলেল স্টেশন সোনালি ব্রেসলেট'
 WHERE `slug` = 'emarket247-bangles-18';

UPDATE `emk_products`
   SET `category` = 'Bangles',
       `title_en` = 'Baguette Screw-Motif Gold-Tone Bangle Pair',
       `title_bn` = 'ব্যাগেট স্ক্রু-মোটিফ সোনালি চুড়ি জোড়া'
 WHERE `slug` = 'emarket247-bangles-21';

UPDATE `emk_products`
   SET `category` = 'Bangles',
       `title_en` = 'Slim Baguette Gold-Tone Bangle Pair',
       `title_bn` = 'স্লিম ব্যাগেট সোনালি চুড়ি জোড়া'
 WHERE `slug` = 'emarket247-bangles-25';

UPDATE `emk_products`
   SET `category` = 'Jewellery Sets',
       `title_en` = 'Stone-Detail Gold-Tone Earrings & Pendant Set',
       `title_bn` = 'স্টোন-ডিটেইল সোনালি কানের দুল ও লকেট সেট'
 WHERE `slug` = 'emarket247-jewellery-detail-06';

UPDATE `emk_products`
   SET `category` = 'Jewellery Sets',
       `title_en` = 'Pearl-Style Gold-Tone Earrings & Pendant Set',
       `title_bn` = 'পার্ল-স্টাইল সোনালি কানের দুল ও লকেট সেট'
 WHERE `slug` = 'emarket247-bangles-23';

UPDATE `emk_products`
   SET `category` = 'Jewellery Sets',
       `title_en` = 'Teardrop Gold-Tone Earrings & Pendant Set',
       `title_bn` = 'জলবিন্দু সোনালি কানের দুল ও লকেট সেট'
 WHERE `slug` = 'emarket247-jewellery-detail-31';

UPDATE `emk_products`
   SET `category` = 'Jewellery Sets',
       `title_en` = 'Square Gold-Tone Earrings & Pendant Set',
       `title_bn` = 'চৌকো সোনালি কানের দুল ও লকেট সেট'
 WHERE `slug` = 'emarket247-earrings-32';

-- ------------------------------------------------------------------------------
-- STEP 2 — SKUs (8 rows)
-- The `sku` guard is what makes this idempotent: once the row carries the new
-- SKU the WHERE clause matches nothing. `sku` is UNIQUE, so the old value is
-- asserted rather than blindly overwritten.
-- ------------------------------------------------------------------------------
UPDATE `emk_products` SET `sku` = 'EMK-BRAC-016'
 WHERE `slug` = 'emarket247-necklaces-16' AND `sku` = 'EMK-NECK-016';

UPDATE `emk_products` SET `sku` = 'EMK-BRAC-018'
 WHERE `slug` = 'emarket247-bangles-18' AND `sku` = 'EMK-NECK-018';

UPDATE `emk_products` SET `sku` = 'EMK-BANG-021'
 WHERE `slug` = 'emarket247-bangles-21' AND `sku` = 'EMK-RING-021';

UPDATE `emk_products` SET `sku` = 'EMK-BANG-025'
 WHERE `slug` = 'emarket247-bangles-25' AND `sku` = 'EMK-RING-025';

UPDATE `emk_products` SET `sku` = 'EMK-SET-006'
 WHERE `slug` = 'emarket247-jewellery-detail-06' AND `sku` = 'EMK-EARR-006';

UPDATE `emk_products` SET `sku` = 'EMK-SET-023'
 WHERE `slug` = 'emarket247-bangles-23' AND `sku` = 'EMK-EARR-023';

UPDATE `emk_products` SET `sku` = 'EMK-SET-031'
 WHERE `slug` = 'emarket247-jewellery-detail-31' AND `sku` = 'EMK-PEND-031';

UPDATE `emk_products` SET `sku` = 'EMK-SET-032'
 WHERE `slug` = 'emarket247-earrings-32' AND `sku` = 'EMK-EARR-032';

-- ------------------------------------------------------------------------------
-- STEP 3 — image paths whose product category changed (3 rows)
-- LIKE matches the old filename only, so a row already pointing at the new
-- filename is left alone. The build ships the renamed files.
-- ------------------------------------------------------------------------------
UPDATE `emk_products`
   SET `image_url` = '/assets/images/products/emarket247-floral-gold-tone-bracelet-18.webp'
 WHERE `slug` = 'emarket247-bangles-18'
   AND `image_url` LIKE '%emarket247-floral-gold-tone-necklace-18.webp%';

UPDATE `emk_products`
   SET `image_url` = '/assets/images/products/emarket247-gold-tone-cross-band-bangle-10.webp'
 WHERE `slug` = 'emarket247-bangles-21'
   AND `image_url` LIKE '%emarket247-gold-tone-cross-band-ring-10.webp%';

UPDATE `emk_products`
   SET `image_url` = '/assets/images/products/emarket247-gold-tone-crossed-band-bangle-11.webp'
 WHERE `slug` = 'emarket247-bangles-25'
   AND `image_url` LIKE '%emarket247-gold-tone-crossed-band-ring-11.webp%';

-- ------------------------------------------------------------------------------
-- VERIFY — expect 8 rows, every one carrying the new sku / category / title_en,
-- and the three renamed products showing the new image path.
-- ------------------------------------------------------------------------------
SELECT `slug`, `sku`, `category`, `title_en`, `image_url`
  FROM `emk_products`
 WHERE `slug` IN (
   'emarket247-necklaces-16',
   'emarket247-bangles-18',
   'emarket247-bangles-21',
   'emarket247-bangles-25',
   'emarket247-jewellery-detail-06',
   'emarket247-bangles-23',
   'emarket247-jewellery-detail-31',
   'emarket247-earrings-32'
 )
 ORDER BY `slug`;

-- ==============================================================================
-- ROLLBACK — only if the owner decides to revert. Commented out on purpose;
-- uncomment and run this block to restore the pre-correction values.
-- ==============================================================================
-- UPDATE `emk_products` SET `sku`='EMK-NECK-016', `category`='Necklaces',  `title_en`='Floral Charm-Chain Gold-Tone Necklace', `title_bn`='ফুলেল চার্ম-চেইন সোনালি হার' WHERE `slug`='emarket247-necklaces-16';
-- UPDATE `emk_products` SET `sku`='EMK-NECK-018', `category`='Necklaces',  `title_en`='Floral Station Gold-Tone Necklace',     `title_bn`='ফুলেল স্টেশন সোনালি হার'     WHERE `slug`='emarket247-bangles-18';
-- UPDATE `emk_products` SET `sku`='EMK-RING-021', `category`='Rings',     `title_en`='Crossed-Band Gold-Tone Ring',          `title_bn`='ক্রস-ব্যান্ড সোনালি আংটি'    WHERE `slug`='emarket247-bangles-21';
-- UPDATE `emk_products` SET `sku`='EMK-RING-025', `category`='Rings',     `title_en`='Chevron Crossed-Band Gold-Tone Ring',  `title_bn`='শেভরন ক্রস-ব্যান্ড সোনালি আংটি' WHERE `slug`='emarket247-bangles-25';
-- UPDATE `emk_products` SET `sku`='EMK-EARR-006', `category`='Earrings',  `title_en`='Stone-Detail Gold-Tone Earrings',      `title_bn`='স্টোন-ডিটেইল সোনালি কানের দুল' WHERE `slug`='emarket247-jewellery-detail-06';
-- UPDATE `emk_products` SET `sku`='EMK-EARR-023', `category`='Earrings',  `title_en`='Pearl-Style Gold-Tone Earrings',       `title_bn`='পার্ল-স্টাইল সোনালি কানের দুল' WHERE `slug`='emarket247-bangles-23';
-- UPDATE `emk_products` SET `sku`='EMK-PEND-031', `category`='Pendants', `title_en`='Teardrop Gold-Tone Pendant',           `title_bn`='জলবিন্দু সোনালি লকেট'        WHERE `slug`='emarket247-jewellery-detail-31';
-- UPDATE `emk_products` SET `sku`='EMK-EARR-032', `category`='Earrings',  `title_en`='Square Gold-Tone Earrings',            `title_bn`='চৌকো সোনালি কানের দুল'       WHERE `slug`='emarket247-earrings-32';
-- UPDATE `emk_products` SET `image_url`='/assets/images/products/emarket247-floral-gold-tone-necklace-18.webp'   WHERE `slug`='emarket247-bangles-18';
-- UPDATE `emk_products` SET `image_url`='/assets/images/products/emarket247-gold-tone-cross-band-ring-10.webp'  WHERE `slug`='emarket247-bangles-21';
-- UPDATE `emk_products` SET `image_url`='/assets/images/products/emarket247-gold-tone-crossed-band-ring-11.webp' WHERE `slug`='emarket247-bangles-25';
