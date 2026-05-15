# Cultuursausje — agenda.cultuursausje.nl

Next.js-app voor de theateragenda. Leest data uit lokale TypeScript-bestanden óf — als de env vars gevuld zijn — uit Google Sheets (publish-to-web CSV).

## Eerste keer: deployen naar agenda.cultuursausje.nl

Dit is de stappenroute die je één keer doorloopt. Het kost ongeveer een kwartier. Je hebt **niets** lokaal nodig — alles gaat via je browser. Wel handig: één tabblad voor GitHub, één voor Vercel, één voor je Squarespace-DNS.

### 1. Maak een GitHub-account (gratis)

Ga naar [github.com](https://github.com) en maak een account aan. Bevestig je e-mail.

### 2. Maak een nieuwe repository

In GitHub: klik rechtsboven op **+ → New repository**. Naam bv. `cultuursausje`. Laat **Public** geselecteerd (gratis Vercel werkt het soepelst met public). **Niet** een README, gitignore of license aanvinken — die zitten er al in. Klik **Create repository**.

### 3. Upload de site-folder

Op je nieuwe (lege) repo-pagina staat: *"or, upload existing files"* (zoek deze link, hij staat in het midden van de pagina onder de quick-start tips). Klik die aan.

Sleep nu alle bestanden uit je `Theater/site/` map naar het GitHub-venster (selecteer **alles** in `site/` — `app`, `components`, `data`, `lib`, `types`, `.env.example`, `.gitignore`, `next.config.mjs`, `package.json`, `postcss.config.js`, `README.md`, `tailwind.config.ts`, `tsconfig.json`). Zorg dat je niet ook `node_modules` of `.next` upload (die staan in `.gitignore` maar als je ze niet hebt is dat helemaal prima).

Onderaan: laat de commit message zoals 'ie staat en klik **Commit changes**.

### 4. Maak een Vercel-account (gratis)

Ga naar [vercel.com](https://vercel.com), klik **Sign Up**, kies **Continue with GitHub**. Geef Vercel toegang tot je GitHub.

### 5. Importeer je repo

In Vercel kom je op een dashboard. Klik **Add New → Project**, vind je `cultuursausje`-repo in de lijst en klik **Import**.

Vercel detecteert vanzelf dat het een Next.js-app is. Laat alle instellingen op default. Klik **Deploy**.

Even wachten (1–2 minuten). Als 'ie groen wordt heb je een live URL zoals `cultuursausje-abc123.vercel.app`. Klik 'm aan — dat is je site.

### 6. Koppel het domein

In de Vercel-projectpagina: klik **Settings** (boven) → **Domains** (links). Vul in: `agenda.cultuursausje.nl` → **Add**.

Vercel laat een instructie zien, ongeveer:

> Add a CNAME record for `agenda` pointing to `cname.vercel-dns.com`.

### 7. Voeg de CNAME toe in Squarespace

Log in op Squarespace. Ga naar **Settings → Domains → cultuursausje.nl → DNS Settings** (of vergelijkbaar — Squarespace's UI verandert af en toe).

Voeg een nieuw record toe:

- **Type**: CNAME
- **Host** (of "name"): `agenda`
- **Value** (of "data"): `cname.vercel-dns.com`
- **TTL**: standaard

Bewaar. Het duurt 5–30 minuten voordat DNS overal is doorgesijpeld. Vercel verifieert het automatisch en je site is daarna bereikbaar op **https://agenda.cultuursausje.nl** met een gratis SSL-certificaat.

## Data bijwerken

Voor v1 staat de data in TypeScript-bestanden in `data/`:

- `data/shows.ts` — voorstellingen
- `data/theaters.ts` — de 13 Amsterdam-theaters
- `data/gezelschappen.ts` — de 16 gezelschappen
- `data/pers.ts` — pers-quotes
- `data/media.ts` — video- en podcast-links

Wijzigen kan via GitHub's web editor: ga naar het bestand op github.com, klik het potlood-icoon, pas aan, scroll naar onder en commit. Vercel deployt automatisch een nieuwe versie binnen 1–2 minuten.

## Later: Google Sheets als bron

Wanneer je Google Sheet klaar staat en je wilt data daar bijhouden in plaats van in `data/*.ts`:

1. In Google Sheets: **Bestand → Delen → Publiceren naar het web** → per tab (Shows, Theaters, Gezelschappen, Pers, Media) → kies formaat **CSV** → kopieer de URL.
2. In Vercel project → **Settings → Environment Variables** → voeg toe:
   - `GSHEETS_SHOWS_CSV` = de URL van het Shows-tabblad
   - `GSHEETS_THEATERS_CSV` = idem
   - `GSHEETS_GEZELSCHAPPEN_CSV` = idem
   - `GSHEETS_PERS_CSV` = idem
   - `GSHEETS_MEDIA_CSV` = idem
3. Klik **Redeploy** (in Deployments → laatste deploy → menu).

De site leest dan vanaf nu uit Sheets. Data wordt elke 10 minuten ververst (`revalidate: 600` in `lib/data.ts`).

## Lokaal draaien (optioneel)

Niet nodig voor deploy, maar als je het wil:

```bash
npm install
npm run dev
```

Vereist [Node.js](https://nodejs.org) 18+ op je computer.

## Wat er in zit

- **Filter**: alleen voorstellingen waar zowel het theater (uit `data/theaters.ts`) als het gezelschap (uit `data/gezelschappen.ts`) op de cultuursausje-lijst staat worden getoond. Voorstellingen die voorbij zijn vallen automatisch weg.
- **Maand-secties**: voorstellingen verschijnen in elke maand waarin ze spelen.
- **Card-interactie**: klik op een kaart om hem om te draaien; klik op "Meer lezen" om de volledige info te zien (op mobiel als fullscreen-overlay, op desktop als grotere kaart in de grid).
- **Favorieten**: hartje rechtsboven slaat op in browser-localStorage.
- **Animaties**: Framer Motion `layout` zorgt voor vloeiende reflow.

## Issues of vragen

Pas later. Eerst deployen, kijken hoe het eruitziet, dan zien.
