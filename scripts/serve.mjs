import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("out");
const flag = process.argv.indexOf("--port");
const port = Number(flag >= 0 ? process.argv[flag + 1] : 3000);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const file = path.resolve(root, "." + decodeURIComponent(url.pathname));
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    let selected = file;
    try { if ((await stat(selected)).isDirectory()) selected = path.join(selected, "index.html"); } catch { selected = file + ".html"; }
    const content = await readFile(selected);
    res.writeHead(200, { "Content-Type": types[path.extname(selected)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(content);
  } catch { res.writeHead(404); res.end("Not found"); }
});
server.listen(port, "127.0.0.1", () => console.log(`Local: http://127.0.0.1:${port}`));
