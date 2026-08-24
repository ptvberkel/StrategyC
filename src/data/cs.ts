/**
 * Eén bron voor de zes C's (briefing §5, §10.5).
 * Filterrij, kaarten, casepagina's, Over en het contentschema lezen allemaal hieruit.
 * Spelling nooit elders herhalen.
 */
export const C_LABELS = ["Cultuur", "Communicatie", "Change", "Coalities", "Consultancy", "Creatie"] as const;
export type CLabel = (typeof C_LABELS)[number];

/** Vast label op elke case — géén filter (briefing §5). */
export const VAST: CLabel = "Coalities";

/** Filterrij, exact in deze volgorde (webteksten v7 §2.1). "Alle" is de UI-staat, geen C. */
export const FILTERS = ["Consultancy", "Creatie", "Communicatie", "Cultuur", "Change"] as const satisfies readonly CLabel[];
export type FilterLabel = (typeof FILTERS)[number];

/** URL-waarde voor ?c= (kleine letters, geen diakrieten nodig). */
export const filterSlug = (c: FilterLabel) => c.toLowerCase();
