/** Build the managed deployment from the self-contained pure static source used for Hostinger upload. */
import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const canonicalSource = path.join(project, "public_html");
const staticSiteSource = path.join(project, "static-site");
const output = path.join(project, "dist", "public");

// Ensure public_html (canonical source) is synced into static-site
if (existsSync(canonicalSource)) {
  await cp(canonicalSource, staticSiteSource, { recursive: true });
}

// Clean and prepare output directory
await rm(output, { recursive: true, force: true });
await mkdir(path.dirname(output), { recursive: true });

// Copy the static assets into dist/public for server distribution
const deploySource = existsSync(canonicalSource) ? canonicalSource : staticSiteSource;
await cp(deploySource, output, { recursive: true });

// Also copy to dist root for platforms that serve directly from dist
const distRoot = path.join(project, "dist");
await cp(deploySource, distRoot, { recursive: true });

// Exclude sensitive database and deployment artifacts from production build
await rm(path.join(output, "api", "database.sql"), { force: true });
await rm(path.join(output, "api", "README_HOSTINGER_DB.md"), { force: true });
await rm(path.join(distRoot, "api", "database.sql"), { force: true });
await rm(path.join(distRoot, "api", "README_HOSTINGER_DB.md"), { force: true });

console.log(`Managed static deployment prepared at ${output} and ${distRoot}`);
