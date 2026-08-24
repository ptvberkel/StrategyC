// Na `astro build`:
//  - sitemap.xml op de root
//  - productie: CNAME strategyc.nl
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
  writeFileSync(`${dist}/CNAME`, "strategyc.nl\n");
  console.log("postbuild: productie — CNAME strategyc.nl, sitemap.xml");
}
