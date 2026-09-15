# eMarket247 — Current Development Handoff

Read `AGENTS.md` first. `README.md` and `HOSTINGER_STATIC_DEPLOYMENT.md` describe the approved repository and deployment contract.

## Current working contract

- Branch: `master`.
- Authoritative website and final Hostinger tree: `public_html/`.
- One clear task per commit.
- English and Bengali counterparts change together.
- Published URLs remain stable unless an approved migration includes tested 301 redirects.
- Run `npm test` before declaring a task complete.
- Do not deploy, force-push, or rewrite shared history.
- Do not fabricate commerce facts.

## Stabilization work completed

0. Security baseline hardened (see `ENGINEERING_PLAYBOOK.md`):
   - `api/upload.php` now types uploads by inspecting file contents and stores a
     whitelisted extension, closing an arbitrary-file-upload path to code
     execution;
   - `assets/images/.htaccess` refuses to execute or serve scripts in uploaded
     media;
   - database schema, seed data, and setup docs moved to repository-only
     `database/`, out of the deployed web root;
   - the published default administrator password was removed from the schema;
     administrators are now created with `database/create-admin.php`;
   - `public_html/.htaccess` forces HTTPS and sets HSTS, CSP, and
     Permissions-Policy;
   - `npm test` fails if any of the above regresses.
1. `AGENTS.md` establishes the shared development process.
2. The default build creates `dist/public/` only from `public_html/` and does not synchronize legacy trees.
3. `npm test` runs the `public_html` quality gate.
4. `README.md` now reflects the approved branch, source, checks, and deployment process.
5. `HOSTINGER_STATIC_DEPLOYMENT.md` now reflects the real multi-page Hostinger workflow.

## Current architecture status

The target architecture is a static HTML/CSS/vanilla-JavaScript storefront. The repository is not yet fully static because:

- `public_html/.htaccess` routes product URLs to `product.php`;
- `product.php` loads products from MySQL before falling back to static HTML;
- `public_html/api/` provides authentication, products, orders, and uploads;
- catalogue JSON and static product pages also exist.

This creates multiple product sources of truth. Do not remove PHP/API files until their live dependencies are inventoried and a safe static migration is proven.

## Immediate owner action required

The removed default administrator password (`admin@emarket247.shop`) remains in
git history and must be treated as public. If that account was ever created on a
live database, delete it and create a new administrator with
`database/create-admin.php`. Rotate database and hosting passwords at the same
time.

## Next task — static architecture normalization audit

### Objective

Identify every storefront dependency on PHP/MySQL and define the smallest safe migration to a genuinely static storefront without changing published product URLs.

### Inspect

- `public_html/.htaccess` product rewrites;
- `public_html/product.php`;
- `public_html/api/*.php` callers;
- `public_html/assets/js/site.js` API requests and fallbacks;
- `public_html/assets/data/catalog.en.json` and `catalog.bn.json`;
- EN/BN static product folders;
- product generators and structured-data scripts;
- sitemap product URLs;
- cart and WhatsApp product-link construction.

### Required output before destructive changes

- authoritative static product-data source;
- list of active dynamic dependencies;
- exact files to change;
- static fallback behavior;
- URL and redirect impact;
- EN/BN parity impact;
- SEO and structured-data impact;
- validation and rollback plan.

### Guardrail

The audit may update documentation or safe validation code. It must not disable product routing, delete API files, remove database access, or change production behavior until the static replacement has been verified.

## Ordered completion sequence

The executable, task-by-task version of this sequence is `NEXT_TASKS.md`.
Development tools should work from that file.

1. Finish the static architecture normalization audit.
2. Remove fabricated price fallbacks from active code and generators.
3. Establish one authoritative bilingual catalogue and generation path.
4. Verify every EN/BN product ID, slug, category, image, and page pair.
5. Correct taxonomy without renaming published product folders.
6. Standardize shared header, footer, navigation, and page chrome.
7. Verify shop, search, product, bag, cart, and WhatsApp flows.
8. Complete technical SEO and truthful AEO/structured data.
9. Complete accessibility and Bengali internationalization checks.
10. Optimize and measure Core Web Vitals by page template.
11. Verify business claims, policies, privacy, and consent behavior.
12. Complete release validation, credential rotation where applicable, backup, and manual deployment.

## Required completion report for every task

```text
Task:
Commit:
Changed files:
Automated checks:
Manual checks:
Known risks:
Rollback command:
Deployment performed: No
```

This file is a current handoff, not a substitute for inspecting the latest `master` state.
