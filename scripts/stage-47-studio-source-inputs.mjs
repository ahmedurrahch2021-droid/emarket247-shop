/** Copy the 47 verified originals into numbered working inputs; originals remain untouched. */
import { cp, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(await readFile(path.join(project, "research/studio-catalog-batch-jobs.json"), "utf8"));
const destination = "/home/ubuntu/webdev-static-assets/studio-source-inputs";
await mkdir(destination, { recursive: true });
for (const job of manifest.jobs) {
  const suffix = path.extname(job.source_path).toLowerCase() || ".jpeg";
  await cp(job.source_path, path.join(destination, `emarket247-source-${String(job.index).padStart(2, "0")}${suffix}`));
}
console.log(`Copied ${manifest.jobs.length} verified source images into ${destination}.`);
