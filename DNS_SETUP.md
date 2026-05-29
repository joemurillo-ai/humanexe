# DNS Setup Guide For humanexe.ai

This guide points `humanexe.ai` and `www.humanexe.ai` to the Cloudflare Pages project.

## Target

```text
Primary domain: humanexe.ai
WWW domain: www.humanexe.ai
Pages project: humanexe-ai
Pages URL: https://humanexe-ai.pages.dev
```

## Recommended DNS Ownership

For the apex/root domain `humanexe.ai`, use Cloudflare DNS as the authoritative DNS provider.

Cloudflare Pages requires apex custom domains to be added as a Cloudflare zone and served from the same Cloudflare account as the Pages project.

## Step 1: Add humanexe.ai To Cloudflare

1. Log in to Cloudflare.
2. Select **Add a domain**.
3. Enter:

```text
humanexe.ai
```

4. Choose a plan.
5. Let Cloudflare scan existing DNS records.
6. Review imported records before continuing.

## Step 2: Update Nameservers At The Registrar

Cloudflare will provide two nameservers similar to:

```text
name-a.ns.cloudflare.com
name-b.ns.cloudflare.com
```

At the domain registrar where `humanexe.ai` was purchased:

1. Open DNS or nameserver settings.
2. Replace existing nameservers with the two Cloudflare nameservers.
3. Save changes.
4. Return to Cloudflare and select **Check nameservers**.

Propagation can take minutes, but may take up to 24 hours depending on the registrar and DNS cache.

## Step 3: Add The Apex Custom Domain In Pages

In Cloudflare:

1. Go to **Workers & Pages**.
2. Open the `humanexe-ai` Pages project.
3. Go to **Custom domains**.
4. Select **Set up a domain**.
5. Enter:

```text
humanexe.ai
```

6. Confirm Cloudflare's DNS record creation.

Expected DNS record:

```text
Type: CNAME
Name: humanexe.ai or @
Target: humanexe-ai.pages.dev
Proxy status: Proxied
```

Cloudflare may display the apex as `@`.

## Step 4: Add The WWW Custom Domain

In the same Pages project:

1. Go to **Custom domains**.
2. Select **Set up a domain**.
3. Enter:

```text
www.humanexe.ai
```

4. Confirm Cloudflare's DNS record creation.

Expected DNS record:

```text
Type: CNAME
Name: www
Target: humanexe-ai.pages.dev
Proxy status: Proxied
```

## Step 5: Choose Canonical Domain

Recommended:

```text
Canonical: https://humanexe.ai
Redirect: https://www.humanexe.ai/* -> https://humanexe.ai/$1
```

Set this with Cloudflare Bulk Redirects or Redirect Rules.

## Step 6: DNS Verification Commands

Run:

```bash
nslookup humanexe.ai
nslookup www.humanexe.ai
```

Then check HTTP headers:

```bash
curl -I https://humanexe.ai
curl -I https://www.humanexe.ai
```

Expected:

```text
humanexe.ai returns 200
www.humanexe.ai returns 301/308 to humanexe.ai or returns 200 if intentionally not redirected
```

## Common DNS Issues

- Domain stuck pending: nameservers may not point to Cloudflare yet.
- CNAME not found: custom domain was not added through the Pages project first.
- 522 or routing error: DNS record exists but Pages custom domain is not active.
- SSL pending: wait for certificate issuance, then check CAA records if it remains blocked.
- Wrong repo/site showing: another Pages project or old repo is still connected to the same domain.

## Official References

- Cloudflare Pages custom domains: `https://developers.cloudflare.com/pages/configuration/custom-domains/`
- Redirecting www to apex: `https://developers.cloudflare.com/pages/how-to/www-redirect/`

