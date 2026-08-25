// Lokale testbouw zoals GitHub Actions die maakt (deploy.yml): PREVIEW=1, projectpad /StrategyC, noindex, robots dicht.
// Werkt op Windows én macOS/Linux (geen shell-afhankelijke VAR=… syntaxis).
// Gebruik: npm run build:preview
import { spawnSync } from "node:child_process";
const env = { ...process.env, PREVIEW: "1", PREVIEW_BASE: "/StrategyC", PREVIEW_SITE: "https://www.huurofkoopcheck.nl" };
for (const [cmd, args] of [["npx", ["astro", "build"]], ["node", ["scripts/postbuild.mjs"]]]) {
  const r = spawnSync(cmd, args, { stdio: "inherit", env, shell: process.platform === "win32" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
