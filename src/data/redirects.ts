/**
 * Redirecttabel oude site → nieuwe URL's (structuurplan hoofdstuk 6).
 * Elke regel wordt een stub-pagina op het oude pad: directe meta refresh + canonical + noindex
 * (GitHub Pages kent geen server-side 301). Stubs staan niet in de sitemap.
 * Vóór livegang aanvullen met de volledige crawl en de Search Console-export (nulmeting).
 */
export type Redirect = { oud: string; nieuw: string; opmerking?: string };

export const redirects: Redirect[] = [
  // Over
  { oud: "/about/", nieuw: "/over/" },
  { oud: "/about-us/", nieuw: "/over/" },
  { oud: "/about/communication-for-culture-transformation/", nieuw: "/over/", opmerking: "voorbeeld uit briefing §9.2" },
  { oud: "/communication-for-culture-transformation/", nieuw: "/over/" },
  { oud: "/strategisch-en-creatief-advies-voor-coalities-en-organisaties-in-transitie-strategyc-cultuur-communicatie-coalitievorming-transformatie/", nieuw: "/over/" },
  { oud: "/extra/", nieuw: "/boek/", opmerking: "boek-extra's → boekpagina (14-10)" },

  // Portfolio-categorieën (NL + EN varianten)
  { oud: "/portfolio-category/publiek-private-samenwerking-coalities/", nieuw: "/portfolio/" },
  { oud: "/portfolio-category/communicatie/", nieuw: "/portfolio/?c=communicatie" },
  { oud: "/portfolio-category/communication/", nieuw: "/portfolio/?c=communicatie" },
  { oud: "/portfolio-category/consultancy/", nieuw: "/portfolio/?c=consultancy" },
  { oud: "/portfolio-category/creatie/", nieuw: "/portfolio/?c=creatie" },
  { oud: "/portfolio-category/creative/", nieuw: "/portfolio/?c=creatie" },
  { oud: "/portfolio-category/cultuur/", nieuw: "/portfolio/?c=cultuur" },
  { oud: "/portfolio-category/culture/", nieuw: "/portfolio/?c=cultuur" },
  { oud: "/portfolio-category/change/", nieuw: "/portfolio/?c=change" },
  { oud: "/portfolio-category/content/", nieuw: "/portfolio/", opmerking: "'Content' is geen C meer" },

  // Cases — bestaande case met nieuwe slug
  { oud: "/portfolio/cybersecure-energy-transition-vision-positioning/", nieuw: "/portfolio/cyberveilige-energietransitie/" },
  // Cases — BESLUIT Pauline (behouden → nieuwe slug; vervallen → /portfolio/)
  { oud: "/portfolio/10-years-of-cyber-security-summer-school/", nieuw: "/portfolio/", opmerking: "Security Delta — case volgt" },
  { oud: "/portfolio/jubileumstrategie-jubileumboek/", nieuw: "/portfolio/", opmerking: "Security Delta — case volgt" },
  { oud: "/portfolio/smart-city-innovatie/", nieuw: "/portfolio/" },
  { oud: "/portfolio/handboek-succesvol-mensgericht-transformeren/", nieuw: "/boek/" },
  { oud: "/portfolio/mensgerichte-transformatie-online-cursus/", nieuw: "/portfolio/" },
  { oud: "/portfolio/transforming-successfully-10-steps-podcast/", nieuw: "/portfolio/" },
  { oud: "/portfolio/sustainable-transformation/", nieuw: "/portfolio/" },
  { oud: "/portfolio/medewerkersparticipatie/", nieuw: "/portfolio/" },
  { oud: "/portfolio/80-20/", nieuw: "/portfolio/" },
  { oud: "/portfolio/promise-and-proof/", nieuw: "/portfolio/" },
  { oud: "/portfolio/talking-transformation/", nieuw: "/portfolio/" },
  { oud: "/portfolio/strategically-aligned/", nieuw: "/portfolio/" },

  // Blog — artikelen verhuizen naar /blog/[slug]/ (besloten); tot de keuze van Pauline → /blog/
  { oud: "/het-frisse-start-effect/", nieuw: "/blog/" },
  { oud: "/de-kracht-van-vragen-stellen/", nieuw: "/blog/" },
  { oud: "/kairos-is-koning/", nieuw: "/blog/" },
  { oud: "/build-your-own-gpt-is-a-smart-move/", nieuw: "/blog/", opmerking: "Engels — BESLUIT Pauline" },
  { oud: "/staying-curious-and-adaptable/", nieuw: "/blog/", opmerking: "Engels — BESLUIT Pauline" },
];
