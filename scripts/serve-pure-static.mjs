import { createReadStream, promises as fs } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

// public_html is the approved deployment tree and the only site preview target.
const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const root = path.join(projectRoot, "public_html");
const port = Number(process.env.PORT) || 3000;

const types = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".webmanifest": "application/manifest+json",
};

createServer(async (request, response) => {
  const raw = decodeURIComponent((request.url || "/").split("?")[0]);

  if (request.method === "POST" && raw === "/api/dev-upload-founder") {
    let body = "";
    request.on("data", (chunk) => { body += chunk; });
    request.on("end", async () => {
      try {
        const parsed = JSON.parse(body);
        const buffer = Buffer.from(parsed.data, "base64");
        const editorialDir = path.join(root, "assets", "images", "editorial");
        await fs.mkdir(editorialDir, { recursive: true });
        const targetJpg = path.join(editorialDir, "rozina-akter.jpg");
        const targetOriginal = path.join(editorialDir, "Rozinal Akter.jpg");
        await fs.writeFile(targetJpg, buffer);
        await fs.writeFile(targetOriginal, buffer);
        
        try {
          const { execSync } = await import("node:child_process");
          const targetWebp = path.join(editorialDir, "rozina-akter.webp");
          execSync(`ffmpeg -y -i "${targetJpg}" -c:v libwebp -quality 90 "${targetWebp}" 2>/dev/null || true`);
        } catch (_) {}

        response.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ success: true }));
      } catch (err) {
        response.writeHead(500, { "Content-Type": "application/json" }).end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  const wanted = raw.endsWith("/") ? `${raw}index.html` : raw;
  let file = path.resolve(root, `.${wanted}`);

  if (!file.startsWith(root)) {
    response.writeHead(403).end();
    return;
  }

  try {
    let info;
    try {
      info = await fs.stat(file);
    } catch {
      if (!path.extname(file)) {
        file = `${file}.html`;
        info = await fs.stat(file);
      } else {
        throw new Error("Not found");
      }
    }

    if (info.isDirectory()) {
      if (!raw.endsWith("/")) {
        const query = request.url?.includes("?") ? `?${request.url.split("?")[1]}` : "";
        response.writeHead(301, { Location: `${raw}/${query}` });
        response.end();
        return;
      }
      file = path.join(file, "index.html");
      await fs.stat(file);
    }

    const ext = path.extname(file).toLowerCase();
    const contentType = types[ext] || "application/octet-stream";
    response.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    });

    const stream = createReadStream(file);
    stream.on("error", () => {
      if (!response.headersSent) {
        response.writeHead(500).end("Internal server error");
      } else {
        response.end();
      }
    });
    stream.pipe(response);
  } catch {
    const notFoundPage = path.join(root, "404.html");
    try {
      const notFoundContent = await fs.readFile(notFoundPage);
      response.writeHead(404, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      });
      response.end(notFoundContent);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
    }
  }
}).listen(port, "0.0.0.0", () => console.log(`Serving ${root} on http://localhost:${port}`));

