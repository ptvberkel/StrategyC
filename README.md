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

## Testadres → strategyc.nl (verhuizen)

De site draait nu als test op `https://www.huurofkoopcheck.nl/StrategyC/`. De broncode kent dat adres niet: alle paden zijn
absoluut vanaf de root (`/portfolio/`, `/js/…`) en `scripts/postbuild.mjs` zet er alleen bij een testbuild `/StrategyC` voor.
Scripts (`public/js/`) rekenen relatief aan de huidige pagina. Verhuizen is daardoor alleen configuratie:

1. `.github/workflows/deploy.yml`: de drie regels `PREVIEW`, `PREVIEW_BASE`, `PREVIEW_SITE` (en de `env:`-kop) weghalen.
   De build zet dan zelf `CNAME` (strategyc.nl), opent `robots.txt` en haalt `noindex` weg.
2. GitHub → Settings → Pages: custom domain `strategyc.nl`, *Enforce HTTPS*. DNS bij Paulines registrar: A-records naar GitHub Pages + `www` als CNAME.
3. `src/data/site.ts`: `formulierEndpoint` naar de productie-Worker, `analyticsToken` invullen (zie *cloudflare-inrichting.md*).
4. Worker: `npx wrangler deploy` (productie, zonder `--env test`) + secrets; `strategyc.nl` verifiëren in Resend.
5. Controle: `grep -r 'huurofkoopcheck\|/StrategyC' dist/` moet leeg zijn, en `grep -r 'class="ph' dist/` alleen nog juridisch.

## Controles

- `python audit_site.py dist --base-url https://strategyc.nl` (website-standards skill) — 0 FAIL
- axe (WCAG 2.2 AA) op Home, portfolio, case, contact, over: geen overtredingen
- CSP: geen inline scripts; alle scripts in `public/js/`
