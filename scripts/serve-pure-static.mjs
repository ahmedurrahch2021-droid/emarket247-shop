import { createReadStream, promises as fs } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

const root = "/home/ubuntu/emarket247-hostinger-static";
const port = 4173;
const types = { ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".xml": "application/xml", ".txt": "text/plain", ".html": "text/html" };

createServer(async (request, response) => {
  const raw = decodeURIComponent((request.url || "/").split("?")[0]);
  const wanted = raw.endsWith("/") ? `${raw}index.html` : raw;
  const target = path.resolve(root, `.${wanted}`);
  if (!target.startsWith(root)) { response.writeHead(403).end(); return; }
  try {
    const info = await fs.stat(target);
    const file = info.isDirectory() ? path.join(target, "index.html") : target;
    response.writeHead(200, { "Content-Type": `${types[path.extname(file)] || "application/octet-stream"}; charset=utf-8`, "Cache-Control": "no-store" });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
}).listen(port, "0.0.0.0", () => console.log(`Serving ${root} on ${port}`));
