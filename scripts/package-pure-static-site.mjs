/** Package the generated pure static site with only locally copied assets for Hostinger File Manager upload. */
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(project, "static-site");
const output = path.join(project, "dist", "hostinger-file-manager");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
console.log(`Pure static Hostinger package created at ${output}`);
