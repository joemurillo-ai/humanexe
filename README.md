# HUMAN.EXE

Landing-page prototype for HUMAN.EXE, a proposed human-performance platform for the AI age.

The product concept aims to translate health, training, recovery, and focus signals into an actionable daily view. The repository demonstrates a web experience; it does not establish validated health scoring or a deployed coaching service.

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

**Important:** If neither destination is configured, the endpoint may still return a success response for testing **without retaining the email address**. Do not advertise the waitlist as operational until a storage or forwarding destination is configured and end-to-end persistence has been verified. This behavior needs a code-level fix before a production launch; the README change alone does not resolve it.

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

## Responsible product boundaries

The HUMAN INDEX and AI Coach are product concepts, not validated medical measures or clinical recommendations. Avoid presenting sample scores as medical guidance. Do not collect sensitive health information without a defined privacy policy, data-retention controls, and appropriate security review.

## Release checklist

- [ ] Confirm waitlist submissions are durably recorded or explicitly rejected when storage is unavailable.
- [ ] Verify error and success messages reflect actual backend outcomes.
- [ ] Run and pass CI, local checks, and accessibility review.
- [ ] Verify analytics and privacy disclosures before production use.
- [ ] Confirm the domain and production deployment independently.

These items are not represented as completed by this documentation update.
