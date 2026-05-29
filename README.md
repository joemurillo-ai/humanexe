# HUMAN.EXE

Premium landing page for HUMAN.EXE, a human performance operating layer for the AI age.

HUMAN.EXE turns scattered health, training, recovery, and focus signals into one actionable operating state.

```text
Upgrade the Human.
```

## What Is HUMAN.EXE?

HUMAN.EXE is a performance platform concept for founders, operators, athletes, creators, and high performers.

Version 0.1 introduces:

- HUMAN INDEX™: one daily score for recovery, focus, training load, and execution readiness.
- AI Coach: a performance-aware assistant for choosing the next best action.
- Privacy-first positioning for sensitive health and performance signals.
- Waitlist capture for the private beta.

## Project Structure

```text
.
|-- assets/
|   |-- favicon.svg
|   `-- human-exe-hero.png
|-- DEPLOYMENT.md
|-- GITHUB_SETUP.md
|-- LAUNCH_CHECKLIST.md
|-- PROJECT_SUMMARY.md
|-- README.md
|-- SOCIAL_POSTS.md
|-- functions/
|   `-- api/
|       `-- waitlist.js
|-- index.html
|-- qa-desktop.png
|-- qa-mobile.png
|-- script.js
|-- server.mjs
`-- styles.css
```

`qa-*.png` files are local verification screenshots. They are not required for Cloudflare Pages deployment.

## Run Locally

This is a mostly static site. You only need Node.js to use the included local preview server.

```bash
node server.mjs
```

Then open:

```text
http://127.0.0.1:4173
```

You can also open `index.html` directly in a browser, but the local server is closer to how the site will run in production.

## Waitlist Capture

The waitlist form validates email addresses in the browser and posts to:

```text
/api/waitlist
```

On Cloudflare Pages, this is handled by:

```text
functions/api/waitlist.js
```

The function supports:

- `WAITLIST_KV`: optional Cloudflare KV binding.
- `WAITLIST_WEBHOOK_URL`: optional webhook secret for forwarding signups.

If neither is configured, the endpoint still validates and returns success, which is useful for launch testing.

## Analytics

The site includes the Plausible Analytics script for:

```text
humanexe.ai
```

The waitlist form also sends a `Waitlist Signup` event when Plausible is available.

## Deploy To Cloudflare Pages

1. Push this project to a GitHub repository.
2. In Cloudflare, open **Workers & Pages**.
3. Select **Create application**.
4. Choose **Pages**.
5. Connect the GitHub repository.
6. Use these build settings:
   - Framework preset: `None`
   - Build command: `exit 0`
   - Build output directory: `/`
7. Deploy the project.
8. Add the custom domain `humanexe.ai` in the Pages project settings.

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full domain setup flow.

## Launch Docs

- [GITHUB_SETUP.md](GITHUB_SETUP.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)
- [SOCIAL_POSTS.md](SOCIAL_POSTS.md)
