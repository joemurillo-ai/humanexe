// Fail closed: a successful response requires confirmation from at least one
// configured destination. Never log or return submitted email addresses.
export async function onRequestPost({ request, env = {} }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return json({ ok: false, error: "Invalid request" }, 400);
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "Invalid email" }, 400);
  }

  const hasKv = Boolean(env.WAITLIST_KV && typeof env.WAITLIST_KV.put === "function");
  const hasWebhook = typeof env.WAITLIST_WEBHOOK_URL === "string" && env.WAITLIST_WEBHOOK_URL.length > 0;

  if (!hasKv && !hasWebhook) {
    return json({ ok: false, error: "Waitlist temporarily unavailable" }, 503);
  }

  const entry = {
    email,
    source: "humanexe.ai",
    createdAt: new Date().toISOString(),
  };

  // Attempt both configured destinations; accept if at least one confirms.
  // A successful KV put is a provider acknowledgment, not proof of global
  // replication or downstream delivery.
  let accepted = false;

  if (hasKv) {
    try {
      await env.WAITLIST_KV.put(`waitlist:${email}`, JSON.stringify(entry));
      accepted = true;
    } catch {
      // The webhook may still provide a valid independent destination.
    }
  }

  if (hasWebhook) {
    try {
      const url = new URL(env.WAITLIST_WEBHOOK_URL);
      if (url.protocol === "https:") {
        const response = await fetch(url.toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
        if (response.ok) accepted = true;
      }
    } catch {
      // Fail closed if no other destination acknowledged the entry.
    }
  }

  if (!accepted) {
    return json({ ok: false, error: "Waitlist temporarily unavailable" }, 503);
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
