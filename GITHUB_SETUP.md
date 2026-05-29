# GitHub Repository Setup

This project is ready to publish as a public GitHub repository for the HUMAN.EXE Version 0.1 landing page.

## Recommended Repository

```text
humanexe-landing-page
```

Recommended visibility:

```text
Public
```

## Create And Push With GitHub CLI

From the project folder:

```bash
gh repo create humanexe-landing-page --public --source=. --remote=origin --push
```

If the repository already exists:

```bash
git remote add origin https://github.com/<owner>/humanexe-landing-page.git
git push -u origin master
```

If you want the default branch to be `main`:

```bash
git branch -M main
git push -u origin main
```

## Suggested Repository Settings

- Description: `Premium HUMAN.EXE landing page for human performance in the AI age.`
- Website: `https://humanexe.ai`
- Topics: `human-performance`, `landing-page`, `cloudflare-pages`, `startup`, `ai`

## Public Repo Checklist

- `README.md` explains the project and local preview.
- `DEPLOYMENT.md` explains Cloudflare Pages and `humanexe.ai`.
- `PROJECT_SUMMARY.md` explains product positioning and site structure.
- No API keys or secrets are committed.
- Waitlist storage/webhook secrets are configured in Cloudflare, not in Git.
