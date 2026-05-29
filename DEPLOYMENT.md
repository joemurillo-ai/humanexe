# Deploy HUMAN.EXE To humanexe.ai

This guide publishes the HUMAN.EXE Version 0.1 static landing page to:

```text
https://humanexe.ai
```

Hosting target:

```text
Cloudflare Pages
```

## Source Of Truth

The source of truth repository is:

```text
https://github.com/joemurillo-ai/humanexe
```

The older repository is no longer used for production deployment:

```text
https://github.com/joemurillo-ai/humanexe-landing-page
```

Its Cloudflare Pages GitHub Actions workflow should remain disabled to avoid duplicate failed deployments.

## Connection Status

This project is ready to deploy, but `humanexe.ai` cannot be connected from the local workspace alone. Connecting the domain requires access to the Cloudflare account that manages `humanexe.ai`, or access to the DNS provider where the domain is registered.

Use this guide to:

- Deploy the static site to Cloudflare Pages.
- Attach `humanexe.ai` to the Pages project.
- Attach `www.humanexe.ai`.
- Confirm HTTPS.
- Prepare production waitlist capture.

## 1. Confirm The Project Files

The deployable site should include:

```text
assets/human-exe-hero.png
assets/favicon.svg
index.html
styles.css
script.js
functions/api/waitlist.js
server.mjs
README.md
PROJECT_SUMMARY.md
DEPLOYMENT.md
```

The local QA screenshots are optional and do not need to be deployed:

```text
qa-desktop.png
qa-mobile.png
```

## 2. Preview Locally

From the project folder:

```bash
node server.mjs
```

Open:

```text
http://127.0.0.1:4173
```

Verify:

- The hero image loads.
- The waitlist form is visible above the fold.
- The email field validates submissions.
- The Problem, Solution, Ecosystem, Features, Roadmap, and Footer sections render.
- The site works on desktop and mobile.

Stop the local server with `Ctrl+C`.

## 3. Push To GitHub

Create a GitHub repository, then commit and push the project:

```bash
git add .
git commit -m "Ship HUMAN.EXE v0.1"
git branch -M main
git remote add origin https://github.com/<your-user-or-org>/<repo-name>.git
git push -u origin main
```

If the remote already exists, use:

```bash
git push
```

Cloudflare Pages can deploy directly from GitHub, and every push to the selected production branch can trigger a new deployment.

## 4. Create The Cloudflare Pages Project

1. Log in to Cloudflare.
2. Open **Workers & Pages** in the Cloudflare dashboard.
3. Click **Create application**.
4. Select **Pages**.
5. Choose **Connect to Git**.
6. Connect GitHub if prompted.
7. Select `joemurillo-ai/humanexe`.

Recommended project name:

```text
humanexe-ai
```

## 5. Configure Build Settings

Use these settings:

```text
Framework preset: None
Build command: exit 0
Build output directory: /
Root directory: /
Production branch: main
```

Use `exit 0` as the build command. Cloudflare recommends this for static sites that want access to Pages Functions.

Click **Save and Deploy**.

For this repository, Cloudflare should serve `index.html` directly from the repository root.

## 6. Verify The Pages Preview URL

Cloudflare will create a temporary preview URL similar to:

```text
https://<project-name>.pages.dev
```

Open that URL and verify the landing page before attaching the production domain.

## 7. Add humanexe.ai

In the Cloudflare Pages project:

1. Open **Custom domains**.
2. Click **Set up a custom domain**.
3. Enter:

```text
humanexe.ai
```

4. Follow Cloudflare's prompts.
5. Wait until the domain status shows **Active**.

If `humanexe.ai` already uses Cloudflare nameservers, Cloudflare can configure the DNS record automatically.

If DNS is hosted somewhere else, Cloudflare will provide DNS instructions that must be completed at the current DNS provider before the domain can become active.

Expected production URL:

```text
https://humanexe.ai
```

## 8. Add www.humanexe.ai

Repeat the custom domain flow for:

```text
www.humanexe.ai
```

Recommended final setup:

```text
Primary domain: humanexe.ai
Redirect: www.humanexe.ai -> humanexe.ai
```

Use Cloudflare Redirect Rules if you want all traffic to resolve to the root domain.

## 9. Confirm HTTPS

Cloudflare Pages automatically provisions SSL certificates for custom domains.

After both custom domains are active, open:

```text
https://humanexe.ai
https://www.humanexe.ai
```

Confirm:

- Both domains load securely over HTTPS.
- The root domain is the preferred canonical version.
- There are no mixed-content warnings.
- The hero image loads from `/assets/human-exe-hero.png`.
- The waitlist form validates email addresses.

## 10. Optional: Redirect pages.dev To humanexe.ai

After the custom domain works, you may want the temporary Cloudflare Pages URL to redirect to the production domain.

In Cloudflare:

1. Open the Pages project.
2. Find the redirect/custom-domain settings available for the project.
3. Configure the `*.pages.dev` deployment URL to redirect to:

```text
https://humanexe.ai
```

## 11. Connect Production Waitlist Capture

The current Version 0.1 form posts to:

```text
/api/waitlist
```

That endpoint is implemented as a Cloudflare Pages Function:

```text
functions/api/waitlist.js
```

Recommended Cloudflare-native setup:

1. Create a KV namespace for waitlist submissions.
2. Bind it to the Pages project as:

```text
WAITLIST_KV
```

3. Optional: add a Pages secret for forwarding submissions:

```text
WAITLIST_WEBHOOK_URL
```

4. Redeploy through Cloudflare Pages.

Low-code alternatives:

- Loops
- ConvertKit
- Beehiiv
- Formspree
- Tally

## 12. Final Launch Checklist

Before announcing the site:

- `https://humanexe.ai` loads.
- `https://www.humanexe.ai` redirects or resolves correctly.
- SSL is active.
- The page title is `HUMAN.EXE | Upgrade the Human`.
- The SEO description is present.
- The hero image loads.
- Desktop layout has no horizontal overflow.
- Mobile layout has no horizontal overflow.
- Waitlist capture is connected to a real backend.
- The temporary `*.pages.dev` URL is handled as desired.

## 13. Redeploy Updates

After Cloudflare Pages is connected to GitHub, every push to `main` triggers a new deployment.

Typical update flow:

```bash
git add .
git commit -m "Update HUMAN.EXE landing page"
git push
```

Then check the Cloudflare Pages deployment log and visit:

```text
https://humanexe.ai
```

## 14. Optional GitHub Actions Deployment

This repository includes:

```text
.github/workflows/cloudflare-pages.yml
```

This workflow deploys the repository root to Cloudflare Pages with Wrangler. It is intentionally manual-only to prevent failed deployments before Cloudflare secrets are configured.

Required GitHub repository secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

The workflow command is:

```text
pages deploy . --project-name=humanexe-ai --branch=main
```

Use either the Cloudflare Git integration or this GitHub Actions workflow. You do not need both active at the same time.

Recommended production path:

```text
Cloudflare Pages Git integration -> joemurillo-ai/humanexe -> main
```

Use the GitHub Actions workflow only after adding both required secrets.
