# Build: "Hasta la Final" — Venezuela WBC 2026 Tribute Site

## What we're building

A bilingual (ES/EN) single-page web experience and living tribute to Venezuela's historic 2026 World Baseball Classic run — their first-ever appearance in the WBC Final. The site has three acts that scroll as one continuous experience, plus a Supabase-powered live diaspora memory feed.

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase, deploy to Vercel.

---

## Design System

**Aesthetic:** Editorial dark. Think a luxury sports magazine printed at midnight — raw typographic power, Venezuelan flag colors used with restraint and intention, generous negative space, motion that feels earned.

**Fonts (Google Fonts):**
- Display: `Bebas Neue` — headlines, scores, big moments
- Serif: `Libre Baskerville` — pull quotes, italicized emotional copy
- Body: `Plus Jakarta Sans` — UI, labels, form fields

**Color tokens (CSS variables on `:root`):**
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

**Recurring motifs:**
- `ven-divider`: a 3-segment bar colored red / gold / blue (the flag), used as a decorative element throughout
- 8 gold stars scattered lightly in backgrounds (the 8 stars of the Venezuelan flag)
- `section-label`: tiny all-caps gold label above each section heading (e.g. "Acto I / Act I")
- All section headings use Bebas Neue at `clamp(3rem, 8vw, 6rem)`
- Scroll-triggered fade-up animations on cards and content blocks using IntersectionObserver

**Layout rule:** Use CSS Grid with `gap: 1px; background: var(--border)` to create hairline-divided grids — gives a precise editorial feel without heavy borders.

---

## Project Structure

```
app/
  globals.css
  layout.tsx
  page.tsx
  api/
    memories/
      route.ts
components/
  Hero.tsx
  LaRuta.tsx
  ElLineup.tsx
  DondeEstabas.tsx
lib/
  supabase.ts
```

---

## Section 1: Hero

Full-viewport opening screen.

**Content:**
- Eyebrow label: `"World Baseball Classic 2026 · Miami, Florida"` in gold, ultra-spaced caps
- Venezuelan flag `ven-divider` stripe (80px wide, centered)
- Giant stacked title in Bebas Neue:
  - "Hasta" — `var(--white)`
  - "la" — `var(--red)`
  - "Final" — `var(--gold)`
  - Font size: `clamp(5rem, 18vw, 14rem)`, line-height 0.88
- Italic serif subtitle: *"El viaje de una generación."* / *"A generation's journey."*
- Matchup badge: `🇻🇪 VEN vs USA 🇺🇸` with a red "La Final" pill
- Scroll cue: small label + animated vertical line fading downward
- Background: deep radial red glow at center, 8 faint gold stars scattered at various positions using `radial-gradient` dots
- Parallax: the background glow shifts `scrollY * 0.4px` on scroll via a CSS variable

---

## Section 2: La Ruta (The Journey)

Background: `var(--bg2)`. ID: `#la-ruta`.

Shows Venezuela's bracket path as 4 cards in a responsive CSS Grid.

**Data — the 4 games:**

| Round | Opponent | Score | Status |
|---|---|---|---|
| Fase de Grupos / Pool D | Various 🌎 | 4–1 record | W |
| Cuartos de Final / Quarterfinal | Japan 🇯🇵 | 8–5 | W |
| Semifinal | Italy 🇮🇹 | 4–2 | W |
| La Gran Final / The Final | USA 🇺🇸 | TONIGHT | LIVE |

**Card design:**
- Top border: `3px solid var(--red)` for wins, `3px solid var(--gold)` for the Final card
- Shows: round label (ES + EN), opponent flag + name, score in Bebas Neue (large), status badge ("VICTORIA" in red for wins), two highlight lines (ES italic serif + EN muted)
- Final card has a pulsing gold dot next to "TONIGHT"
- Cards animate in via IntersectionObserver with staggered delays

**Highlight copy:**
- Pool: "Venezuela avanza de la fase de grupos y se planta." / "Venezuela advances from Pool D, setting the stage."
- QF vs Japan: "El jonrón de 3 carreras de Wilyer Abreu. Los campeones defensores caen." / "Wilyer Abreu's 3-run blast. The defending champions fall."
- SF vs Italy: "Seis lanzadores venezolanos apagan a Italia. Primera final en la historia." / "Six Venezuelan pitchers shut down unbeaten Italy. First ever final."
- Final: "8 PM ET · FOX · Miami · Esta noche" / "8 PM ET · FOX · loanDepot Park, Miami"

Footer note below grid: *"Primera final en la historia de Venezuela"* with a small `ven-divider`.

---

## Section 3: El Lineup (Player Cards)

Background: `var(--bg)` with subtle stars. ID: `#el-lineup`.

8 flippable player cards in a CSS Grid (`repeat(auto-fill, minmax(200px, 1fr))`). Each card flips on click (CSS `rotateY` 3D transform, `perspective: 600px`).

**Front of card:** Position badge, jersey number (large, low-opacity background), player display name in Bebas Neue, team, stat line in the player's accent color.

**Back of card:** Nickname label, Spanish italic description, English description, "‹ Volver" cue.

**The 8 players:**

1. **Ronald Acuña Jr.** — OF · Atlanta Braves · #13 · accent: red
   - Nickname: "El Capitán"
   - Stat: "Encendió cada jugada" / "Sparked every rally"
   - ES: "El latido de este equipo. Cuando Acuña se mueve, Venezuela se mueve."
   - EN: "The heartbeat of this team. When Acuña moves, Venezuela moves."

2. **Luis Arraez** — 2B · San Diego Padres · #4 · accent: gold
   - Nickname: "La Máquina de Hits"
   - Stat: "8 H · 10 CI" / "8 H · 10 RBI"
   - ES: "El bateador más letal del torneo. 8 imparables, 10 carreras impulsadas."
   - EN: "The tournament's most dangerous hitter. 8 hits, 10 RBI in 25 at-bats."

3. **Salvador Pérez** — C · Kansas City Royals · #13 · accent: blue
   - Nickname: "El Cachorro"
   - Stat: "Lideró vs. Japón" / "Led vs. Japan"
   - ES: "El guerrero veterano. Su energía detrás del plato no tiene igual."
   - EN: "The veteran warrior. His energy behind the plate is unmatched."

4. **Wilyer Abreu** — OF · Boston Red Sox · #54 · accent: red
   - Nickname: "El Héroe de Tokio"
   - Stat: "Jonrón de 3 vs. Japón" / "3-run HR vs. Japan"
   - ES: "Su jonrón de 3 carreras selló la victoria más grande en la historia del WBC venezolano."
   - EN: "His towering 3-run blast sealed the biggest win in Venezuelan WBC history."

5. **Jackson Chourio** — OF · Milwaukee Brewers · #11 · accent: gold
   - Nickname: "El Futuro"
   - Stat: "La nueva generación" / "The new generation"
   - ES: "Uno de los jóvenes más dinámicos del béisbol. Batea 9 como si Witt bateara 9."
   - EN: "One of the most dynamic young players in baseball. Batting 9th like Witt bats 9th."

6. **William Contreras** — C · Milwaukee Brewers · #24 · accent: blue
   - Nickname: "El Receptor"
   - Stat: "Élite detrás del plato" / "Elite behind the plate"
   - ES: "Presencia veterana y ancla defensiva. Un receptor completo en cada lanzamiento."
   - EN: "Veteran presence and defensive anchor. A complete catcher on every pitch."

7. **Keider Montero** — SP · Detroit Tigers · #48 · accent: red
   - Nickname: "El Abridor"
   - Stat: "Abrió la Semifinal" / "Started the Semifinal"
   - ES: "Tomó el balón en el partido más importante de la historia del WBC venezolano."
   - EN: "Took the ball in the biggest game of Venezuela's WBC history."

8. **José Rodríguez** — SP · Venezuela · accent: gold
   - Nickname: "El Abridor de la Final"
   - Stat: "Abrirá La Final" / "Starting the Final"
   - ES: "Encargado de contener a USA en el partido más grande de su carrera."
   - EN: "Tasked with keeping Team USA at bay in the biggest game of his career."

**Quote block** below the grid (gold left border):
> *"No cometieron un solo error de campo en seis partidos. Ni uno."*
> "They haven't committed a single fielding error in six games. Not one." — ESPN

---

## Section 4: ¿Dónde Estabas? (Diaspora Memory Collector)

Background: `var(--bg2)`. ID: `#donde-estabas`.

Two-column CSS Grid layout:
- **Left column** — submission form
- **Right column** — live scrolling feed of memories

### Form fields:
- Ciudad / City (text input)
- País / Country (select dropdown with flag emojis — include: Venezuela, USA, Spain, Colombia, Panama, Mexico, Argentina, Chile, Peru, Ecuador, Dominican Republic, Canada, Portugal, Italy, Germany, Brazil, France, Netherlands, UK, Australia, Japan, Trinidad, Costa Rica, Uruguay, Bolivia, Paraguay, Honduras, Guatemala, El Salvador, Nicaragua, Cuba, Puerto Rico, Switzerland, Sweden, Norway + "Other / Otro")
- Tu mensaje / Your message (textarea, 280 char max with counter)
- Submit button: "Compartir memoria ›" (red, styled `btn-primary`)

**After submit:** Show a thank-you state with 🇻🇪, "¡Gracias!", "Tu memoria es parte de la historia ahora." and an "Add another" link.

### Memory feed:
- Shows up to 100 most recent entries, newest first
- Each entry: flag + "City, Country" on one line with a timestamp ("Hace Xm / Ahora mismo"), message in italic Libre Baskerville
- Most recent entry gets a gold left border + fade-in animation
- Shows entry count: "X voces / voices"
- If Supabase is live: shows a pulsing red "En vivo" dot

### Placeholder data (shown before Supabase is wired up):
```
Caracas, Venezuela — "Toda la familia reunida, llorando de emoción. ¡Por Venezuela!"
Miami, USA — "El barrio entero está en la calle. Never felt more Venezuelan in my life."
Madrid, Spain — "Son las 2am pero no importa. ¡Hasta la final, carajo!"
Bogotá, Colombia — "Venezolanos en Colombia celebrando con el corazón en la mano."
```

---

## Supabase Setup

### `lib/supabase.ts`
```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Memory = {
  id: string
  city: string
  country: string
  message: string
  created_at: string
}
```

### SQL to run in Supabase dashboard:
```sql
CREATE TABLE memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert" ON memories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read"   ON memories FOR SELECT USING (true);
```

### API route `app/api/memories/route.ts`
- `POST`: validates city (max 80), country (max 60), message (max 280) — all required. Inserts into Supabase `memories` table. Returns inserted row.
- `GET`: fetches all memories ordered by `created_at desc`, limit 100.
- Use `SUPABASE_SERVICE_ROLE_KEY` for server-side writes if available, fall back to anon key.
- If env vars are missing, return empty array on GET and a 503 on POST.

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Footer

Simple centered footer on `var(--bg)`:
- Small `ven-divider` (60px)
- "Venezuela Siempre" in Bebas Neue, gold
- "Hecho con orgullo · Made with pride · WBC 2026" in muted small caps

---

## Key Implementation Notes

1. **No UI component libraries** — pure CSS + Tailwind utilities only.
2. **All animations**: use CSS keyframes + `IntersectionObserver` for scroll-triggered reveals. No animation library needed.
3. **Flip cards**: pure CSS `rotateY` with `transformStyle: preserve-3d` and `backfaceVisibility: hidden`. Both faces are `position: absolute; inset: 0`.
4. **The site works without Supabase** — show placeholder memories and a "preview mode" banner. Everything except live submissions works statically.
5. **Mobile first** — all grids collapse to single column below `640px`. Touch targets ≥ 44px.
6. **Typography scale** — use `clamp()` everywhere for fluid type. Never hardcode pixel sizes for display text.
7. **`globals.css`** imports Google Fonts via `@import url(...)`, defines all CSS variables, all reusable utility classes (`.font-display`, `.font-serif`, `.section`, `.section-inner`, `.section-label`, `.ven-divider`, `.btn-primary`, `.field`, `.stars-bg`, `.animate-fadeUp`, `.animate-delay-1/2/3/4`), and keyframes (`fadeUp`, `pulse-gold`, `shimmer`).
