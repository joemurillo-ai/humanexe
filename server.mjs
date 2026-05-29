import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

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

  if (url.pathname === "/api/waitlist") {
    try {
      const { onRequestGet, onRequestPost } = await import(
        pathToFileURL(resolve(root, "functions/api/waitlist.js"))
      );
      const chunks = [];

      for await (const chunk of request) {
        chunks.push(chunk);
      }

      const body = Buffer.concat(chunks);
      const apiRequest = new Request(`http://${host}:${port}${url.pathname}`, {
        method: request.method,
        headers: request.headers,
        body: body.length ? body : undefined,
      });
      const handler = request.method === "POST" ? onRequestPost : onRequestGet;
      const apiResponse = await handler({ request: apiRequest, env: {} });

      response.writeHead(apiResponse.status, Object.fromEntries(apiResponse.headers));
      response.end(await apiResponse.text());
    } catch {
      response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ ok: false, error: "Waitlist unavailable" }));
    }

    return;
  }

  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  let filePath = resolve(root, `.${decodeURIComponent(pathname)}`);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    let file;

    try {
      file = await readFile(filePath);
    } catch (error) {
      if (!extname(filePath)) {
        filePath = `${filePath}.html`;
        file = await readFile(filePath);
      } else {
        throw error;
      }
    }

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
