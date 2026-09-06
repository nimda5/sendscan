# SendScan — TZ: "Intro + Coming Soon" landing page (v1)

Reference: see [01-problem-and-solution.md](01-problem-and-solution.md) for the product problem/solution/pricing this page communicates.

## 1. Decisions locked in for this build

- **Name/brand:** SendScan. Candidate domain: `sendscan.me` (availability to be confirmed later — not blocking this build; all URLs in code are placeholders using this domain and easy to find/replace).
- **Languages:** EN + LV, both live at launch, with a visible language switcher. Implemented as two real static pages (`/` = EN, `/lv/` = LV) rather than a JS-only toggle, so both language versions are independently crawlable/indexable (see SEO section) — not just a cosmetic switch.
- **Pricing shown:** €10/year per printer/scanner. First year free for anyone who signs up on this page pre-launch.
- **Signup form:** placeholder only for this version. No backend/domain/email service wired up yet. On submit, the form validates the email client-side and shows a "thanks, we'll be in touch" confirmation state — it does not transmit anywhere yet. Wiring it to a real capture mechanism (Formspree or similar, per earlier discussion) is a follow-up task once we're ready to go live.
- **Design language:** visually modeled on inbox.eu (same market, same audience, already-legible brand direction) — see design tokens below, extracted from their live site.
- **Tech approach:** plain static HTML/CSS/vanilla JS, no framework, no build step. Reasons: (a) fastest possible load and simplest for crawlers/AI agents to parse — no client-side rendering required for content to exist in the HTML; (b) trivial to deploy anywhere (Netlify/Vercel/static hosting/S3) once a domain is chosen; (c) this is a single intro page, a framework would be pure overhead.

## 2. Design tokens (extracted from inbox.eu)

| Token | Value | Notes |
|---|---|---|
| `--color-primary` | `#0066ff` | Primary buttons, links, active states |
| `--color-primary-tint` | `#f2f7ff` | Section backgrounds, subtle highlight |
| `--color-primary-tint-2` | `#c5dcff` | Secondary highlight/badge backgrounds |
| `--color-text` | `#171719` | Headings, body text |
| `--color-text-muted` | `#5b6472` | Secondary/supporting text |
| `--color-bg` | `#ffffff` | Page background |
| `--color-border` | `#ebebeb` | Dividers, card borders |
| `--radius` | `8px` | Buttons, cards, inputs |
| `--font-family` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Loaded via Google Fonts (Inter) |

Button styles: filled primary (`--color-primary` bg, white text) for main CTA; outline/ghost secondary (white bg, primary-colored border+text) for secondary actions — mirrors inbox.eu's own button pairing.

Dark mode: supported via `prefers-color-scheme`, since this is a real site (not a one-off artifact) and it costs little to add.

## 3. Page structure (both language versions, same layout)

1. **Header:** wordmark "SendScan", language switcher (EN/LV), single CTA button ("Get first year free" → scrolls to signup form).
2. **Hero:** headline + one-sentence explanation of what SendScan is, signup form (email field + submit), "first year free" badge, no image required for v1 (illustration/screenshot is a nice-to-have follow-up, not blocking).
3. **Problem section:** 3–4 condensed pain-point cards drawn from the user stories doc (the family/household one, the office-admin one, the wrong-scanner-even-with-an-app one, the "you already own this feature" framing).
4. **How it works:** the 4-step flow — user photographs the printer → SendScan detects the model, generates the full SMTP config, and creates a dedicated email address for it (with a generic-config fallback if detection isn't confident) → user does the one-time entry at the printer → scans land in your inbox automatically, plus the day-to-day usage line (press scan, pick the address, done).
5. **Pricing teaser:** €10/year per printer, first year free for pre-launch signups; one line only, full pricing page is out of scope for v1.
6. **FAQ:** written in plain, direct Q&A form (see SEO/AI section — this is the section most likely to be quoted verbatim by AI answer engines), covering: what is SendScan, how does setup work, which printers are supported, is my data private, how much does it cost, when does it launch.
7. **Footer:** wordmark, language switcher, copyright, placeholder contact mention (no real support channel yet).

## 4. SEO requirements ("full SEO compatible")

- Semantic HTML (proper `<header>/<main>/<section>/<footer>`, one `<h1>` per page, logical heading hierarchy).
- `<title>` and `<meta name="description">` per language, tailored (not machine-translated filler).
- `rel="canonical"` on each page pointing to itself.
- `hreflang` alternate links between `/` (en) and `/lv/` (lv), plus an `x-default` pointing at `/`.
- Open Graph + Twitter Card meta tags (title, description, url, locale) per language. No `og:image` yet — placeholder note left in code; add once a real graphic exists.
- `robots.txt` allowing all crawlers, pointing at `sitemap.xml`.
- `sitemap.xml` listing both language URLs.
- Fast static load, no render-blocking heavy JS, no client-side-only content.

## 5. AI-answer-engine optimization ("GEO", so AI assistants surface SendScan)

- **`llms.txt`** at the site root: a short, plain-language machine-readable summary of what SendScan is, who it's for, and how it works — the emerging convention several AI crawlers already check.
- **Structured data (JSON-LD):** `Organization` + `WebSite` + `FAQPage` schema, matching the visible FAQ section content exactly (schema must not contradict on-page text).
- **FAQ section written for extraction:** short, self-contained, factual Q&A pairs (one clear claim per answer) — the format AI answer engines most reliably quote or summarize.
- **Plain factual "what is X" sentence early in the page**, outside of any JS-dependent element, so it's the first thing both search crawlers and AI crawlers see.

## 6. File structure

```
site/
  index.html          (EN — canonical root)
  lv/
    index.html        (LV)
  assets/
    styles.css
    script.js
  favicon.svg
  robots.txt
  sitemap.xml
  llms.txt
```

## 7. Hosting requirements

All internal links (CSS, JS, favicon, EN/LV navigation) use relative paths, not root-relative (`/...`) ones. This means:

- The site works by simply double-clicking `index.html` — no local server needed to preview it.
- It works unmodified on **any** static host: Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3+CloudFront, or a plain Apache/Nginx box. Just upload the contents of `site/` to the host's document root — nothing to configure beyond that.
- The only real requirement from the host: serving `lv/index.html` when someone requests the `/lv/` path (i.e. resolving a directory URL to its `index.html`). Every static host listed above does this automatically; it's the default behavior, not a special setting.
- The only things that stay hard-coded to `sendscan.me` are the SEO/meta bits that are *supposed* to be absolute (canonical, hreflang, Open Graph, JSON-LD, sitemap.xml, robots.txt, llms.txt) — these need a find-and-replace once the real domain is confirmed, but they don't affect whether the page loads or looks right in the meantime.

## 8. Explicitly out of scope for this version

- Real backend for the signup form (placeholder only, per decision above).
- Real domain/hosting setup (decided to defer).
- Printer-model AI detection, dashboard, account system, actual SMTP provisioning — this is a pre-launch marketing page only.
- Illustrations/product screenshots — text-and-layout only for v1.
