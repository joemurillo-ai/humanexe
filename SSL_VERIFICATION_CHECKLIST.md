# SSL Verification Checklist

Use this checklist after connecting `humanexe.ai` and `www.humanexe.ai` to Cloudflare Pages.

## Cloudflare Dashboard

- [ ] `humanexe.ai` is active in Cloudflare DNS.
- [ ] `humanexe.ai` appears under the `humanexe-ai` Pages project custom domains.
- [ ] `www.humanexe.ai` appears under the `humanexe-ai` Pages project custom domains.
- [ ] Both custom domains show **Active**.
- [ ] SSL/TLS certificate status is active.
- [ ] DNS proxy status is enabled where Cloudflare recommends it.

## Browser Checks

Open:

```text
https://humanexe.ai
https://www.humanexe.ai
```

Verify:

- [ ] Browser shows a secure lock icon.
- [ ] Certificate is issued for `humanexe.ai`.
- [ ] Certificate covers `www.humanexe.ai`.
- [ ] No browser privacy warning appears.
- [ ] No mixed-content warning appears.
- [ ] Hero image loads over HTTPS.
- [ ] Favicon loads over HTTPS.
- [ ] Waitlist form submits over HTTPS.

## Redirect Checks

Recommended canonical behavior:

```text
https://humanexe.ai
```

Verify:

- [ ] `http://humanexe.ai` redirects to `https://humanexe.ai`.
- [ ] `https://www.humanexe.ai` redirects to `https://humanexe.ai`, or intentionally loads if no redirect is desired.
- [ ] Redirect preserves paths.
- [ ] Redirect preserves query strings if using campaign URLs.

Command-line checks:

```bash
curl -I http://humanexe.ai
curl -I https://humanexe.ai
curl -I https://www.humanexe.ai
```

Expected:

```text
http://humanexe.ai -> 301/308 -> https://humanexe.ai
https://humanexe.ai -> 200
https://www.humanexe.ai -> 301/308 -> https://humanexe.ai or 200 if intentionally active
```

## CAA Record Check

If SSL certificate issuance is stuck, check DNS CAA records.

Cloudflare Pages certificates may fail if restrictive CAA records do not allow Cloudflare-supported certificate authorities.

If CAA records exist, allow the certificate authorities Cloudflare lists in the Pages custom-domain flow.

## Final Launch Gate

- [ ] `https://humanexe.ai` is live.
- [ ] SSL is valid.
- [ ] `www` behavior is intentional.
- [ ] Pages deployment logs are clean.
- [ ] GitHub source is `joemurillo-ai/humanexe`.
- [ ] Old repo `joemurillo-ai/humanexe-landing-page` is not connected to production.
- [ ] Waitlist endpoint is connected and tested.

