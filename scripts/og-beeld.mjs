// Maakt het deelbeeld (Open Graph, 1200×630) uit de foto van Pauline + het strategyC-logo.
// Gebruik: node scripts/og-beeld.mjs <bronfoto> → public/img/og-strategyc.jpg
// Vereist Barlow als systeemlettertype bij het renderen (zie README).
import sharp from "sharp";
import { readFileSync } from "node:fs";

const W = 1200, H = 630, FOTO = 630;
const bron = process.argv[2] ?? "public/img/pauline-kamphuis.jpg";

// Logo: exact de paden uit src/components/Logo.astro (viewBox 18.8 34.3 559 88), in wit.
const logoSrc = readFileSync("src/components/Logo.astro", "utf8");
const logoInner = logoSrc.slice(logoSrc.indexOf("<path"), logoSrc.lastIndexOf("</svg>")).replaceAll("currentColor", "#fcfcfc");
const logoH = 46, logoW = Math.round((559 / 88) * logoH);

const foto = await sharp(bron).resize(FOTO, FOTO, { fit: "cover", position: "top" }).toBuffer();

const laag = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="vervaag" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#090909" stop-opacity="1"/>
      <stop offset=".42" stop-color="#090909" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="${W - FOTO}" y="0" width="${FOTO}" height="${H}" fill="url(#vervaag)"/>
  <svg x="72" y="72" width="${logoW}" height="${logoH}" viewBox="18.8 34.3 559 88">${logoInner}</svg>
  <g font-family="Barlow" fill="#fcfcfc">
    <text x="72" y="300" font-size="68" font-weight="700" letter-spacing="-2">Strategie en creatie</text>
    <text x="72" y="378" font-size="68" font-weight="700" letter-spacing="-2">voor <tspan fill="#db4545">coalities</tspan></text>
    <text x="74" y="448" font-size="28" font-weight="400" fill="#d6d6d6">Strategisch en creatief advies</text>
    <text x="74" y="486" font-size="28" font-weight="400" fill="#d6d6d6">door Pauline Kamphuis</text>
    <text x="74" y="566" font-size="24" font-weight="600" fill="#db4545" letter-spacing="1">strategyc.nl</text>
  </g>
</svg>`;

await sharp({ create: { width: W, height: H, channels: 3, background: "#090909" } })
  .composite([{ input: foto, left: W - FOTO, top: 0 }, { input: Buffer.from(laag), left: 0, top: 0 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile("public/img/og-strategyc.jpg");
console.log("public/img/og-strategyc.jpg");
