/** Build the managed deployment from the self-contained pure static source used for Hostinger upload. */
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(project, "static-site");
const output = path.join(project, "dist", "public");

// The root entry is the English storefront. Bengali remains available in the utility bar.
await cp(path.join(source, "en", "index.html"), path.join(source, "index.html"));
await rm(output, { recursive: true, force: true });
await mkdir(path.dirname(output), { recursive: true });
await cp(source, output, { recursive: true });
console.log(`Managed static deployment prepared at ${output}`);
