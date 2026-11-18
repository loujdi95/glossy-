// Serveur local de dev : sert le site sans cache navigateur.
// Usage : node .claude/serve.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(".");
const port = Number(process.argv[2]) || 5173;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (path.endsWith("/")) path += "index.html";
  const file = normalize(join(root, path));
  if (!file.startsWith(root)) return res.writeHead(403).end();
  try {
    const info = await stat(file);
    const headers = { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control": "no-store" };
    const range = req.headers.range;
    const data = await readFile(file);
    if (range) {
      // nécessaire pour que les vidéos se lisent dans Safari
      const [s, e] = range.replace("bytes=", "").split("-");
      const start = Number(s), end = e ? Number(e) : info.size - 1;
      res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${info.size}`, "Accept-Ranges": "bytes", "Content-Length": end - start + 1 });
      return res.end(data.subarray(start, end + 1));
    }
    res.writeHead(200, { ...headers, "Content-Length": info.size, "Accept-Ranges": "bytes" });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Introuvable");
  }
}).listen(port, () => console.log(`Site sur http://localhost:${port}`));
