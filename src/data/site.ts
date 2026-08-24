/**
 * Sitefeiten. Alles wat leeg of met [PAULINE] gemarkeerd is, moet vóór livegang
 * worden ingevuld (structuurplan hfst. 7; document "Goedkeuringen en accounts").
 */
export const site = {
  origin: "https://strategyc.nl", // kaal domein, besloten (structuurplan §2.5)
  naam: "strategyC",
  eigenaar: "Pauline Kamphuis",
  functie: "Oprichter van strategyC, strategisch en creatief adviseur voor coalities",
  plaats: "Leiden",
  land: "NL",
  adres: "Dé Plek, Kanaalpark 157, Leiden",
  kvk: "86338501",
  btw: "", // [PAULINE: btw-identificatienummer] — wettelijk verplicht in de footer
  email: "pauline@strategyc.nl", // van de huidige site, bevestigen [PAULINE]
  telefoon: "", // [PAULINE] huidige site: +31 6 22 91 84 71 — beslispunt 7
  linkedin: "https://www.linkedin.com/in/pauline-kamphuis-a0262a/", // bevestigen [PAULINE]
  boekTitel: "In 10 stappen succesvol transformeren",
  boekJaar: "2022",
  boekLink: "", // [PAULINE: link naar verkooppagina]
  checklistTitel: "Van ambitie op papier naar maatschappelijke verandering", // [placeholder: werktitel]
  ogImage: "/img/og-strategyc.png", // [Claude Design: deelbeeld 1200×630 uit foto Pauline]

  /** Formulierendienst (structuurplan §4.6). Leeg = formulier toont een markering en post nergens heen. */
  formulierEndpoint: "", // bv. https://formulier.strategyc.workers.dev
  turnstileSiteKey: "", // uit het Cloudflare-account van Pauline
  /** Cloudflare Web Analytics-token; leeg = script niet laden. */
  analyticsToken: "",
} as const;

/** Gebruikt in JSON-LD (@id-ankers) — één Person-node, overal hetzelfde. */
export const ids = {
  website: `${site.origin}/#website`,
  organisatie: `${site.origin}/#organisatie`,
  persoon: `${site.origin}/#persoon`,
};
