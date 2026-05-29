# Cloudflare Pages Settings

Use this as the exact setup screen reference for the HUMAN.EXE Pages project.

## Project

```text
Project name: humanexe-ai
Production URL: https://humanexe.ai
Preview URL: https://humanexe-ai.pages.dev
Source repository: joemurillo-ai/humanexe
Production branch: main
```

## Build Settings

```text
Framework preset: None
Root directory: /
Build command: leave blank
Build output directory: /
```

Fallback build command if Cloudflare requires one:

```bash
exit 0
```

## Git Settings

```text
Git provider: GitHub
Repository: joemurillo-ai/humanexe
Production branch: main
Automatic production deployments: Enabled
Preview deployments: Enabled for pull requests or selected branches
```

Recommended GitHub app permissions:

```text
Repository access: Only select repositories
Selected repository: joemurillo-ai/humanexe
```

## Custom Domains

Add both:

```text
humanexe.ai
www.humanexe.ai
```

Recommended routing:

```text
https://humanexe.ai -> primary production domain
https://www.humanexe.ai -> redirect to https://humanexe.ai
```

The repository includes `_redirects` for the `www` to apex redirect.

## Functions

This repository includes a Pages Function:

```text
functions/api/waitlist.js
```

Endpoint:

```text
POST /api/waitlist
```

## Bindings

Recommended binding:

```text
Type: KV namespace
Variable name: WAITLIST_KV
Namespace: HUMANEXE_WAITLIST
Environment: Production
```

Optional secret:

```text
Type: Secret
Variable name: WAITLIST_WEBHOOK_URL
Value: your webhook URL
Environment: Production
```

## Environment Variables

No build-time environment variables are required for the static landing page.

Only add runtime bindings if enabling production waitlist persistence or forwarding.

## Deployment Checks

After every production deployment, verify:

- Latest Git commit appears in Cloudflare deployment details.
- Build status is successful.
- Production branch is `main`.
- Custom domains are active.
- `/api/waitlist` responds on the custom domain.
- No old Pages project is attached to `humanexe.ai`.
