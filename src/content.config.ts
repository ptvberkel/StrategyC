import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { FILTERS } from "./data/cs";

/**
 * Contentmodel (structuurplan §4.2). Tags worden gevalideerd tegen de centrale C-bron:
 * een verkeerd gespelde C laat de build falen — dat is de bedoeling (briefing §10.5).
 */
const cases = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cases" }),
  schema: z.object({
    titel: z.string(),
    ondertitel: z.string().optional(),
    klant: z.string(),
    jaar: z.string().optional(), // bv. "2024–2025"
    tags: z.array(z.enum(FILTERS)).min(1), // "Coalities" staat er altijd bij en wordt niet opgeslagen
    uitgelicht: z.boolean().default(false),
    volgorde: z.number().default(99),
    hoofdbeeld: z.string().optional(), // pad onder /img/
    hoofdbeeldAlt: z.string().optional(),
    beelden: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    externeLink: z.object({ label: z.string(), url: z.string().url() }).optional(),
    metaTitel: z.string().optional(),
    metaOmschrijving: z.string().optional(),
    gepubliceerd: z.string().optional(), // ISO-datum
    bijgewerkt: z.string().optional(), // ISO-datum
    placeholder: z.boolean().default(false), // true = nog geen content van Pauline; zichtbaar gemarkeerd
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    titel: z.string(),
    datum: z.string(),
    bijgewerkt: z.string().optional(),
    metaOmschrijving: z.string().optional(),
    beeld: z.string().optional(),
    beeldAlt: z.string().optional(),
  }),
});

export const collections = { cases, blog };
