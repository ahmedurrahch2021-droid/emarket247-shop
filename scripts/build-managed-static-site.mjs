/**
 * Create a clean deployment snapshot from public_html.
 *
 * public_html is the approved Hostinger deployment tree. This script never
 * writes back to public_html and never synchronizes legacy source trees.
 */
import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(project, "public_html");
const output = path.join(project, "dist", "public");

if (!existsSync(source)) {
  throw new Error("Cannot build: public_html was not found.");
}

await rm(output, { recursive: true, force: true });
await mkdir(path.dirname(output), { recursive: true });
await cp(source, output, { recursive: true });

// Database setup material belongs in the repository, never in a deployable
// web-root snapshot. Runtime PHP files remain available for the approved
// static-first hybrid architecture.
const repositoryOnlyApiFiles = [
  "database.sql",
  "seed_products.sql",
  "README_HOSTINGER_DB.md",
];
for (const file of repositoryOnlyApiFiles) {
  await rm(path.join(output, "api", file), { force: true });
}

console.log(`Deployment snapshot prepared from public_html at ${output}`);
