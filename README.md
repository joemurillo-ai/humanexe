# HUMAN.EXE Landing Page

HUMAN.EXE is a dark, futuristic landing page for a human performance platform. The product concept focuses on upgrading human readiness, focus, recovery, training, and output in a world increasingly centered on artificial intelligence.

This repository is Version 0.1: a static landing page with a waitlist form, hero visual, ecosystem overview, feature section, roadmap, and footer.

## Project Structure

```text
.
|-- assets/
|   `-- human-exe-hero.png
|-- DEPLOYMENT.md
|-- README.md
|-- index.html
|-- qa-desktop.png
|-- qa-mobile.png
|-- script.js
|-- server.mjs
`-- styles.css
```

`qa-desktop.png` and `qa-mobile.png` are local verification screenshots. They are not required for Cloudflare Pages deployment.

## Run Locally

This is a dependency-free static site. You only need Node.js to use the included preview server.

```bash
node server.mjs
```

Then open:

```text
http://127.0.0.1:4173
```

You can also open `index.html` directly in a browser, but the local server is closer to how the site will run in production.

## Waitlist Capture

The waitlist form validates email addresses in the browser and stores submissions in `localStorage` for local testing.

For production, connect the form to a real endpoint by setting:

```html
<script>
  window.HUMAN_EXE_WAITLIST_ENDPOINT = "https://your-waitlist-endpoint.example";
</script>
```

Place that snippet before `script.js` in `index.html`, or replace the current client-side submission logic with your preferred waitlist provider.

Common options:

- Cloudflare Pages Function
- ConvertKit
- Loops
- Beehiiv
- Formspree
- Tally

## Deploy To Cloudflare Pages

1. Push this project to a GitHub repository.
2. In Cloudflare, open **Workers & Pages**.
3. Select **Create application**.
4. Choose **Pages**.
5. Connect the GitHub repository.
6. Use these build settings:
   - Framework preset: `None`
   - Build command: leave blank
   - Build output directory: `/`
7. Deploy the project.
8. Add the custom domain `humanexe.ai` in the Pages project settings.

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full domain setup flow.
