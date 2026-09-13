import { createReadStream, promises as fs } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

// Local, throwaway preview server for read-only visual QA of the pure-static site.
const root = path.resolve("F:/EMARKET247/Project 011/emarket247-shop-main/static-site");
const port = 4180;
const types = { ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain", ".html": "text/html" };

createServer(async (request, response) => {
  const raw = decodeURIComponent((request.url || "/").split("?")[0]);
  const wanted = raw.endsWith("/") ? `${raw}index.html` : raw;
  const target = path.resolve(root, `.${wanted}`);
  const rel = path.relative(root, target);
  if (rel.startsWith("..") || path.isAbsolute(rel)) { response.writeHead(403).end(); return; }
  try {
    const info = await fs.stat(target);
    const file = info.isDirectory() ? path.join(target, "index.html") : target;
    response.writeHead(200, { "Content-Type": `${types[path.extname(file)] || "application/octet-stream"}; charset=utf-8`, "Cache-Control": "no-store" });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`Serving ${root} on ${port}`));
