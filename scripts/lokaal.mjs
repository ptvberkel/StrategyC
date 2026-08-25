// Na `npm run build`: maakt van dist/ een zelfstandige controleversie in dist-lokaal/ die rechtstreeks
// vanaf schijf (file://) opent — voor visuele controle zonder webserver. Niet voor publicatie.
//  - CSS, lettertypes (data-URI) en scripts inline; geen CSP-meta en geen preload (werken niet onder file://)
//  - alle interne paden relatief, mappen krijgen expliciet index.html (file:// kent geen mapindex)
//  - de rest (beelden, favicon, robots, sitemap) wordt 1-op-1 gekopieerd
// Gebruik: node scripts/lokaal.mjs   (of: npm run build:lokaal)
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, existsSync } from "node:fs";
import { join, dirname, relative, extname } from "node:path";

const dist = "dist", uit = "dist-lokaal";
if (!existsSync(dist)) { console.error("Geen dist/ — draai eerst `npm run build`."); process.exit(1); }
rmSync(uit, { recursive: true, force: true });

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) { const p = join(dir, f); statSync(p).isDirectory() ? walk(p, out) : out.push(p); }
  return out;
}
const cssCache = new Map();
function cssInline(pad) {
  if (!cssCache.has(pad)) {
    let css = readFileSync(join(dist, pad), "utf8");
    css = css.replace(/url\((["']?)\/fonts\/([^"')]+)\1\)/g, (_, q, f) => {
      const b64 = readFileSync(join(dist, "fonts", f)).toString("base64");
      return `url("data:font/woff2;base64,${b64}")`;
    });
    cssCache.set(pad, css);
  }
  return cssCache.get(pad);
}
// interne absolute URL → relatief t.o.v. de pagina, met index.html voor mappen
function relatief(url, prefix) {
  const m = url.match(/^\/([^?#]*)(.*)$/); // pad + (query/fragment)
  if (!m) return url;
  let pad = m[1], rest = m[2];
  if (pad === "" || pad.endsWith("/")) pad += "index.html";
  else if (!extname(pad)) pad += "/index.html";
  return prefix + pad + rest;
}
let n = 0;
for (const p of walk(dist)) {
  const rel = relative(dist, p), doel = join(uit, rel);
  if (rel.startsWith("_astro")) continue; // CSS gaat inline
  mkdirSync(dirname(doel), { recursive: true });
  if (!p.endsWith(".html")) { copyFileSync(p, doel); continue; }
  const diepte = rel.split(/[\\/]/).length - 1;
  const prefix = diepte === 0 ? "./" : "../".repeat(diepte);
  let s = readFileSync(p, "utf8");
  s = s.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/g, "");
  s = s.replace(/<link rel="preload"[^>]*>/g, "");
  s = s.replace(/<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)">/g, (_, pad) => `<style>${cssInline(pad)}</style>`);
  s = s.replace(/<script src="\/js\/([^"]+)" defer><\/script>/g, (_, f) => {
    let js = readFileSync(join(dist, "js", f), "utf8");
    if (f === "cirkels.js") js = js.replaceAll('"portfolio/"', '"portfolio/index.html"').replaceAll('"portfolio/?c="', '"portfolio/index.html?c="');
    return `<script defer>${js}</script>`;
  });
  s = s.replace(/\b(href|src|action)="\/(?!\/)([^"]*)"/g, (_, attr, u) => `${attr}="${relatief("/" + u, prefix)}"`);
  // redirect-stubs: naar het lokale doel i.p.v. het live domein
  if (s.includes('http-equiv="refresh"')) s = s.replace(/url=https:\/\/strategyc\.nl\/([^"]*)/g, (_, u) => `url=${relatief("/" + u, prefix)}`);
  writeFileSync(doel, s); n++;
}
console.log(`lokaal: ${n} pagina's zelfstandig in ${uit}/ — open ${uit}/index.html vanaf schijf`);
