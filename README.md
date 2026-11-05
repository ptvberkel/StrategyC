# strategyc.nl — website

Statische site (Astro) voor GitHub Pages. Structuur en keuzes: zie *structuurplan-strategyc-v1.md* in de projectmap.

## Werken aan de site

```
npm ci          # eenmalig
npm run dev     # lokaal bekijken op http://localhost:4321
npm run build   # bouwt naar dist/ (+ sitemap.xml)
```

## Waar staat wat

| Map / bestand | Wat |
|---|---|
| `src/data/cs.ts` | **Eén bron voor de zes C's** (filterrij, tags, schema) — nergens anders spellen |
| `src/data/site.ts` | Sitefeiten: adres, e-mail, KVK, btw-id, LinkedIn, boeklink, formulier-endpoint, Turnstile-sitekey, analytics-token |
| `src/data/redirects.ts` | Oude URL → nieuwe URL; elke regel wordt een redirect-stub |
| `src/content/cases/*.md` | Cases (frontmatter + opgave/aanpak/resultaat). `placeholder: true` = nog geen content van Pauline |
| `src/content/blog/*.md` | Blogartikelen |
| `src/layouts/Base.astro` | Head-set (canonical, OG, JSON-LD, CSP), header, footer, skip-link |
| `src/pages/` | Home, portfolio + case-sjabloon, over, contact (+ bedankpagina's), blog, 404, juridisch, `[...oud].astro` = redirect-stubs |
| `src/styles/global.css` | Tokens (palet, Barlow, rondingen), componenten |
| `public/` | Fonts (zelf gehost), favicons, `robots.txt`, scripts (`js/`), beelden (`img/`) |
| `worker/` | Formulierendienst (Cloudflare Worker + Turnstile + Resend), `wrangler.toml` |
| `.pages.yml` | Pages CMS-configuratie (beheerscherm Pauline) |
| `.github/workflows/deploy.yml` | Bouwen en publiceren naar GitHub Pages |

## Placeholders

Alles wat nog van Pauline moet komen staat zichtbaar geel gemarkeerd (`<Placeholder>`, class `ph`).
Vóór livegang: `grep -r 'class="ph' dist/` moet leeg zijn.

## Hosting: Cloudflare Pages (productie) en GitHub Pages (test)

- **Productie: Cloudflare Pages**, project `strategyc`, gekoppeld aan deze repo (branch `main`). Build `npm run build`,
  output `dist`, Node uit `.node-version`. Geen `PREVIEW`-variabelen zetten. `scripts/postbuild.mjs` maakt dan
  `_redirects` (echte 301's uit `src/data/redirects.ts`, stub-pagina's eruit) en `_headers` (HSTS, nosniff,
  frame-ancestors, cache, noindex op `*.pages.dev`). Het formulier post in productie naar de productie-Worker.
- **Test: GitHub Pages** op `https://www.huurofkoopcheck.nl/StrategyC/` via `.github/workflows/deploy.yml`
  (`PREVIEW=1`): noindex, robots dicht, redirect-stubs, formulier naar de test-Worker. Mag blijven draaien als staging.
- DNS van strategyc.nl staat (na de wissel) bij Cloudflare; het domein zelf blijft geregistreerd bij Hostnet.
  Mail van pauline@strategyc.nl loopt via Microsoft 365: MX, SPF, DMARC, autodiscover en de Microsoft-CNAME's/SRV's
  moeten in de Cloudflare-zone staan. Draaiboek: projectdocument *livegang-cloudflare.md*.

## Controles

- `python audit_site.py dist --base-url https://strategyc.nl` (website-standards skill) — 0 FAIL
- axe (WCAG 2.2 AA) op Home, portfolio, case, contact, over: geen overtredingen
- CSP: geen inline scripts; alle scripts in `public/js/`
