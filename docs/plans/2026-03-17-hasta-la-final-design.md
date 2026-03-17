# Hasta La Final — Design Document

**Date:** 2026-03-17
**Status:** Approved
**Stack:** HTML/CSS/JS + Three.js + GSAP + Osmo components + Supabase (tweets only) + Vercel

---

## Vision

A single-page, bilingual (ES/EN) web experience and living tribute to Venezuela's historic 2026 World Baseball Classic run — their first-ever appearance in the WBC Final. Every pixel radiates Venezuelan pride. This is a love letter to a nation and its diaspora.

**Aesthetic:** Editorial dark. A luxury sports magazine printed at midnight — raw typographic power, Venezuelan flag colors used with restraint and intention, generous negative space, motion that feels earned. Award-winning data visualization meets raw national emotion.

---

## Design System

### Fonts (Google Fonts)
- **Display:** `Bebas Neue` — headlines, scores, big moments
- **Serif:** `Libre Baskerville` — pull quotes, italicized emotional copy
- **Body:** `Plus Jakarta Sans` — UI, labels, form fields

### Color Tokens (CSS variables on `:root`)
```css
--bg:       #07070f   /* near-black page background */
--bg2:      #0e0e1c   /* section alt background */
--bg3:      #161628   /* card / input background */
--red:      #CF142B   /* Venezuelan flag red */
--red-dim:  #8a0e1c   /* muted red for borders */
--gold:     #F4C430   /* Venezuelan flag gold/yellow */
--gold-dim: #a8881f
--blue:     #1a3a8f   /* Venezuelan flag blue */
--white:    #F5F0E8   /* warm off-white */
--muted:    #5a5870   /* secondary text */
--border:   #1e1e32   /* subtle borders */
```

### Recurring Motifs
- `ven-divider`: 3-segment bar colored red / gold / blue (the flag)
- 8 gold stars scattered in backgrounds (the 8 stars of the Venezuelan flag)
- `section-label`: tiny all-caps gold label above each section heading
- All section headings: Bebas Neue at `clamp(3rem, 8vw, 6rem)`
- Scroll-triggered animations via GSAP ScrollTrigger
- CSS Grid with `gap: 1px; background: var(--border)` for editorial hairline grids

### Venezuelan Pride Principles
- Every section must evoke national pride — color, typography, motion, and content all serve this
- The flag's colors (red, gold, blue) are woven throughout but never garish — used with the restraint of a luxury brand
- 8 stars appear as a recurring celestial motif (the 8 stars of the Venezuelan flag)
- Bilingual copy throughout — Spanish leads, English follows
- Tone: defiant, emotional, proud, never ironic

---

## Tech Stack

- **Markup/Style:** HTML + CSS + Tailwind utilities (no UI component libraries)
- **Animation:** GSAP + ScrollTrigger + Osmo components (Lenis smooth scroll, cursor effects, text reveals)
- **3D Globe:** Three.js (ES6 import maps via cdn.jsdelivr.net)
- **Data:** Supabase (tweets cache + admin approval only — NO user-submitted data)
- **Deploy:** Vercel (static site + serverless API routes)

---

## Site Structure

```
index.html
css/
  globals.css
js/
  main.js            — GSAP ScrollTrigger orchestration, Lenis, IntersectionObserver
  globe.js           — Three.js globe visualization
  tweets.js          — Fetch and render approved tweets
  timeline.js        — El Latido horizontal scroll
  admin.js           — Admin approval queue logic
admin.html           — Simple admin page for tweet approval
api/
  tweets/
    fetch.js          — Serverless: polls X API, stores pending tweets
    approve.js        — Serverless: approve/reject tweets
    approved.js       — Serverless: returns approved tweets for display
```

---

## Section 1: Hero

Full-viewport opening screen. The first thing anyone sees — it should take your breath away.

### Content
- Eyebrow label: `"World Baseball Classic 2026 · Miami, Florida"` in gold, ultra-spaced caps
- Venezuelan flag `ven-divider` stripe (80px wide, centered)
- Giant stacked title in Bebas Neue:
  - "Hasta" — `var(--white)`
  - "la" — `var(--red)`
  - "Final" — `var(--gold)`
  - Font size: `clamp(5rem, 18vw, 14rem)`, line-height 0.88
- Italic serif subtitle: *"El viaje de una generación."* / *"A generation's journey."*
- Matchup badge: Venezuela flag + "VEN vs USA" + US flag with a red "La Final" pill
- Scroll cue: small label + animated vertical line fading downward

### Background
- Deep radial red glow at center
- 8 faint gold stars scattered at various positions using radial-gradient dots
- Parallax: background glow shifts on scroll via GSAP

### Animation
- Title words stagger in (GSAP from below, slight rotation)
- Ven-divider draws itself (width animates from 0)
- Subtitle fades in with delay
- Stars twinkle subtly (opacity oscillation)

---

## Section 2: La Ruta (The Journey)

Background: `var(--bg2)`. ID: `#la-ruta`.

Venezuela's bracket path as 4 cards in a responsive CSS Grid.

### Data

| Round | Opponent | Score | Status |
|---|---|---|---|
| Fase de Grupos / Pool D | Various | 4-1 record | W |
| Cuartos de Final / Quarterfinal | Japan | 8-5 | W |
| Semifinal | Italy | 4-2 | W |
| La Gran Final / The Final | USA | TONIGHT | LIVE |

### Card Design
- Top border: `3px solid var(--red)` for wins, `3px solid var(--gold)` for the Final
- Round label (ES + EN), opponent flag + name, score in Bebas Neue (large)
- Status badge: "VICTORIA" in red for wins
- Final card: pulsing gold dot next to "TONIGHT"
- Bilingual highlight copy per game

### Highlight Copy
- **Pool:** "Venezuela avanza de la fase de grupos y se planta." / "Venezuela advances from Pool D, setting the stage."
- **QF vs Japan:** "El jonron de 3 carreras de Wilyer Abreu. Los campeones defensores caen." / "Wilyer Abreu's 3-run blast. The defending champions fall."
- **SF vs Italy:** "Seis lanzadores venezolanos apagan a Italia. Primera final en la historia." / "Six Venezuelan pitchers shut down unbeaten Italy. First ever final."
- **Final:** "8 PM ET · FOX · loanDepot Park, Miami · Esta noche" / "8 PM ET · FOX · loanDepot Park, Miami"

### Animation
- Cards stagger in via GSAP ScrollTrigger (fade up + slight Y translate, 150ms delay between each)
- Final card has a shimmer animation on its gold border
- Footer note: *"Primera final en la historia de Venezuela"* with ven-divider

---

## Section 3: El Lineup (Player Cards)

Background: `var(--bg)` with subtle stars. ID: `#el-lineup`.

8 flippable player cards in a CSS Grid.

### Card Mechanics
- CSS `rotateY` 3D transform, `perspective: 600px`
- Front: position badge, jersey number (large, low-opacity bg), player name in Bebas Neue, team, stat line in accent color
- Back: nickname label, Spanish + English description, "Volver" cue
- Flip on click/tap

### The 8 Players

1. **Ronald Acuna Jr.** — OF · Atlanta Braves · #13 · accent: red
   - "El Capitan" — "El latido de este equipo. Cuando Acuna se mueve, Venezuela se mueve."

2. **Luis Arraez** — 2B · San Diego Padres · #4 · accent: gold
   - "La Maquina de Hits" — "El bateador mas letal del torneo. 8 imparables, 10 carreras impulsadas."

3. **Salvador Perez** — C · Kansas City Royals · #13 · accent: blue
   - "El Cachorro" — "El guerrero veterano. Su energia detras del plato no tiene igual."

4. **Wilyer Abreu** — OF · Boston Red Sox · #54 · accent: red
   - "El Heroe de Tokio" — "Su jonron de 3 carreras sello la victoria mas grande en la historia del WBC venezolano."

5. **Jackson Chourio** — OF · Milwaukee Brewers · #11 · accent: gold
   - "El Futuro" — "Uno de los jovenes mas dinamicos del beisbol."

6. **William Contreras** — C · Milwaukee Brewers · #24 · accent: blue
   - "El Receptor" — "Presencia veterana y ancla defensiva."

7. **Keider Montero** — SP · Detroit Tigers · #48 · accent: red
   - "El Abridor" — "Tomo el balon en el partido mas importante de la historia del WBC venezolano."

8. **Jose Rodriguez** — SP · Venezuela · accent: gold
   - "El Abridor de la Final" — "Encargado de contener a USA en el partido mas grande de su carrera."

### Quote Block (below grid)
> *"No cometieron un solo error de campo en seis partidos. Ni uno."*
> "They haven't committed a single fielding error in six games. Not one." — ESPN

### Animation
- Cards stagger in via GSAP ScrollTrigger
- On hover (desktop): subtle lift + shadow
- Flip animation: smooth 0.6s ease with backface hidden

---

## Section 4: La Diaspora — The Centerpiece

Three layered sub-sections that form the emotional climax of the site. This is where Venezuelan pride hits hardest — a world-class data visualization showing the scale of the diaspora, live voices from the hashtag, and the heartbeat of the tournament run.

Background: `var(--bg2)` transitioning to `var(--bg)`. ID: `#la-diaspora`.

---

### 4A: The Globe — "7.7 Millones"

A full-viewport Three.js 3D globe visualization showing the Venezuelan diaspora across the world.

#### Visual Design
- **Dark sphere** with faint country border lines as thin luminous edges
- **Venezuela highlighted** in `--red` with subtle inner glow — the heart of the network
- **~30 cities** with major Venezuelan populations: glowing gold particle bursts
  - Miami, Houston, Dallas, New York, Madrid, Barcelona, Bogota, Santiago, Lima, Buenos Aires, Panama City, Lisbon, Mexico City, Toronto, Quito, Dublin, Rome, London, Sao Paulo, Doral, Weston, The Woodlands, etc.
- **Arc connections** from each city back to Caracas — thin luminous curves in `--gold` with traveling pulse animation (data flowing home)
- **Atmosphere shader** — subtle blue-to-red glow around globe edge (Venezuelan flag colors)
- **Background** — sparse, slow-moving particle field (stars)
- Auto-rotates slowly; user can drag to explore
- On hover/tap of city dot: tooltip with city name + estimated Venezuelan population (public UN/IOM data)

#### Scroll Sequence (GSAP ScrollTrigger pinned)
1. Globe fades in from darkness, slowly rotating
2. Cities ignite one by one with staggered gold bursts (largest communities first)
3. Arcs draw from each city to Caracas, building the network
4. Counter animates: **"7.7 millones de venezolanos en el mundo"** counts up in Bebas Neue
5. Subtitle fades in: *"Y esta noche, todos miran hacia Miami."* / *"And tonight, they're all watching Miami."*
6. Globe holds pinned while quote wall scrolls alongside
7. Globe fades and scales down as timeline takes over

#### Data Sources (all public, no collection)
- UN/IOM Venezuelan migration statistics for city population estimates
- Geographic coordinates for city positioning

---

### 4B: Voces — Live Curated Tweets from #HastaLaFinal

Live tweets from the `#HastaLaFinal` hashtag, curated through an admin approval queue.

#### Architecture
1. Serverless function polls X API v2 every ~30 seconds for `#HastaLaFinal`
2. New tweets stored in Supabase `pending_tweets` table (tweet ID, handle, display name, avatar URL, text, status)
3. Admin page (`/admin`) — see incoming tweets, tap to approve or skip
4. Approved tweets appear on live site within seconds
5. **No location data stored.** Only public tweet content.

#### Supabase Schema
```sql
CREATE TABLE tweets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tweet_id TEXT UNIQUE NOT NULL,
  handle TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  text TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tweets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read approved" ON tweets FOR SELECT USING (status = 'approved');
CREATE POLICY "Service can insert" ON tweets FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can update" ON tweets FOR UPDATE USING (true);
```

#### Visual Design
- Two asymmetric columns on desktop, single on mobile
- Staggered quote sizes — 3 hero quotes (massive type, gold left border) + smaller flowing quotes
- Each quote: avatar + display name + @handle + tweet text in Libre Baskerville italic
- Link to original tweet
- GSAP staggered fade-up reveals on scroll
- Hero quotes get parallax offset for depth

#### Safety
- No geolocation data extracted from tweets (even if available via API)
- Only public tweet data displayed
- Admin approval prevents spam/trolls/inappropriate content
- Italic footer: *"Voces reales de X. Ningún dato personal adicional fue recolectado." / "Real voices from X. No additional personal data was collected."*

#### Fallback (pre-game / if API not ready)
- 4 hardcoded placeholder tweets styled identically
- Banner: "Las voces llegan esta noche / Voices arrive tonight"

#### Admin Page (`admin.html`)
- Simple, functional — not public-facing
- Password-protected (env var check)
- Shows pending tweets as cards with Approve / Reject buttons
- Auto-refreshes every 15 seconds
- Counter: "X pending · Y approved · Z total"

---

### 4C: El Latido — Tournament Heartbeat Timeline

A horizontal scrolling timeline of key moments from Venezuela's WBC run.

#### Layout
- Horizontal red line with pulse points
- GSAP-driven horizontal scroll (section pinned, scroll drives horizontal movement)
- Collapses to vertical on mobile

#### The ~9 Moments

1. **"Venezuela Llega"** — Pool play opens. "Por primera vez, el mundo nos toma en serio." / "For the first time, the world takes us seriously."
2. **"Pool D: 4-1"** — Pool clinched. Accent: red.
3. **"Cuartos: Japon"** — The quarterfinal stage is set. Accent: blue.
4. **"ABREU. TRES CARRERAS."** — The 3-run HR. Hero moment. Accent: gold. Oversized.
5. **"Campeones Defensores Eliminados"** — Japan falls. Accent: red.
6. **"Montero Toma el Balon"** — Semifinal start. Accent: blue.
7. **"Seis Brazos, Un Corazon"** — Six pitchers shut down Italy. Accent: red.
8. **"Primera Final en la Historia"** — The moment it became real. Accent: gold. Oversized.
9. **"ESTA NOCHE"** — Tonight. The final point. Pulsing gold glow, oversized, animated. "Todo lo que falta es una victoria." / "All that's left is one win."

#### Animation
- Pulse points light up sequentially as horizontal scroll progresses
- Hero moments (4, 8, 9) scale up and get particle bursts
- The red line draws itself as you scroll
- Final point pulses continuously with gold glow

---

## Section 5: Footer

Simple centered footer on `var(--bg)`.

- Small `ven-divider` (60px)
- "Venezuela Siempre" in Bebas Neue, gold
- "Hecho con orgullo · Made with pride · WBC 2026" in muted small caps

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
X_API_BEARER_TOKEN=
ADMIN_PASSWORD=
```

---

## Key Implementation Notes

1. **No UI component libraries** — pure CSS + Tailwind utilities + Osmo components
2. **GSAP orchestrates everything** — ScrollTrigger for scroll sequences, pinning, horizontal scroll. Lenis for smooth scroll.
3. **Three.js globe** — ES6 import maps via cdn.jsdelivr.net. WebGLRenderer. Custom atmosphere shader.
4. **Flip cards** — pure CSS rotateY with transformStyle: preserve-3d and backfaceVisibility: hidden
5. **The site works without Supabase/X API** — show placeholder content and a "preview mode" banner. Everything except live tweets works statically.
6. **Mobile first** — all grids collapse to single column below 640px. Touch targets >= 44px. Globe becomes non-interactive on mobile (auto-rotate only).
7. **Typography scale** — use clamp() everywhere for fluid type.
8. **Venezuelan pride in every detail** — flag colors, 8 stars, bilingual copy, defiant tone, editorial restraint.
9. **Performance** — lazy load Three.js globe. Tweets fetched after initial paint. Timeline assets loaded on scroll proximity.
10. **Safety** — NO user-submitted data. NO location collection. Tweet cache contains only public data. Admin controls all visible content.
