# HUMAN.EXE Project Summary

## Overview

HUMAN.EXE is a Version 0.1 landing page for a human performance platform built for the AI age.

The site positions HUMAN.EXE as an operating layer for energy, focus, recovery, training, and output. It uses a black futuristic visual system with neon green accents, a generated hero image, and a waitlist-first conversion flow.

## Current Version

```text
Version: 0.1
Domain target: humanexe.ai
Site type: Static landing page
Hosting target: Cloudflare Pages
```

## Core Message

```text
Upgrade the Human.
```

Supporting line:

```text
In a world obsessed with artificial intelligence, we're focused on human performance.
```

## Page Sections

- Hero with waitlist email capture
- HUMAN INDEX™
- Problem / Solution
- Ecosystem
- AI Coach
- Features
- Trust / Privacy
- Roadmap
- Future Vision
- Footer

## File Structure

```text
HUMAN.EXE Landing Page/
|-- assets/
|   |-- favicon.svg
|   `-- human-exe-hero.png
|-- DEPLOYMENT.md
|-- PROJECT_SUMMARY.md
|-- README.md
|-- index.html
|-- qa-desktop.png
|-- qa-mobile.png
|-- script.js
|-- server.mjs
`-- styles.css
```

## Key Files

- `index.html`: Main landing page markup.
- `styles.css`: Responsive dark futuristic design system.
- `script.js`: Waitlist form validation and local test capture.
- `server.mjs`: Dependency-free local preview server.
- `assets/human-exe-hero.png`: Generated hero visual.
- `assets/favicon.svg`: HUMAN.EXE favicon-style H mark.
- `DEPLOYMENT.md`: Cloudflare Pages deployment instructions for `humanexe.ai`.
- `README.md`: General project overview and local run instructions.

## Local Preview

From the project folder:

```bash
node server.mjs
```

Open:

```text
http://127.0.0.1:4173
```

## Waitlist Behavior

The current Version 0.1 waitlist form:

- Validates email format in the browser.
- Shows a success message after submission.
- Stores submitted emails in browser `localStorage` for local testing.
- Supports a production endpoint through `window.HUMAN_EXE_WAITLIST_ENDPOINT`.

Before public launch, connect the form to a real waitlist backend such as a Cloudflare Pages Function, Loops, ConvertKit, Beehiiv, Formspree, or Tally.

## Responsive Verification

The site was checked at:

- Desktop: `1280x720`
- Mobile: `390x844`

Verified:

- No horizontal overflow.
- Hero image loads.
- Primary CTA is visible.
- Mobile nav collapses.
- The next section peeks into the first viewport.
- Trust / Privacy section is included for sensitive health and performance data positioning.

The files `qa-desktop.png` and `qa-mobile.png` are local verification screenshots and are not required for deployment.

## Recommended Next Steps

1. Create a GitHub repository for the project.
2. Commit the Version 0.1 files.
3. Connect the repository to Cloudflare Pages.
4. Add `humanexe.ai` and `www.humanexe.ai` as custom domains.
5. Connect the waitlist form to a production endpoint.
6. Launch Version 0.1.
