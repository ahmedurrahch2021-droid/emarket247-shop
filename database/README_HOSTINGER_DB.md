# Hostinger Database Setup — eMarket247

How to create the eMarket247 MySQL database, connect the storefront to it, and
create the administrator account safely.

> **This folder is repository-only.** `database/` must never be uploaded to
> Hostinger. A downloadable schema or provisioning script on a live server
> hands an attacker your exact table layout. Upload only `public_html/`.

---

## Step 1 — Import the schema

1. Log in to **Hostinger hPanel** (`https://hpanel.hostinger.com`).
2. Go to **Databases → Management**.
3. Under your database name, click **Enter phpMyAdmin**.
4. Open the **Import** tab.
5. Choose **`database/database.sql`** from the project source on your computer.
6. Click **Go**.

This creates four tables:

| Table | Purpose |
| --- | --- |
| `emk_users` | Customer and administrator accounts |
| `emk_products` | Catalogue, stock, and pricing |
| `emk_orders` | Orders and WhatsApp inquiries |
| `emk_settings` | Store configuration |

Optionally import **`database/seed_products.sql`** to load the published product
identities. It sets no prices: commerce facts stay unset until the owner
approves them.

---

## Step 2 — Provide database credentials

`public_html/api/config.php` reads credentials from the environment first and
falls back to placeholders. Set the real values in Hostinger rather than
committing them:

hPanel → **Advanced → PHP Configuration → PHP Options**, or a `.env` handled by
your host, providing:

```
DB_HOST=localhost
DB_NAME=u123456789_your_database
DB_USER=u123456789_your_user
DB_PASS=your-real-password
```

If your plan cannot set environment variables, edit the fallback values in
`public_html/api/config.php` **directly on the server via File Manager** and
never commit that edit back to the repository.

Verify the connection from the admin dashboard's **Test Database Connection**
panel.

---

## Step 3 — Create the administrator account

The schema deliberately ships **without** an administrator. There is no default
password to leak, guess, or forget to change.

On your own computer, run:

```bash
php database/create-admin.php owner@emarket247.shop
```

The script asks for a full name, an optional phone number, and a password
(entered hidden, minimum 12 characters). It prints a single `INSERT` statement
containing a bcrypt hash — never the password itself.

Paste that statement into phpMyAdmin's **SQL** tab and click **Go**.

Sign in at `https://emarket247.shop/en/admin/`.

### If you previously imported an older schema

Earlier versions of this file published a default account
(`admin@emarket247.shop` / a well-known password). If that account was ever
created on a live database, treat it as compromised:

```sql
DELETE FROM `emk_users` WHERE `email` = 'admin@emarket247.shop' AND `role` = 'admin';
```

Then create a fresh administrator with the script above.

---

## Step 4 — Before you deploy

- [ ] `database/` is **not** in the upload.
- [ ] No `.sql`, `.env`, `.log`, or backup file is inside `public_html/`.
- [ ] `npm test` passes (it fails the build if any of these appear).
- [ ] Database credentials are set on the server, not in the repository.
- [ ] The administrator password is unique and stored in a password manager.
