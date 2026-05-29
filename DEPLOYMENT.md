# HUMAN.EXE Cloudflare Pages Deployment

This runbook connects the source-of-truth GitHub repository to Cloudflare Pages and publishes HUMAN.EXE at:

```text
https://humanexe.ai
```

## Source Of Truth

Use this repository:

```text
https://github.com/joemurillo-ai/humanexe
```

The older repository is not production:

```text
https://github.com/joemurillo-ai/humanexe-landing-page
```

Keep the old repository disconnected from Cloudflare Pages to avoid duplicate or failed deployments.

## Deployment Model

Recommended production path:

```text
GitHub main branch -> Cloudflare Pages Git integration -> humanexe.ai
```

Do not use both Cloudflare Git integration and GitHub Actions deployment at the same time unless you intentionally want two deployment paths. The current recommendation is Cloudflare Pages Git integration.

## Prerequisites

- GitHub repository access to `joemurillo-ai/humanexe`
- Cloudflare account access
- Ownership or DNS control of `humanexe.ai`
- `main` branch pushed to GitHub
- Cloudflare Pages project name available:

```text
humanexe-ai
```

## Step 1: Confirm GitHub Is Ready

From the local project directory:

```bash
git status
git remote -v
git branch --show-current
git push origin main
```

Expected:

```text
Branch: main
Origin: https://github.com/joemurillo-ai/humanexe.git
Working tree: clean
```

## Step 2: Create Cloudflare Pages Project

1. Log in to Cloudflare.
2. Open **Workers & Pages**.
3. Select **Create application**.
4. Select **Pages**.
5. Select **Connect to Git**.
6. Choose GitHub.
7. Authorize the Cloudflare Workers & Pages GitHub app if prompted.
8. Grant access to only this repository when possible:

```text
joemurillo-ai/humanexe
```

9. Select the repository and continue.

Cloudflare documentation reference:

```text
https://developers.cloudflare.com/pages/get-started/git-integration/
```

## Step 3: Configure Pages Settings

Use these exact settings:

```text
Project name: humanexe-ai
Production branch: main
Framework preset: None
Root directory: /
Build command: leave blank
Build output directory: /
Environment variables: none required for the static page
```

Why the build command is blank:

This project is a static HTML/CSS/JS site at the repository root. Cloudflare Pages supports deploying without a framework or build step.

If Cloudflare requires a non-empty build command in your dashboard, use:

```bash
exit 0
```

Then select **Save and Deploy**.

## Step 4: Verify The pages.dev Preview

Cloudflare will create a preview URL similar to:

```text
https://humanexe-ai.pages.dev
```

Open it and verify:

- Homepage loads.
- `assets/human-exe-hero.png` loads.
- `assets/favicon.svg` loads.
- Waitlist form is visible.
- `/api/waitlist` does not 404 on production Pages.
- Desktop and mobile layouts have no horizontal overflow.

## Step 5: Add humanexe.ai

Inside the Cloudflare Pages project:

1. Open **Custom domains**.
2. Select **Set up a domain**.
3. Enter:

```text
humanexe.ai
```

4. Follow Cloudflare's DNS prompts.
5. Wait for the custom domain status to become **Active**.

Important:

Cloudflare requires an apex/root custom domain like `humanexe.ai` to be on Cloudflare DNS in the same Cloudflare account as the Pages project.

Cloudflare documentation reference:

```text
https://developers.cloudflare.com/pages/configuration/custom-domains/
```

## Step 6: Add www.humanexe.ai

Add a second custom domain:

```text
www.humanexe.ai
```

Recommended canonical setup:

```text
Primary: https://humanexe.ai
Redirect: https://www.humanexe.ai/* -> https://humanexe.ai/$1
```

Use Cloudflare Bulk Redirects or Redirect Rules for the `www` redirect.

Cloudflare documentation reference:

```text
https://developers.cloudflare.com/pages/how-to/www-redirect/
```

## Step 7: Configure Waitlist Storage

The site posts waitlist signups to:

```text
/api/waitlist
```

The Cloudflare Pages Function lives at:

```text
functions/api/waitlist.js
```

Recommended production setup:

1. In Cloudflare, create a KV namespace named:

```text
HUMANEXE_WAITLIST
```

2. Open the Pages project.
3. Go to **Settings** -> **Bindings**.
4. Add a KV namespace binding:

```text
Variable name: WAITLIST_KV
KV namespace: HUMANEXE_WAITLIST
```

5. Optional: add a secret for forwarding signups to another system:

```text
WAITLIST_WEBHOOK_URL
```

6. Redeploy the Pages project.

## Step 8: Verify Production

Open:

```text
https://humanexe.ai
https://www.humanexe.ai
```

Verify:

- HTTPS is active.
- The root domain is canonical.
- `www` redirects to root or loads intentionally.
- The page title is `HUMAN.EXE | Upgrade the Human`.
- Open Graph tags exist.
- Favicon loads.
- Waitlist form returns the success state after submission.
- Cloudflare Pages deployment logs show success.

## Step 9: Ongoing Deployment Flow

After Cloudflare Pages is connected to GitHub, ship updates with:

```bash
git add .
git commit -m "Update HUMAN.EXE landing page"
git push origin main
```

Each push to `main` should trigger a Cloudflare Pages production deployment.

## Related Guides In This Repository

- `DNS_SETUP.md`
- `CLOUDFLARE_PAGES_SETTINGS.md`
- `SSL_VERIFICATION_CHECKLIST.md`

