import express from "express";
import { createServer } from "http";
import fs from "fs";
import path from "path";

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const currentDir = typeof __dirname !== "undefined" ? __dirname : process.cwd();

async function startServer() {
  const app = express();

  // Robustly determine static directory (supporting dist, dist/public, static-site, public_html)
  const candidatePaths = [
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "dist"),
    path.resolve(currentDir, "public"),
    path.resolve(currentDir, "dist", "public"),
    path.resolve(process.cwd(), "public_html"),
    path.resolve(process.cwd(), "static-site"),
  ];

  const staticPath =
    candidatePaths.find((p) => fs.existsSync(p) && fs.existsSync(path.join(p, "index.html"))) ||
    candidatePaths[0];

  console.log(`[server] Serving static assets from: ${staticPath}`);

  // Health check endpoints for Cloud Run, Kubernetes, and reverse proxies
  const healthHandler = (_req: express.Request, res: express.Response) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
  };
  app.get("/api/health", healthHandler);
  app.get("/healthz", healthHandler);
  app.get("/health", healthHandler);
  app.get("/_health", healthHandler);

  // Serve static files with html extension resolution
  app.use(
    express.static(staticPath, {
      extensions: ["html", "htm"],
      index: "index.html",
      redirect: true,
      maxAge: "1h",
    })
  );

  // SPA fallback for HTML pages
  app.get("*", (_req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Page not found");
    }
  });

  // Determine ports:
  // In Cloud Run, process.env.PORT is passed (typically 8080) for ingress health checks.
  // In local/dev reverse proxy setups, port 3000 is used.
  // We bind to both targetPort and 3000 to guarantee compatibility across all environments.
  const rawPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
  const targetPort = !isNaN(rawPort) && rawPort > 0 ? rawPort : 8080;
  const ports = Array.from(new Set([targetPort, 3000]));

  const activeServers: ReturnType<typeof createServer>[] = [];

  for (const port of ports) {
    try {
      const serverInstance = createServer(app);
      serverInstance.listen(port, "0.0.0.0", () => {
        console.log(`[server] Server listening on http://0.0.0.0:${port}/`);
      });
      serverInstance.on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
          console.log(`[server] Port ${port} is already in use by proxy/parent, proceeding.`);
        } else {
          console.error(`[server] Error on port ${port}:`, err.message);
        }
      });
      activeServers.push(serverInstance);
    } catch (err: any) {
      console.log(`[server] Could not initialize listener on port ${port}:`, err.message);
    }
  }

  // Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`[server] Received ${signal}, shutting down gracefully...`);
    activeServers.forEach((srv) => {
      try {
        srv.close();
      } catch {}
    });
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startServer().catch((err) => {
  console.error("[server] Fatal startup error:", err);
  process.exit(1);
});
