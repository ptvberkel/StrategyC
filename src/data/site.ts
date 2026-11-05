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
  adres: "Dé Plek (Kamer 1011), Kanaalpark 157, 2321 JW Leiden", // v9 §4
  kvk: "86338501",
  btw: "NL004232188B50", // btw-identificatienummer (Pauline, 5-11)
  email: "pauline@strategyc.nl", // v9 §4 [PAULINE: controleren]
  telefoon: "06 22 91 84 71", // v9 §4 [PAULINE: controleren]
  linkedin: "https://www.linkedin.com/in/pauline-kamphuis-a0262a/", // v9 §4 [PAULINE: controleren]
  boekTitel: "In 10 stappen succesvol transformeren",
  boekJaar: "2022",
  boekLink: "/boek/", // eigen boekpagina met recensies en koop-/leenlinks
  boekCover: "/img/boek-in-10-stappen.png",
  boekKopen: [
    { label: "Koop het boek bij mij", url: "https://strategyc.kennis.shop/pay/boek-in-10-stappen-succesvol-transformeren", toelichting: "Rechtstreeks van de auteur" },
    { label: "Leen bij de bibliotheek", url: "https://www.bibliotheek.nl/catalogus/titel.436808625.html/in-10-stappen-succesvol-transformeren/", toelichting: "Via bibliotheek.nl" },
  ],
  portret: "/img/pauline-kamphuis.jpg",
  ogImage: "/img/og-strategyc.jpg", // deelbeeld 1200×630, gemaakt met scripts/og-beeld.mjs

  /** Formulierendienst (structuurplan §4.6). Leeg = formulier toont een markering en post nergens heen. */
  // Testbuild (PREVIEW=1, huurofkoopcheck.nl/StrategyC) → test-Worker; productiebuild (Cloudflare Pages) → productie-Worker.
  formulierEndpoint: import.meta.env.PREVIEW === "1"
    ? "https://formulier-strategyc-test.strategyc.workers.dev"
    : "https://formulier-strategyc.strategyc.workers.dev",
  turnstileSiteKey: "0x4AAAAAAEjFmU9KaGLX-1EE", // openbaar; widget "strategyC formulieren", Cloudflare-account Piet (later Pauline)
  /** Cloudflare Web Analytics-token; leeg = script niet laden. */
  analyticsToken: "", // [PIET] Cloudflare → Web Analytics → strategyc.nl; leeg laten in testbuilds is prima
} as const;

/** Gebruikt in JSON-LD (@id-ankers) — één Person-node, overal hetzelfde. */
export const ids = {
  website: `${site.origin}/#website`,
  organisatie: `${site.origin}/#organisatie`,
  persoon: `${site.origin}/#persoon`,
};
