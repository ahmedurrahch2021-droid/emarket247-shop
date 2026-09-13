# Hostinger Database Connection Guide — eMarket247

This guide outlines how to connect your Hostinger MySQL database to your eMarket247 storefront and admin dashboard.

---

### Step 1: Import the Database Schema into Hostinger phpMyAdmin

1. Log in to your **Hostinger hPanel** (`https://hpanel.hostinger.com`).
2. Go to **Databases** → **Management**.
3. Under your database name, click **Enter phpMyAdmin**.
4. Inside phpMyAdmin, click the **Import** tab at the top.
5. Choose the file **`static-site/api/database.sql`** (or copy-paste its SQL into the **SQL** tab).
6. Click **Go**.
   - This will create the required tables:
     - `emk_users` (Customers and Admin accounts)
     - `emk_products` (Catalogue, stock, and pricing)
     - `emk_orders` (Orders and customer WhatsApp inquiries)
     - `emk_settings` (Store configuration)

---

### Step 2: Configure Your Database Credentials in `config.php`

Open `static-site/api/config.php` in your Hostinger File Manager (located under `public_html/api/config.php`) and update these lines with your actual Hostinger details:

```php
define('DB_HOST', 'localhost'); // In Hostinger, usually 'localhost'
define('DB_NAME', 'u123456789_emarket247'); // Your Hostinger Database Name
define('DB_USER', 'u123456789_emarket_user'); // Your Hostinger Database User
define('DB_PASS', 'YourStrongPasswordHere'); // Your Hostinger Database Password
```

---

### Step 3: Default Store Administrator Access

- **Admin Login URL**: `https://emarket247.shop/en/admin/` (or `/admin/`)
- **Default Email**: `admin@emarket247.shop`
- **Default Password**: `admin247`

*You can change your password anytime directly from the Admin Dashboard or phpMyAdmin.*

---

### Step 4: Full Local & Offline Continuity

The dashboard and customer portals also feature **real-time client persistence** (via localStorage / IndexedDB). Even before you upload the PHP files or when testing locally in the preview, you can:
- Sign in / Register customer accounts
- Add, edit, and delete products
- Receive customer bag inquiries
- Manage order workflows
- Export and import catalogue JSON backups
