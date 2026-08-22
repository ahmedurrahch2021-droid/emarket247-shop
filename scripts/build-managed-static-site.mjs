/** Build the managed deployment from the same pure static package supplied for Hostinger upload. */
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

// Recreate the latest Hostinger-ready source before copying it to the managed deployment output.
await import("./package-pure-static-site.mjs");

const project = "/home/ubuntu/emarket247-shop";
const source = "/home/ubuntu/emarket247-hostinger-static";
const output = path.join(project, "dist", "public");

await rm(output, { recursive: true, force: true });
await mkdir(path.dirname(output), { recursive: true });
await cp(source, output, { recursive: true });
console.log(`Managed static deployment prepared at ${output}`);
