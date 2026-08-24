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
| `public/` | Fonts (zelf gehost), favicons, `robots.txt`, `CNAME`, scripts (`js/`), beelden (`img/`) |
| `worker/` | Formulierendienst (Cloudflare Worker + Turnstile + Resend), `wrangler.toml` |
| `.pages.yml` | Pages CMS-configuratie (beheerscherm Pauline) |
| `.github/workflows/deploy.yml` | Bouwen en publiceren naar GitHub Pages |

## Placeholders

Alles wat nog van Pauline moet komen staat zichtbaar geel gemarkeerd (`<Placeholder>`, class `ph`).
Vóór livegang: `grep -r 'class="ph' dist/` moet leeg zijn.

## Controles

- `python audit_site.py dist --base-url https://strategyc.nl` (website-standards skill) — 0 FAIL
- axe (WCAG 2.2 AA) op Home, portfolio, case, contact, over: geen overtredingen
- CSP: geen inline scripts; alle scripts in `public/js/`
