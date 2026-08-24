// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Kaal domein als canonieke host (structuurplan §2.5). Eén URL-vorm: map + slash (§2.5, huisregel 2).
// PREVIEW=1 → testversie op een github.io-adres (root van een user-site, dus zonder base-pad).
const preview = process.env.PREVIEW === "1";

export default defineConfig({
  site: preview ? (process.env.PREVIEW_SITE || "https://ptvberkel.github.io") : "https://strategyc.nl",
  trailingSlash: "always",
  build: { format: "directory" },
  vite: { define: { "import.meta.env.PREVIEW": JSON.stringify(process.env.PREVIEW || "0") } },
  integrations: [
    sitemap({
      // Geen bedankpagina's, geen redirect-stubs, geen 404 in de sitemap.
      filter: (page) =>
        !page.includes("/contact/bedankt/") &&
        !page.includes("/contact/checklist-onderweg/") &&
        !page.includes("/404") &&
        !/\/(about|about-us|communication-for-culture-transformation|extra|portfolio-category|strategisch-en-creatief)/.test(page) &&
        !/\/portfolio\/(cybersecure|10-years|jubileumstrategie|smart-city|handboek|mensgerichte|transforming|sustainable|medewerkersparticipatie|80-20|promise|talking|strategically)/.test(page) &&
        !/\/(het-frisse|de-kracht|kairos|build-your-own|staying-curious)/.test(page),
    }),
  ],
});
