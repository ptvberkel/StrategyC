/**
 * Formulierendienst strategyc.nl — Cloudflare Worker (structuurplan §4.6).
 * Routes: POST /contact  → notificatie aan Pauline + bevestiging (v7 §5.1)
 *         POST /checklist → bevestiging met checklist-PDF als bijlage (v7 §5.2) + korte notificatie
 * Controles: Turnstile, honeypot ("website" moet leeg zijn), invultijd ≥ 3 s, veldvalidatie.
 * Opslag: geen. Mails via Resend. Daarna 303 naar de bedankpagina.
 *
 * Geheimen (wrangler secret put): TURNSTILE_SECRET, RESEND_API_KEY
 * Variabelen (wrangler.toml [vars]): SITE, ORIGINS, NOTIFY_TO, FROM, REPLY_TO, CHECKLIST_URL
 *
 * Terugkeeradres: de bezoeker gaat terug naar de site waar het formulier vandaan kwam (Referer), mits die in ORIGINS staat —
 * zo werkt dezelfde Worker voor de testversie (www.huurofkoopcheck.nl/StrategyC) én voor strategyc.nl. Anders: SITE.
 */
const TEKST = {
  bevestigingContact: (voornaam) => ({
    onderwerp: "Ik heb je bericht ontvangen",
    tekst: `Dag ${voornaam},\n\nDank voor je bericht via strategyc.nl. Ik lees het met aandacht en neem binnen twee werkdagen contact met je op.\n\nHartelijke groet,\n\nPauline Kamphuis\nstrategyC`,
  }),
  bevestigingChecklist: (voornaam, titel) => ({
    onderwerp: "Je checklist van strategyC",
    tekst: `Dag ${voornaam},\n\nDank voor je interesse. In de bijlage vind je de checklist "${titel}".\n\nHeb je na het lezen vragen, of wil je eens sparren over jouw samenwerking? Plan gerust een vrijblijvend gesprek van 30 minuten via strategyc.nl/contact.\n\nHartelijke groet,\n\nPauline Kamphuis\nstrategyC`,
  }),
  // [UI-TEKST ter goedkeuring] notificatie aan Pauline
  notificatie: (v) => ({
    onderwerp: `Nieuw bericht via strategyc.nl van ${v.naam}`,
    tekst: `Naam: ${v.naam}\nOrganisatie: ${v.organisatie || "—"}\nE-mail: ${v.email}\n\nBericht:\n${v.bericht}\n\n(Antwoorden kan direct op deze mail.)`,
  }),
  notificatieChecklist: (v) => ({
    onderwerp: `Checklist aangevraagd via strategyc.nl door ${v.voornaam}`,
    tekst: `${v.voornaam} (${v.email}) heeft de checklist aangevraagd. De PDF is automatisch verstuurd.`,
  }),
};
const CHECKLIST_TITEL = "Van ambitie op papier naar maatschappelijke verandering"; // [placeholder: werktitel]

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const basis = terugBasis(request, env); // bv. https://strategyc.nl of https://www.huurofkoopcheck.nl/StrategyC
    const cors = corsHeaders(new URL(basis).origin);
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const form = await request.formData();
    const v = Object.fromEntries([...form.entries()].map(([k, val]) => [k, String(val).trim()]));

    // Spamcontroles
    if (v.website) return terug(basis, url.pathname); // honeypot: stil "ok" voor bots
    const gestart = Number(v.t || 0);
    if (gestart && Date.now() - gestart < 3000) return terug(basis, url.pathname);
    const ok = await turnstileOk(v["cf-turnstile-response"], request.headers.get("CF-Connecting-IP"), env);
    if (!ok) return fout(basis, url.pathname, "Controle mislukt. Probeer het nog eens.");

    const email = v.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) ? v.email : null;
    if (!email) return fout(basis, url.pathname, "Vul een geldig e-mailadres in.");

    try {
      if (url.pathname === "/contact") {
        if (!v.naam || !v.bericht) return fout(basis, url.pathname, "Dit veld is verplicht.");
        const voornaam = v.naam.split(/\s+/)[0];
        const n = TEKST.notificatie(v);
        await stuur(env, { to: env.NOTIFY_TO, reply_to: email, subject: n.onderwerp, text: n.tekst });
        const b = TEKST.bevestigingContact(voornaam);
        await stuur(env, { to: email, subject: b.onderwerp, text: b.tekst });
        return new Response(null, { status: 303, headers: { Location: `${basis}/contact/bedankt/`, ...cors } });
      }
      if (url.pathname === "/checklist") {
        if (!v.voornaam) return fout(basis, url.pathname, "Dit veld is verplicht.");
        const b = TEKST.bevestigingChecklist(v.voornaam, CHECKLIST_TITEL);
        await stuur(env, {
          to: email, subject: b.onderwerp, text: b.tekst,
          attachments: [{ path: env.CHECKLIST_URL, filename: "checklist-strategyc.pdf" }],
        });
        const n = TEKST.notificatieChecklist(v);
        await stuur(env, { to: env.NOTIFY_TO, subject: n.onderwerp, text: n.tekst });
        return new Response(null, { status: 303, headers: { Location: `${basis}/contact/checklist-onderweg/`, ...cors } });
      }
      return new Response("Not found", { status: 404 });
    } catch (e) {
      console.error(e);
      return fout(basis, url.pathname, "Er ging iets mis bij het versturen.");
    }
  },
};

async function turnstileOk(token, ip, env) {
  if (!env.TURNSTILE_SECRET) return true; // testomgeving zonder Turnstile
  if (!token) return false;
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip }),
  });
  const j = await r.json();
  return j.success === true;
}

async function stuur(env, mail) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: env.FROM, reply_to: env.REPLY_TO, ...mail }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
}

function corsHeaders(origin) {
  return { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type" };
}
/** Basis-URL om naar terug te sturen: de site van het formulier (Referer) als die is toegestaan, anders SITE. Nooit een vreemde URL. */
function terugBasis(request, env) {
  const toegestaan = String(env.ORIGINS || env.SITE).split(",").map((o) => o.trim()).filter(Boolean);
  try {
    const ref = new URL(request.headers.get("Referer") || request.headers.get("Origin") || "");
    if (toegestaan.includes(ref.origin)) return ref.origin + ref.pathname.replace(/\/contact\/.*$/, "").replace(/\/$/, "");
  } catch (e) { /* geen of ongeldige Referer */ }
  return env.SITE.replace(/\/$/, "");
}
function terug(basis, pad) {
  const doel = pad === "/checklist" ? "/contact/checklist-onderweg/" : "/contact/bedankt/";
  return new Response(null, { status: 303, headers: { Location: `${basis}${doel}` } });
}
function fout(basis, pad, bericht) {
  // Terug naar het formulier met een foutcode; de pagina toont de v7-foutmelding.
  return new Response(null, { status: 303, headers: { Location: `${basis}/contact/?fout=${encodeURIComponent(bericht)}#${pad === "/checklist" ? "checklist" : "formulier"}` } });
}
