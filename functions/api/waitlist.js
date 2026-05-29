export async function onRequestPost({ request, env }) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const email = String(payload.email || "").trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "Invalid email" }, 400);
  }

  const entry = {
    email,
    source: payload.source || "humanexe.ai",
    createdAt: new Date().toISOString(),
  };

  if (env.WAITLIST_KV) {
    await env.WAITLIST_KV.put(`waitlist:${email}`, JSON.stringify(entry));
  }

  if (env.WAITLIST_WEBHOOK_URL) {
    await fetch(env.WAITLIST_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
  }

  return json({ ok: true });
}

export function onRequestGet() {
  return json({ ok: true, service: "HUMAN.EXE waitlist" });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
