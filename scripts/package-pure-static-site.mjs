/** Package the generated pure static site with only locally copied assets for Hostinger File Manager upload. */
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const project = "/home/ubuntu/emarket247-shop";
const source = path.join(project, "static-site");
const output = "/home/ubuntu/emarket247-hostinger-static";
const common = "/home/ubuntu/webdev-static-assets/emarket247-static-common";
const products = "/home/ubuntu/webdev-static-assets/emarket247-product-catalog/products";

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
await cp(common, path.join(output, "assets/images"), { recursive: true });
await cp(products, path.join(output, "assets/images/products"), { recursive: true });
console.log(`Pure static Hostinger package created at ${output}`);
