# HUMAN.EXE Public Launch Checklist

## Product

- Hero copy is final.
- HUMAN INDEX™ section is visible and clear.
- AI Coach preview is visible and useful.
- Problem / Solution section is concise.
- Trust / Privacy section is included.
- Waitlist CTA is visible on desktop and mobile.

## Technical

- Local preview works at `http://127.0.0.1:4173`.
- GitHub repository is public.
- Cloudflare Pages is connected to GitHub.
- Production branch deploys successfully.
- `humanexe.ai` is active.
- `www.humanexe.ai` is active or redirected to `humanexe.ai`.
- HTTPS certificate is active.
- No mixed content warnings.
- Lighthouse mobile page has no layout overflow.

## Waitlist

- `/api/waitlist` returns a healthy JSON response.
- Valid email submissions return success.
- Invalid emails return a 400 response.
- `WAITLIST_KV` binding is configured if using Cloudflare KV.
- `WAITLIST_WEBHOOK_URL` secret is configured if forwarding to a provider.
- Success message reads: `System online. You’re on the list.`

## Analytics

- Plausible site exists for `humanexe.ai`.
- Plausible script is present in `index.html`.
- Pageviews appear in Plausible.
- `Waitlist Signup` custom event appears after form submission.

## SEO / Sharing

- Title: `HUMAN.EXE | Upgrade the Human`
- Canonical URL: `https://humanexe.ai/`
- Meta description is present.
- Open Graph title, description, and image are present.
- Twitter card metadata is present.
- Favicon loads.

## Social Launch

- LinkedIn launch post is ready.
- Instagram launch post is ready.
- Production URL has been tested on mobile.
- First comments or link-in-bio URL point to `https://humanexe.ai`.
