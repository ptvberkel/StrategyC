// Na `astro build`:
//  - sitemap.xml op de root
//  - productie (Cloudflare Pages): _redirects met echte 301's uit src/data/redirects.ts (stub-pagina's eruit),
//    _headers met beveiligings- en cacheheaders, noindex op *.pages.dev
//  - PREVIEW=1: geen CNAME, robots.txt dicht, noindex (via Base.astro)
//  - PREVIEW_BASE=/StrategyC: testversie als *project site* (https://ptvberkel.github.io/StrategyC/):
//    alle absolute paden (/fonts/, /js/, /portfolio/ …) krijgen het basispad ervoor; redirect-stubs wijzen binnen de preview.
//    De productiecode blijft zonder basispad (de echte site staat op de root van strategyc.nl).
import { copyFileSync, writeFileSync, existsSync, rmSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const preview = process.env.PREVIEW === "1";
const base = (process.env.PREVIEW_BASE || "").replace(/\/$/, ""); // bv. "/StrategyC"
const previewOrigin = process.env.PREVIEW_SITE || "https://ptvberkel.github.io";
const dist = "dist";

if (existsSync(`${dist}/sitemap-0.xml`)) copyFileSync(`${dist}/sitemap-0.xml`, `${dist}/sitemap.xml`);

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

if (preview) {
  if (existsSync(`${dist}/CNAME`)) rmSync(`${dist}/CNAME`);
  writeFileSync(`${dist}/robots.txt`, "# Testomgeving — niet indexeren\nUser-agent: *\nDisallow: /\n");
  if (base) {
    let n = 0;
    for (const p of walk(dist)) {
      if (p.endsWith(".html")) {
        let s = readFileSync(p, "utf8");
        // interne absolute paden → met basispad (niet // en niet al met basispad)
        s = s.replace(/\b(href|src|action)="\/(?!\/)/g, `$1="${base}/`);
        // redirect-stubs: binnen de preview blijven
        if (s.includes('http-equiv="refresh"')) s = s.replaceAll("https://strategyc.nl/", `${previewOrigin}${base}/`);
        writeFileSync(p, s); n++;
      } else if (p.endsWith(".css")) {
        writeFileSync(p, readFileSync(p, "utf8").replace(/url\((["']?)\/(?!\/)/g, `url($1${base}/`)); n++;
      } else if (p.endsWith(".js")) {
        // filter.js schrijft ?c= naar de huidige URL — pad-onafhankelijk; niets te doen
      }
    }
    console.log(`postbuild: PREVIEW op ${previewOrigin}${base}/ — basispad in ${n} bestanden, geen CNAME, robots dicht, noindex`);
  } else {
    console.log("postbuild: PREVIEW — geen CNAME, robots.txt dicht, noindex op elke pagina");
  }
} else {
  // --- Redirects: echte 301's (Cloudflare Pages leest dist/_redirects) ---
  const bron = readFileSync("src/data/redirects.ts", "utf8");
  const regels = [...bron.matchAll(/\{\s*oud:\s*"([^"]+)",\s*nieuw:\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]);
  if (!regels.length) throw new Error("postbuild: geen redirects gevonden in src/data/redirects.ts");
  const lijnen = [];
  for (const [oud, nieuw] of regels) {
    const zonder = oud.replace(/\/$/, "");
    lijnen.push(`${oud} ${nieuw} 301`);
    if (zonder && zonder !== oud) lijnen.push(`${zonder} ${nieuw} 301`);
    // stub-pagina weghalen: anders kan het statische bestand de redirect in de weg zitten
    const stub = join(dist, oud.replace(/^\//, ""));
    if (existsSync(join(stub, "index.html"))) rmSync(join(stub, "index.html"));
  }
  // lege stub-mappen opruimen
  for (const [oud] of regels) {
    let d = join(dist, oud.replace(/^\/|\/$/g, ""));
    while (d !== dist && existsSync(d) && readdirSync(d).length === 0) { rmSync(d, { recursive: true }); d = join(d, ".."); }
  }
  writeFileSync(`${dist}/_redirects`, `# Gegenereerd door scripts/postbuild.mjs uit src/data/redirects.ts — niet met de hand wijzigen\n${lijnen.join("\n")}\n`);

  // --- Headers (Cloudflare Pages leest dist/_headers). CSP staat als meta in Base.astro; frame-ancestors kan alleen als header. ---
  writeFileSync(`${dist}/_headers`, `# Gegenereerd door scripts/postbuild.mjs
/*
  Strict-Transport-Security: max-age=31536000
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  X-Frame-Options: DENY
  Content-Security-Policy: frame-ancestors 'none'

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=2592000

https://:project.pages.dev/*
  X-Robots-Tag: noindex
`);
  if (existsSync(`${dist}/CNAME`)) rmSync(`${dist}/CNAME`);
  console.log(`postbuild: productie (Cloudflare Pages) — ${lijnen.length} redirects in _redirects, _headers, sitemap.xml`);
}
