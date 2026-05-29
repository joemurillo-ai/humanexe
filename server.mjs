import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const port = Number(process.env.PORT || 4173);
const host = "127.0.0.1";
const root = resolve(process.cwd());

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
};

createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${host}:${port}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = resolve(root, `.${decodeURIComponent(pathname)}`);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream",
    });
    response.end(file);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(port, host, () => {
  console.log(`HUMAN.EXE preview: http://${host}:${port}`);
});
