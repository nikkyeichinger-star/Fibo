# Fibo — Conceptdocument

*Werkdocument, versie 0.1 — we scherpen dit samen aan terwijl de app groeit.*

## Het probleem

Mensen met AuDHD (autisme + ADHD) lopen dagelijks vast op executieve functies: taken starten (ADHD-verlamming), plannen, tijd voelen, energie doseren en prioriteiten kiezen. Bestaande productiviteitsapps zijn gebouwd voor neurotypische breinen: ze straffen (rode achterstallige taken, gebroken streaks), overweldigen (te veel lijsten en knoppen) en vervelen (afvinken geeft geen dopamine).

En het grootste probleem: **app-moeheid**. Veel AuDHD'ers gebruiken nu 4–5 losse apps naast elkaar — Goblin.tools voor het opknippen van taken, Tiimo voor visuele planning, Finch voor gewoontes, Daylio voor stemming. Elke app heeft z'n eigen login, eigen logica, eigen notificaties. Het beheren van je hulpmiddelen is zélf een executieve belasting geworden.

## De kans

Eén geïntegreerde hub die gedachtenopslag (brain dump), taken opknippen, zachte planning en energie-tracking naadloos samenbrengt. Niet vijf apps die elk 20% doen, maar één plek die het hele plaatje ziet: *"Je energie is vandaag laag én je hebt drie dingen gedumpt — zal ik er ééntje piepklein maken?"*

De integratie is de magie: losse tools weten niets van elkaar; Fibo kan verbanden leggen die geen enkele losse app kan leggen.

## De kernspanning (en ons antwoord)

**All-in-one apps worden zelf snel overweldigend** — precies de val waar we níet in mogen trappen. Daarom is het eerste ontwerpprincipe van Fibo:

> **Alles in huis, maar je ziet alleen wat je nú nodig hebt.**

Fibo opent nooit met een dashboard vol modules. Fibo opent met één vraag of één stapje. De rest zit erachter, vindbaar wanneer jij het zoekt — nooit opdringerig.

## De naam

Fibo, naar Fibonacci: 1, 1, 2, 3, 5, 8... Kleine stapjes die op elkaar voortbouwen tot iets groots. Zo werkt de app, en zo bouwen we hem ook.

## De modules

1. **De Ontdooier** *(gebouwd)* — tegen ADHD-verlamming. Brain dump je taak of chaos → Fibo knipt het in mini-stapjes → je ziet er één tegelijk → klaar = zichtbare beloning.
2. **Zachte planner** — plannen op energie in plaats van tijd. Wat kan vandaag, gegeven hoe je je voelt? Niets afgekregen is geen falen maar data.
3. **Leren & focus** — focus-sessies in chunks, afgestemd op wisselende concentratie, met ingebouwde pauzes.
4. **Energie & stemming** — lichte tracking die de andere modules slimmer maakt, nooit een verplicht dagboek.

## Feature-backlog (Nikky's brain dump, aug 2026)

**Kernfeatures — de volgende bouwdoelen:**

- 🎙️ **Spraak Brain Dump** — één grote knop, inspreken wat er in je hoofd zit. AI haalt ruis weg en sorteert automatisch in taken / herinneringen / losse gedachten. *Waarom: typen kost executieve energie.* (Spraak kan gratis via de browser; het AI-sorteren heeft de Claude API nodig.)
- 🐢 **Paralysis Mode** — noodknop voor freeze/overprikkeling: scherm wordt direct prikkelarm (bijna monochroom), alle lijsten verdwijnen, Fibo stelt precies één micro-stapje voor ("haal 1 glas water", "zit 1 minuut rustig").
- 🔋 **Energy Check-In (spoon theory)** — ✅ gebouwd: dagelijkse batterijvraag ("No idea" telt veilig als Low), herkalibratie via header-badge, aangepaste teksten en thema per niveau, en op Low-dagen max 2 actieve stapjes — de rest parkeert automatisch in de kluis met een zacht briefje. *Nog open: "bring them back"-knop, en kluis-onderscheid tussen gedachten en geparkeerde stapjes.*
- ⚖️ **Taakzwaarte-meter** — per taak aangeven (of laten inschatten) hoe zwaar hij is, zodat de energy check-in weet wat hij moet verbergen.
- 🛡️ **No-Shame Routines** — simpele ochtend-/avondroutines. Geen streaks, geen "je loopt achter". Na 3 weken weg: "Fijn dat je er weer bent. Waar zullen we rustig mee beginnen?"
- 📅 **Zachte planner** — zie module 2.
- 🙂 **Dagelijkse/wekelijkse moodcheck** — lichte stemmingstracking, voedt de andere modules.

**Paralysis Mode-uitbreidingen (na de basisversie):**

- 📥 **Dump & Hide** — "parkeer je hoofd": alles inspreken/typen wat stresst; het schildpadje bergt het zichtbaar op in een kluisje. "Ik bewaar dit veilig. Je hoeft er even niet aan te denken." *Prioriteit 1.*
- 🔊 **Sensorische audio** — 1-tap brown noise / regen / zachte lofi, direct in het paralysis-scherm. Brown noise kan gratis gegenereerd worden via de Web Audio API. *Prioriteit 2.*
- 🐢 **Body Doubling Light** — het schildpadje "doet mee" met een subtiele animatie tijdens een micro-stapje: je doet het niet alleen. *Prioriteit 3.*
- 🎲 **Decide for Me** — anti-keuzestress: Fibo kiest één taak o.b.v. tijd + energie; gebruiker klikt alleen "ja" of "andere". Hoort in de gewone modus; heeft Energy Check-In nodig.
- 🆘 **Noodcontact** — klein veilig knopje dat WhatsApp/berichten opent met een vooraf ingesteld lief berichtje aan een vertrouwenspersoon, al ingevuld.
- ⚠️ **Ontwerpregel:** het paralysis-scherm blijft het léégste scherm van de app: één micro-stapje, één geluidsknopje, hooguit één stil deurtje naar meer. Nooit een dashboard.

**Advanced — voor daarna:**

- 🔀 **Shuffle Routines** — structuur blijft (autisme), kleine speelse variatie per dag (ADHD-dopamine): "poets je tanden vandaag met je andere hand".
- ⏳ **Soft Transition Warnings** — zachte seintjes 15 en 5 min vóór een taakwissel, om rustig uit hyperfocus te komen.
- 🎧 **Body Doubling Timer / Single Task Focus** — één kalme timer met visuele afteller en rustgevende geluiden (bruine ruis, regen).

## Ontwerpprincipes

1. **Eén ding tegelijk.** Het scherm toont nooit meer dan je huidige stapje aankan.
2. **Geen schuld, ooit.** Geen rode kleuren voor "te laat", geen gebroken streaks, geen "je bent 4 dagen niet geweest". Terugkomen wordt gevierd, niet bestraft.
3. **Frictie ≈ nul.** Elke handeling (dumpen, starten, afvinken) kost maximaal twee tikken. De app die je helpt mag zelf geen energie kosten.
4. **Dopamine is een feature.** Afronden moet vóélen: animaties, voortgang die groeit, kleine verrassingen.
5. **Vergeten mag.** Fibo gaat ervan uit dat je hem soms weken vergeet — en is daar nooit chagrijnig over.
6. **Prikkelarm.** Rustige kleuren, geen drukte, geen notificatie-spam.

## Doelgroep & route

Eerst Nikky (eigen ervaring = ontwerpkompas), dan vrienden als testgroep, daarna mogelijk de bredere AuDHD-community. Elke stap valideert de volgende.

## Concurrentie in één oogopslag

| App | Doet | Mist |
|---|---|---|
| Goblin.tools | Taken opknippen (AI) | Planning, energie, samenhang |
| Tiimo | Visuele planning | Brain dump, taken opknippen |
| Finch | Gewoontes + zelfzorg (gamified) | Echte taken/planning |
| Daylio | Stemming tracken | Alles wat met doen te maken heeft |

Fibo's positie: **de integratie** — niet elke feature beter, maar het geheel verbonden.

## Identiteit

- **Mascotte/logo:** Fibo het schildpadje 🐢 — vriendelijk, schuldgevoel-vrij, rustig tempo. Bladvormen in het logo verwijzen naar de Fibonacci-reeks. Zie `Fibo Logo Brand Guide.pdf` en `logo.svg`.
- **Toon:** zacht met een knipoog (voorlopige keuze).
- **Taal:** de app is Engelstalig — internationale ambitie vanaf dag 1. (Dit conceptdocument blijft Nederlands.)
- **Kleurenpalet (uit de brand guide):** Warm Off-White `#FAF8F5` (hoofdachtergrond), Sage Teal `#528981` (primair accent & schild), Deep Forest `#2A524E` (knoppen, headers, contrast-tekst), Soft Sand `#D4A373` (warm accent & beloningen), Near-Black `#1A2E2C` (dark mode / tekst). Prikkelarm, geen felle primaire kleuren.
- **Extra ontwerpregels uit de brand guide:** border-radius 12–20px, max 3–4 zichtbare elementen per scherm, No-Shame Cycle (geen streaks of verwijten), en later een spraak-naar-tekst brain dump.

## Open vragen (samen invullen)

- Wat helpt Nikky persoonlijk het best bij verlamming (mini-stapje, body double, timer, beloning)? → bepaalt wat de Ontdooier als eerste kan.
- Hoe knipt v1 taken op: zelf typen, slimme templates, of AI (v2)?
- De kluis mengt nu twee soorten inhoud: "gedachten die stress geven" (geparkeerd vanuit paralysis mode) en "halve taken die niet pasten op een Low-dag" (geparkeerd vanuit de energy check-in). Als de kluis-lijst ooit uitgebreid wordt, is onderscheid het overwegen waard — bijv. een `type`-veld ("parked thought" vs "saved for a better day") in plaats van één ongedifferentieerde lijst.
- Fibo verplaatst nu stappen (het overschot op een Low-dag) zonder te vragen. Het geruststellende briefje maakt veel goed, maar een "bring them back"-knopje (terugzetten in de actieve taak) is het overwegen waard zodra dat relevant wordt.

## Ontwerpbeslissing: overslaan is een signaal

Overslaan = "nu even niet", nooit falen. Het stapje gaat achteraan de rij. Fibo reageert zacht: eerst een geruststellend berichtje ("prima, dit wacht wel"). Wordt hetzelfde stapje vaker overgeslagen, dan checkt Fibo vriendelijk in: is het stapje te groot? Later (v2, bij energie-tracking): een lichte "waarom lukt het nu niet"-meter die Fibo slimmer maakt.

## Roadmap

- **v1 — De Ontdooier: ✅ klaar.** Brain dump, taak → stapjes, één stapje tegelijk, skip-zonder-schuld met zachte check-in, viering bij afronden. Engelstalig, brand-palet + logo geïntegreerd.
- **v1.5 — Opslag: ✅ klaar.** localStorage met resume na refresh, opruimen na afronden, vangnet voor kapotte opslag. Nog open: dopamine-polish, "break it down"-knop.
- **v2 — Online & op de telefoon: ✅ klaar (aug 2026).** Live op GitHub Pages, installeerbaar als PWA met eigen app-icoon. Paralysis mode + Dump & Hide + Energy Check-In gebouwd.
- **Nu (deadline: start schooljaar, sept 2026):** "break it down"-knop en spraak-knop, daarna dagelijks zelf testen op school. Feedback stuurt de rest.
- **Later:** AI-taakopknipper (Claude API), zachte planner, routines, accounts + versie voor vrienden, leren & focus-module.
