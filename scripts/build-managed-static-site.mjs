/**
 * Create a clean deployment snapshot from public_html.
 *
 * public_html is the approved Hostinger deployment tree. This script never
 * writes back to public_html and never synchronizes legacy source trees.
 */
import { cp, mkdir, readdir, rm } from "node:fs/promises";
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

// Database setup material lives in /database, outside public_html, so it can
// no longer reach a deployment by accident. Stripping it from the snapshot was
// never real protection: the approved deployment source is public_html itself,
// not this snapshot, so anything sitting in the web root shipped regardless.
//
// The build now fails loudly instead, because a silent deletion here would
// hide the same mistake from the person uploading the site.
const forbiddenInWebRoot = /\.(?:sql|env|log|bak|old|orig)$/i;
const staged = await readdir(output, { recursive: true });
const leaked = staged.filter((entry) => forbiddenInWebRoot.test(entry));

if (leaked.length > 0) {
  throw new Error(
    `Cannot build: deployment material must not contain database or environment files.\n` +
      leaked.map((entry) => `  - public_html/${entry}`).join("\n") +
      `\nMove these to /database (repository only) before building.`,
  );
}

console.log(`Deployment snapshot prepared from public_html at ${output}`);
