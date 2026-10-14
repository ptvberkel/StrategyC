// Maakt het deelbeeld (Open Graph, 1200×630): strategyC-logo, tagline en de rode C-cirkels uit de hero.
// Gebruik: node scripts/og-beeld.mjs → public/img/og-strategyc.jpg
// Vereist Barlow als systeemlettertype bij het renderen.
import sharp from "sharp";
import { readFileSync } from "node:fs";

const W = 1200, H = 630;

// Logo: exact de paden uit src/components/Logo.astro (viewBox 18.8 34.3 559 88), in wit.
const logoSrc = readFileSync("src/components/Logo.astro", "utf8");
const logoInner = logoSrc.slice(logoSrc.indexOf("<path"), logoSrc.lastIndexOf("</svg>")).replaceAll("currentColor", "#fcfcfc");
const logoH = 46, logoW = Math.round((559 / 88) * logoH);

// Cirkels zoals in de hero (radiale gradiënt D1), liggend op de onderrand rechts.
// Ballen raken elkaar en de vloer (geen overlap): afstand middelpunten = r1 + r2.
const stralen = [124, 84, 62];
let cx = W - 112;
const cirkels = stralen.map((r, i) => {
  if (i > 0) { const R = stralen[i - 1]; cx -= Math.sqrt((R + r) ** 2 - (R - r) ** 2); }
  return `<circle cx="${cx.toFixed(1)}" cy="${H - r}" r="${r}" fill="url(#bal)"/>`;
}).join("");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="bal" cx=".35" cy=".3" r=".75">
      <stop offset="0" stop-color="#ea746a"/><stop offset=".55" stop-color="#db4545"/><stop offset="1" stop-color="#b8473e"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#090909"/>
  ${cirkels}
  <svg x="72" y="72" width="${logoW}" height="${logoH}" viewBox="18.8 34.3 559 88">${logoInner}</svg>
  <g font-family="Barlow" fill="#fcfcfc">
    <text x="72" y="300" font-size="76" font-weight="700" letter-spacing="-2">Strategie en creatie</text>
    <text x="72" y="384" font-size="76" font-weight="700" letter-spacing="-2">voor <tspan fill="#db4545">coalities</tspan></text>
    <text x="74" y="456" font-size="28" font-weight="400" fill="#d6d6d6">Strategisch en creatief advies door Pauline Kamphuis</text>
    <text x="74" y="566" font-size="24" font-weight="600" fill="#db4545" letter-spacing="1">strategyc.nl</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile("public/img/og-strategyc.jpg");
console.log("public/img/og-strategyc.jpg");
