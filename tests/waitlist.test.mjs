import assert from "node:assert/strict";
import test from "node:test";
import { onRequestPost } from "../functions/api/waitlist.js";

function request(body) {
  return new Request("https://example.test/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

test("rejects invalid JSON and email", async () => {
  assert.equal((await onRequestPost({ request: request("{"), env: {} })).status, 400);
  assert.equal((await onRequestPost({ request: request({ email: "not-an-email" }), env: {} })).status, 400);
});

test("does not claim signup when no destination is configured", async () => {
  const response = await onRequestPost({ request: request({ email: "test@example.com" }), env: {} });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
});

test("confirms successful KV write", async () => {
  const written = [];
  const response = await onRequestPost({
    request: request({ email: "Test@Example.com" }),
    env: { WAITLIST_KV: { put: async (...args) => written.push(args) } },
  });
  assert.equal(response.status, 200);
  assert.equal(written.length, 1);
  assert.equal(written[0][0], "waitlist:test@example.com");
});

test("rejects failed KV write", async () => {
  const response = await onRequestPost({
    request: request({ email: "test@example.com" }),
    env: { WAITLIST_KV: { put: async () => { throw new Error("storage unavailable"); } } },
  });
  assert.equal(response.status, 503);
});

test("rejects unsuccessful webhook acknowledgment", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => new Response("error", { status: 500 });
  const response = await onRequestPost({
    request: request({ email: "test@example.com" }),
    env: { WAITLIST_WEBHOOK_URL: "https://example.test/receive" },
  });
  assert.equal(response.status, 503);
});

test("confirms successful webhook acknowledgment", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => new Response(null, { status: 204 });
  const response = await onRequestPost({
    request: request({ email: "test@example.com" }),
    env: { WAITLIST_WEBHOOK_URL: "https://example.test/receive" },
  });
  assert.equal(response.status, 200);
});
