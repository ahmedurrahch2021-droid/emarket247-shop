# eMarket247 Development Rules

## Repository and deployment

- `master` is the main development and approved repository branch.
- The project owner has authorized work directly on `master`.
- Keep each commit limited to one clear task so mistakes can be reviewed and reverted safely.
- `public_html/` is the final Hostinger deployment folder.
- Supporting files, generators, scripts and documentation may exist outside `public_html/`, but only the intended contents of `public_html/` are deployed.
- Never deploy automatically. Production deployment requires the project owner's approval.

## Required process for every development tool

1. Read this file before changing anything.
2. Inspect the latest `master` state and the related source, generator and output files.
3. State the exact task and files to be changed; do not expand the scope.
4. Make the smallest coherent change for that task.
5. Preserve existing architecture unless a change is explicitly approved.
6. Run relevant checks and report exact results, including failures.
7. Commit with a clear task-specific message.
8. Return the commit hash, changed-file list, test results, known risks and rollback commit.
9. Do not deploy, rewrite shared history or force-push.

Mistakes are expected during development. They must be visible, corrected with a follow-up commit or reverted, never hidden by rewriting history.

## Non-negotiable product rules

- Preserve published product URLs unless an explicit migration includes tested 301 redirects.
- Keep English and Bengali routes, content and product identity aligned.
- Never fabricate prices, stock, materials, reviews, ratings, delivery promises or other commerce facts.
- Do not expose credentials, tokens, personal data, database exports or server logs.
- Do not edit a generated file without checking and updating its authoritative source or generator.
- Do not mix unrelated design, functionality, SEO, product-data, security or refactoring work in one commit.
- Do not change checkout, authentication, payment, database or order logic without focused tests.
- Do not add dependencies or tooling unless the task requires them and the reason is documented.

## Design and commerce

- Preserve the established visual system unless a redesign is explicitly approved.
- Brand direction: Vermilion Atelier; DM Serif Display, DM Sans and Noto Bengali; vermilion `#ED1C24`; warm ivory/parchment surfaces.
- WhatsApp ordering remains the active conversion path until another payment or checkout method is explicitly approved.
- No specific price may be published unless confirmed by the business.
- Existing PHP, database and API files must be treated as active unless repository evidence proves otherwise. Do not remove or bypass them based on older documentation.
- Do not change `public_html/api/config.php` credentials during ordinary development; credentials will be rotated in the final pre-launch security phase.

## Verification before completion

At minimum, check the changed pages or functions and all affected EN/BN counterparts. When relevant, also verify:

- internal links, assets and genuine 404 behavior;
- canonical, hreflang, OpenGraph and structured-data consistency;
- product ID, slug, folder and catalogue parity;
- responsive layout and keyboard accessibility;
- JavaScript and PHP syntax;
- cart/order calculations and failure states;
- absence of secrets and unintended files;
- that only the intended `public_html/` content is ready for deployment.

A task is complete only when required checks pass or every remaining failure is clearly reported and accepted by the project owner.
