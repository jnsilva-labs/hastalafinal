# Hasta La Final — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page, bilingual tribute site for Venezuela's historic 2026 WBC Finals run — editorial dark aesthetic, Three.js globe, GSAP animations, live curated tweets.

**Architecture:** Static HTML/CSS/JS site with GSAP + Lenis for scroll/animation, Three.js for 3D globe, Supabase for tweet caching, Vercel for hosting + serverless API routes. No frameworks — pure vanilla for speed and simplicity.

**Tech Stack:** HTML, CSS (custom properties + Tailwind CDN), GSAP + ScrollTrigger + Lenis (CDN), Three.js (ES6 import maps), Supabase JS client (CDN), Vercel serverless functions (Node.js)

---

## Parallel Execution Strategy

This plan has **4 independent tracks** that can be built simultaneously after Task 1 (foundation):

| Track | Tasks | Description |
|-------|-------|-------------|
| **A: Static Sections** | 2, 3, 4, 8 | Hero, La Ruta, El Lineup, Footer — all HTML/CSS/GSAP |
| **B: Globe** | 5 | Three.js diaspora globe — most complex, fully independent |
| **C: Tweet System** | 6, 7 | Supabase schema, API routes, admin page, tweet display |
| **D: Timeline** | 9 | El Latido horizontal scroll timeline |

**Task 10** (final orchestration) depends on all tracks completing.

```
Task 1 (Foundation)
  ├── Track A: Task 2 → Task 3 → Task 4 → Task 8
  ├── Track B: Task 5
  ├── Track C: Task 6 → Task 7
  └── Track D: Task 9
  └── All tracks → Task 10 (Orchestration + Polish)
```

---

## Task 1: Foundation — Project Structure, Design System, HTML Shell

**Files:**
- Create: `index.html`
- Create: `css/globals.css`
- Create: `vercel.json`
- Create: `.env.example`
- Create: `.gitignore`

**Step 1: Create `.gitignore`**

```
node_modules/
.env
.vercel/
.DS_Store
```

**Step 2: Create `.env.example`**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
X_API_BEARER_TOKEN=
ADMIN_PASSWORD=
```

**Step 3: Create `vercel.json`**

```json
{
  "rewrites": [
    { "source": "/admin", "destination": "/admin.html" }
  ]
}
```

**Step 4: Create `css/globals.css`**

The entire design system. Must include:

- Google Fonts import: Bebas Neue, Libre Baskerville, Plus Jakarta Sans
- All CSS custom properties (color tokens from design doc)
- Base reset (box-sizing, margin, smooth scroll via Lenis — NOT `scroll-behavior: smooth`)
- Typography utility classes: `.font-display` (Bebas Neue), `.font-serif` (Libre Baskerville), `.font-body` (Plus Jakarta Sans)
- Layout utilities: `.section` (full-width, padding), `.section-inner` (max-width 1200px, centered), `.section-label` (tiny gold uppercase label)
- `.ven-divider` — 3-segment bar: red | gold | blue, `display: flex`, each segment equal width, 4px height
- `.stars-bg` — pseudo-element with 8 radial-gradient gold dots at scattered fixed positions
- `.btn-primary` — red background, white text, Bebas Neue, hover glow
- `.field` — dark input styling (bg3 background, border, white text)
- Grid utility: `.editorial-grid` — CSS Grid with `gap: 1px; background: var(--border)` and children get `background: var(--bg)` or `var(--bg2)`
- Animation keyframes: `fadeUp` (translateY 30px → 0, opacity 0 → 1), `pulse-gold` (box-shadow gold oscillation), `shimmer` (background-position shift for gradient), `draw-line` (width 0 → 100%), `twinkle` (opacity 0.3 → 1 → 0.3)
- Animation utility classes: `.animate-fadeUp`, `.animate-delay-1` through `.animate-delay-4` (100ms increments)
- Responsive: all clamp() values, grid collapses below 640px
- Mobile-first media queries

**Step 5: Create `index.html`**

The full HTML shell with all sections as empty containers. Must include:

- `<!DOCTYPE html>` with `lang="es"` (Spanish-first)
- `<head>`: charset, viewport, title "Hasta la Final — Venezuela WBC 2026", meta description, OG tags (title, description, image placeholder), CSS link to globals.css, Tailwind CDN play script
- Import map in `<script type="importmap">` for Three.js:
  ```json
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
    }
  }
  ```
- GSAP + ScrollTrigger + Lenis CDN scripts (defer):
  ```html
  <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js"></script>
  ```
- `<body>` with sections:
  - `<section id="hero" class="section">` — empty, filled by Task 2
  - `<section id="la-ruta" class="section">` — empty, filled by Task 3
  - `<section id="el-lineup" class="section">` — empty, filled by Task 4
  - `<section id="la-diaspora" class="section">` — contains 3 sub-containers:
    - `<div id="globe-container">` — filled by Task 5
    - `<div id="voces">` — filled by Task 7
    - `<div id="el-latido">` — filled by Task 9
  - `<footer id="footer">` — filled by Task 8
- Script tags at bottom: `<script type="module" src="js/globe.js"></script>` and `<script src="js/main.js"></script>`, `<script src="js/tweets.js"></script>`, `<script src="js/timeline.js"></script>`

**Step 6: Verify foundation loads**

Run: `npx serve .` or open `index.html` in browser
Expected: Dark page with correct fonts loading, CSS variables working, empty sections visible

**Step 7: Commit**

```bash
git add .gitignore .env.example vercel.json index.html css/globals.css
git commit -m "feat: project foundation — design system, HTML shell, CDN imports"
```

---

## Task 2: Hero Section (Track A)

**Files:**
- Modify: `index.html` — fill `#hero` section
- Modify: `css/globals.css` — add hero-specific styles
- Create: `js/main.js` — initial GSAP hero animations

**Step 1: Add Hero HTML to `index.html`**

Inside `<section id="hero">`, add:

```html
<div class="hero-bg">
  <div class="hero-glow"></div>
  <div class="hero-stars"></div>
</div>
<div class="hero-content">
  <p class="section-label hero-eyebrow">World Baseball Classic 2026 · Miami, Florida</p>
  <div class="ven-divider hero-divider" style="width: 80px; margin: 0 auto 2rem;"></div>
  <h1 class="hero-title">
    <span class="hero-word hero-word--hasta">Hasta</span>
    <span class="hero-word hero-word--la">la</span>
    <span class="hero-word hero-word--final">Final</span>
  </h1>
  <p class="hero-subtitle font-serif">
    <em>El viaje de una generación.</em><br>
    <span class="text-muted">A generation's journey.</span>
  </p>
  <div class="hero-matchup">
    <span>🇻🇪 VEN</span>
    <span class="hero-vs">vs</span>
    <span>USA 🇺🇸</span>
    <span class="hero-pill">La Final</span>
  </div>
  <div class="hero-scroll-cue">
    <span class="section-label">Scroll</span>
    <div class="hero-scroll-line"></div>
  </div>
</div>
```

**Step 2: Add Hero CSS to `css/globals.css`**

- `#hero`: `min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; background: var(--bg);`
- `.hero-bg`: `position: absolute; inset: 0; z-index: 0;`
- `.hero-glow`: `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(207,20,43,0.15) 0%, transparent 70%); border-radius: 50%;`
- `.hero-stars`: Use `.stars-bg` pattern — 8 gold radial-gradient dots scattered across the hero
- `.hero-content`: `position: relative; z-index: 1; text-align: center; padding: 2rem;`
- `.hero-title`: `font-family: 'Bebas Neue'; font-size: clamp(5rem, 18vw, 14rem); line-height: 0.88; text-transform: uppercase;`
- `.hero-word--hasta`: `color: var(--white);`
- `.hero-word--la`: `color: var(--red); display: block;`
- `.hero-word--final`: `color: var(--gold); display: block;`
- `.hero-subtitle`: `font-size: clamp(1rem, 2.5vw, 1.5rem); color: var(--white); margin-top: 1.5rem;`
- `.hero-matchup`: `display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 2rem; font-family: 'Bebas Neue'; font-size: clamp(1.2rem, 3vw, 2rem); color: var(--white);`
- `.hero-pill`: `background: var(--red); color: var(--white); padding: 0.25em 0.75em; border-radius: 4px; font-size: 0.7em; text-transform: uppercase; letter-spacing: 0.1em;`
- `.hero-scroll-cue`: `position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); text-align: center;`
- `.hero-scroll-line`: `width: 1px; height: 40px; background: var(--gold); margin: 0.5rem auto 0; animation: fadeDown 2s ease infinite;`
- Add `@keyframes fadeDown` — opacity 1 → 0 with translateY 0 → 20px

**Step 3: Create `js/main.js` with Hero GSAP animations**

```javascript
// Wait for DOM + GSAP to load
document.addEventListener('DOMContentLoaded', () => {
  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis smooth scroll
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Hero entrance animation
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .from('.hero-eyebrow', { opacity: 0, y: 20, duration: 0.8 })
    .from('.hero-divider', { width: 0, duration: 0.6 }, '-=0.4')
    .from('.hero-word--hasta', { opacity: 0, y: 60, rotateX: 15, duration: 0.7 }, '-=0.3')
    .from('.hero-word--la', { opacity: 0, y: 60, rotateX: 15, duration: 0.7 }, '-=0.4')
    .from('.hero-word--final', { opacity: 0, y: 60, rotateX: 15, duration: 0.7 }, '-=0.4')
    .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8 }, '-=0.3')
    .from('.hero-matchup', { opacity: 0, y: 20, duration: 0.8 }, '-=0.4')
    .from('.hero-scroll-cue', { opacity: 0, duration: 1 }, '-=0.3');

  // Hero parallax — glow follows scroll
  gsap.to('.hero-glow', {
    y: () => window.innerHeight * 0.4,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // Stars twinkle
  gsap.to('.hero-stars', {
    opacity: 0.6,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
});
```

**Step 4: Verify Hero in browser**

Open in browser. Expected: full-viewport dark hero with staggered title animation, parallax glow on scroll, twinkling stars, scroll cue.

**Step 5: Commit**

```bash
git add index.html css/globals.css js/main.js
git commit -m "feat: Hero section — title animation, parallax, scroll cue"
```

---

## Task 3: La Ruta Section (Track A)

**Files:**
- Modify: `index.html` — fill `#la-ruta` section
- Modify: `css/globals.css` — add journey card styles
- Modify: `js/main.js` — add ScrollTrigger animations for cards

**Step 1: Add La Ruta HTML**

Inside `<section id="la-ruta">`, add the section label, heading, 4-card CSS Grid, and footer note. Each card is a `<div class="journey-card">` with:
- `.journey-card__round` — round label (ES + EN on separate lines)
- `.journey-card__opponent` — flag emoji + opponent name
- `.journey-card__score` — score in Bebas Neue (large)
- `.journey-card__status` — "VICTORIA" badge or "TONIGHT" with pulsing dot
- `.journey-card__highlight` — bilingual highlight copy

The 4th card (Final) gets class `.journey-card--final` for gold border + pulse.

Data to use:
1. Pool D — Various 🌎 — 4-1 — W — "Venezuela avanza..." / "Venezuela advances..."
2. Quarterfinal — Japan 🇯🇵 — 8-5 — W — "El jonrón de 3 carreras..." / "Wilyer Abreu's 3-run blast..."
3. Semifinal — Italy 🇮🇹 — 4-2 — W — "Seis lanzadores venezolanos..." / "Six Venezuelan pitchers..."
4. The Final — USA 🇺🇸 — TONIGHT — LIVE — "8 PM ET · FOX · loanDepot Park..."

**Step 2: Add La Ruta CSS**

- `.journey-grid`: `display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1px; background: var(--border);`
- `.journey-card`: `background: var(--bg2); padding: 2rem; border-top: 3px solid var(--red);`
- `.journey-card--final`: `border-top-color: var(--gold);`
- `.journey-card__score`: `font-family: 'Bebas Neue'; font-size: clamp(2.5rem, 5vw, 4rem); color: var(--white);`
- `.journey-card__status`: `display: inline-block; padding: 0.25em 0.75em; font-family: 'Bebas Neue'; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;`
- `.status--win`: `background: var(--red-dim); color: var(--red);`
- `.status--live`: `background: var(--gold-dim); color: var(--gold);` with pulsing dot pseudo-element
- Pulsing dot: `::before` with `animation: pulse-gold 2s infinite`
- `.journey-card__highlight`: `font-family: 'Libre Baskerville'; font-style: italic; font-size: 0.9rem; color: var(--white); margin-top: 1rem;`
- Highlight English line: `color: var(--muted); font-style: normal;`

**Step 3: Add La Ruta GSAP animations to `js/main.js`**

```javascript
// La Ruta — staggered card reveal
gsap.from('.journey-card', {
  y: 40,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '#la-ruta',
    start: 'top 75%',
  },
});

// Final card shimmer
gsap.to('.journey-card--final', {
  '--shimmer-x': '200%',
  duration: 3,
  repeat: -1,
  ease: 'none',
});
```

**Step 4: Verify in browser**

Expected: 4-card grid, red top borders on wins, gold on final, staggered fade-up on scroll, pulsing gold dot on TONIGHT.

**Step 5: Commit**

```bash
git add index.html css/globals.css js/main.js
git commit -m "feat: La Ruta section — journey cards with staggered scroll reveal"
```

---

## Task 4: El Lineup Section (Track A)

**Files:**
- Modify: `index.html` — fill `#el-lineup` section
- Modify: `css/globals.css` — add flip card styles
- Modify: `js/main.js` — add flip interaction + ScrollTrigger

**Step 1: Add El Lineup HTML**

Inside `<section id="el-lineup">`, add section label, heading, 8-card grid, and ESPN quote block.

Each player card structure:
```html
<div class="player-card" data-accent="red|gold|blue" onclick="this.classList.toggle('flipped')">
  <div class="player-card__inner">
    <div class="player-card__front">
      <span class="player-card__position">OF</span>
      <span class="player-card__number">#13</span>
      <h3 class="player-card__name font-display">Ronald Acuña Jr.</h3>
      <p class="player-card__team">Atlanta Braves</p>
      <p class="player-card__stat">Encendió cada jugada</p>
    </div>
    <div class="player-card__back">
      <span class="player-card__nickname">"El Capitán"</span>
      <p class="player-card__desc-es font-serif"><em>El latido de este equipo...</em></p>
      <p class="player-card__desc-en">The heartbeat of this team...</p>
      <span class="player-card__cue">‹ Volver</span>
    </div>
  </div>
</div>
```

All 8 players with full data from design doc. Use correct accent colors, jersey numbers, positions, teams, nicknames, stats, and bilingual descriptions.

Quote block after grid:
```html
<blockquote class="lineup-quote">
  <p class="font-serif"><em>"No cometieron un solo error de campo en seis partidos. Ni uno."</em></p>
  <p class="lineup-quote__en">"They haven't committed a single fielding error in six games. Not one."</p>
  <cite>— ESPN</cite>
</blockquote>
```

**Step 2: Add Flip Card CSS**

- `.player-grid`: `display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem;`
- `.player-card`: `perspective: 600px; cursor: pointer; height: 320px;`
- `.player-card__inner`: `position: relative; width: 100%; height: 100%; transition: transform 0.6s ease; transform-style: preserve-3d;`
- `.player-card.flipped .player-card__inner`: `transform: rotateY(180deg);`
- `.player-card__front, .player-card__back`: `position: absolute; inset: 0; backface-visibility: hidden; padding: 1.5rem; border-radius: 8px;`
- `.player-card__front`: `background: var(--bg3);`
- `.player-card__back`: `background: var(--bg3); transform: rotateY(180deg);`
- `.player-card__number`: `position: absolute; right: 1rem; top: 0.5rem; font-family: 'Bebas Neue'; font-size: 5rem; opacity: 0.08; color: var(--white);`
- `.player-card__name`: `font-size: clamp(1.3rem, 2vw, 1.6rem); color: var(--white); margin-top: auto;`
- Accent color handling via `[data-accent="red"] .player-card__stat { color: var(--red); }` etc for gold and blue
- `.player-card:hover .player-card__inner`: `transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.3);` (desktop only, `@media (hover: hover)`)
- `.lineup-quote`: `border-left: 3px solid var(--gold); padding-left: 1.5rem; margin-top: 3rem; max-width: 600px;`

**Step 3: Add El Lineup GSAP to `js/main.js`**

```javascript
// Player cards staggered reveal
gsap.from('.player-card', {
  y: 40,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '#el-lineup',
    start: 'top 70%',
  },
});

// Quote fade in
gsap.from('.lineup-quote', {
  x: -30,
  opacity: 0,
  duration: 1,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.lineup-quote',
    start: 'top 85%',
  },
});
```

**Step 4: Verify in browser**

Expected: 8 cards in responsive grid, click to flip with smooth 3D rotation, accent colors per player, hover lift on desktop, ESPN quote with gold border.

**Step 5: Commit**

```bash
git add index.html css/globals.css js/main.js
git commit -m "feat: El Lineup section — 8 flippable player cards with scroll reveal"
```

---

## Task 5: Three.js Diaspora Globe (Track B — Independent)

**Files:**
- Create: `js/globe.js`
- Modify: `index.html` — ensure `#globe-container` has proper sizing
- Modify: `css/globals.css` — globe container styles

**This is the most complex task. The globe must be award-winning quality.**

**Step 1: Add globe container styles to CSS**

```css
#globe-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}
#globe-container canvas {
  display: block;
}
.globe-counter {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 2;
  pointer-events: none;
}
.globe-counter__number {
  font-family: 'Bebas Neue';
  font-size: clamp(3rem, 8vw, 6rem);
  color: var(--gold);
}
.globe-counter__label {
  font-family: 'Libre Baskerville';
  font-style: italic;
  color: var(--white);
  font-size: clamp(1rem, 2vw, 1.3rem);
}
.globe-subtitle {
  font-family: 'Libre Baskerville';
  font-style: italic;
  color: var(--muted);
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  margin-top: 0.5rem;
}
```

**Step 2: Add counter HTML to `#globe-container` in `index.html`**

```html
<div id="globe-container">
  <!-- Three.js canvas renders here -->
  <div class="globe-counter">
    <div class="globe-counter__number" id="globe-count">0</div>
    <div class="globe-counter__label">venezolanos en el mundo</div>
    <div class="globe-subtitle" id="globe-subtitle" style="opacity:0">
      Y esta noche, todos miran hacia Miami.<br>
      <span style="color: var(--muted)">And tonight, they're all watching Miami.</span>
    </div>
  </div>
</div>
```

**Step 3: Create `js/globe.js`**

This is a full Three.js ES module. Key components:

1. **Scene setup**: Dark background (`#07070f`), PerspectiveCamera, WebGLRenderer (antialias, alpha)
2. **Globe sphere**: `SphereGeometry(1, 64, 64)` with custom shader material:
   - Base color: very dark blue-black
   - Country borders: load a world topology JSON or use a equirectangular texture with country outlines as luminous edges
   - Simpler approach: use a dark globe texture with faint country lines (can use a public domain equirectangular map processed to dark theme)
3. **Venezuela highlight**: A separate geometry or overlay that highlights Venezuela's shape in `--red` with emissive glow
4. **Atmosphere**: Custom shader on a slightly larger sphere — edge glow transitioning from blue to red (Venezuelan flag)
   ```
   - Inner: transparent
   - Edge: blue → red gradient based on fresnel
   ```
5. **City points**: ~30 `Points` or small `SphereGeometry` meshes at lat/lon positions converted to 3D coordinates
   - Color: `--gold` (#F4C430)
   - Each has a sprite glow / particle burst effect
   - Store city data as array: `{ name, lat, lon, population, populationLabel }`
6. **Arc connections**: `QuadraticBezierCurve3` from each city to Caracas (10.4806, -66.9036)
   - Material: gold with transparency
   - Animated: a uniform drives a "traveling pulse" along the arc (like data flowing)
7. **Background particles**: `Points` with `BufferGeometry`, ~500 particles, slow drift
8. **Interaction**: OrbitControls with damping, auto-rotate, limited zoom range
9. **Tooltip**: On raycaster hover of city point, show HTML tooltip (city name + population)
10. **Responsive**: Resize handler for camera aspect + renderer size

**City data array (subset — include all ~30):**
```javascript
const cities = [
  { name: 'Miami', lat: 25.7617, lon: -80.1918, population: 340000, label: '340K' },
  { name: 'Houston', lat: 29.7604, lon: -95.3698, population: 200000, label: '200K' },
  { name: 'Madrid', lat: 40.4168, lon: -3.7038, population: 350000, label: '350K' },
  { name: 'Bogotá', lat: 4.7110, lon: -74.0721, population: 2500000, label: '2.5M' },
  { name: 'Santiago', lat: -33.4489, lon: -70.6693, population: 500000, label: '500K' },
  { name: 'Lima', lat: -12.0464, lon: -77.0428, population: 1200000, label: '1.2M' },
  { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816, population: 180000, label: '180K' },
  { name: 'Panamá City', lat: 8.9824, lon: -79.5199, population: 150000, label: '150K' },
  { name: 'Lisboa', lat: 38.7223, lon: -9.1393, population: 120000, label: '120K' },
  { name: 'Barcelona', lat: 41.3874, lon: 2.1686, population: 80000, label: '80K' },
  { name: 'México City', lat: 19.4326, lon: -99.1332, population: 60000, label: '60K' },
  { name: 'Toronto', lat: 43.6532, lon: -79.3832, population: 50000, label: '50K' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, population: 95000, label: '95K' },
  { name: 'Dallas', lat: 32.7767, lon: -96.7970, population: 75000, label: '75K' },
  { name: 'Quito', lat: -0.1807, lon: -78.4678, population: 400000, label: '400K' },
  { name: 'São Paulo', lat: -23.5505, lon: -46.6333, population: 50000, label: '50K' },
  { name: 'London', lat: 51.5074, lon: -0.1278, population: 35000, label: '35K' },
  { name: 'Rome', lat: 41.9028, lon: 12.4964, population: 30000, label: '30K' },
  { name: 'Dublin', lat: 53.3498, lon: -6.2603, population: 20000, label: '20K' },
  { name: 'Doral', lat: 25.8195, lon: -80.3553, population: 120000, label: '120K' },
  { name: 'Weston', lat: 26.1004, lon: -80.3998, population: 80000, label: '80K' },
  { name: 'Caracas', lat: 10.4806, lon: -66.9036, population: 0, label: 'Home', isHome: true },
  { name: 'Guayaquil', lat: -2.1894, lon: -79.8891, population: 90000, label: '90K' },
  { name: 'Santo Domingo', lat: 18.4861, lon: -69.9312, population: 120000, label: '120K' },
  { name: 'San José', lat: 9.9281, lon: -84.0907, population: 30000, label: '30K' },
  { name: 'Orlando', lat: 28.5383, lon: -81.3792, population: 60000, label: '60K' },
  { name: 'Chicago', lat: 41.8781, lon: -87.6298, population: 25000, label: '25K' },
  { name: 'Trinidad', lat: 10.6918, lon: -61.2225, population: 40000, label: '40K' },
];
```

**Lat/lon to 3D conversion helper:**
```javascript
function latLonToVec3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}
```

**Step 4: GSAP ScrollTrigger integration for globe sequence**

In `js/main.js`, add ScrollTrigger that:
1. Pins `#globe-container` for the duration of the scroll sequence
2. Calls functions exported from `globe.js` to trigger city ignition, arc drawing, counter animation
3. Uses `gsap.to('#globe-count', { textContent: 7700000, duration: 2, snap: { textContent: 1000 }, ... })` with a custom number formatter to show "7,700,000"

**Step 5: Add globe texture approach**

For simplicity and speed, use a dark equirectangular earth texture. Options:
- Use `TextureLoader` to load a dark-themed earth texture (create a minimal one or use public domain)
- OR use a wireframe approach: `SphereGeometry` with `MeshBasicMaterial({ wireframe: true, color: 0x1e1e32 })` — elegant, editorial, no texture needed
- Recommended: **Wireframe globe** — matches the editorial dark aesthetic perfectly, no external assets, loads instantly

**Step 6: Verify globe in browser**

Expected: Dark wireframe globe with gold city dots, red Venezuela highlight, golden arcs to Caracas, atmosphere glow, auto-rotation, drag interaction, counter animation on scroll.

**Step 7: Commit**

```bash
git add js/globe.js index.html css/globals.css
git commit -m "feat: Three.js diaspora globe — cities, arcs, atmosphere, scroll animation"
```

---

## Task 6: Supabase + API Routes for Tweet System (Track C)

**Files:**
- Create: `api/tweets/fetch.js` — serverless function: poll X API, store pending tweets
- Create: `api/tweets/approve.js` — serverless function: approve/reject tweets
- Create: `api/tweets/approved.js` — serverless function: return approved tweets
- Create: `lib/supabase.js` — Supabase client helper (for serverless functions)

**Step 1: Create `lib/supabase.js`**

```javascript
const { createClient } = require('@supabase/supabase-js');

function getSupabase(useServiceRole = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}

module.exports = { getSupabase };
```

**Step 2: Create `api/tweets/fetch.js`**

Vercel serverless function (Node.js). On `POST`:
1. Verify `ADMIN_PASSWORD` header matches env var
2. Call X API v2 recent search: `GET https://api.twitter.com/2/tweets/search/recent?query=%23HastaLaFinal&tweet.fields=created_at,author_id&expansions=author_id&user.fields=name,username,profile_image_url&max_results=20`
3. For each tweet, upsert into Supabase `tweets` table with status `pending` (skip if `tweet_id` already exists)
4. Return count of new tweets inserted

On `GET`:
1. Return 200 with message "Use POST to fetch tweets"

**Step 3: Create `api/tweets/approve.js`**

On `POST`:
1. Verify `ADMIN_PASSWORD` header
2. Accept JSON body: `{ tweet_id, action: 'approved' | 'rejected' }`
3. Update the tweet's status in Supabase
4. Return updated tweet

On `GET`:
1. Verify `ADMIN_PASSWORD` header
2. Return all pending tweets (status = 'pending'), ordered by created_at desc

**Step 4: Create `api/tweets/approved.js`**

On `GET`:
1. No auth required (public endpoint)
2. Fetch all tweets with status = 'approved', ordered by created_at desc, limit 50
3. If Supabase not configured, return hardcoded placeholder tweets:
```json
[
  { "display_name": "Coming Soon", "handle": "HastaLaFinal", "text": "Las voces llegan esta noche... / Voices arrive tonight...", "avatar_url": null }
]
```
4. Return JSON array

**Step 5: Create `package.json` for serverless dependencies**

```json
{
  "private": true,
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0"
  }
}
```

Run: `cd "/Users/jnsilva/Claude/Hasta La Final" && npm install`

**Step 6: Verify API routes locally**

Run: `npx vercel dev` (or test with curl after deploy)
Expected: `/api/tweets/approved` returns placeholder array

**Step 7: Commit**

```bash
git add lib/supabase.js api/ package.json package-lock.json
git commit -m "feat: tweet API routes — fetch from X, approve/reject, serve approved"
```

---

## Task 7: Tweet Display + Admin Page (Track C)

**Files:**
- Create: `js/tweets.js` — fetch and render approved tweets on main site
- Create: `admin.html` — admin approval queue page
- Create: `js/admin.js` — admin page logic
- Modify: `index.html` — ensure `#voces` container has proper structure
- Modify: `css/globals.css` — tweet card and admin styles

**Step 1: Add Voces HTML to `index.html`**

Inside `<div id="voces">`:
```html
<div class="section-inner">
  <p class="section-label">Voces / Voices</p>
  <h2 class="font-display voces-heading">Voces Sin Fronteras</h2>
  <div class="voces-grid" id="voces-grid">
    <!-- Tweets injected by js/tweets.js -->
  </div>
  <p class="voces-disclaimer font-serif">
    <em>Voces reales de X. Ningún dato personal adicional fue recolectado.</em><br>
    <span style="color: var(--muted)">Real voices from X. No additional personal data was collected.</span>
  </p>
</div>
```

**Step 2: Add tweet card CSS to `globals.css`**

- `.voces-grid`: Two asymmetric columns on desktop (`grid-template-columns: 1.2fr 0.8fr`), gap 2rem, single column mobile
- `.tweet-card`: `background: var(--bg3); padding: 1.5rem; border-radius: 8px;`
- `.tweet-card--hero`: `grid-column: 1 / -1; border-left: 3px solid var(--gold); font-size: 1.3em;`
- `.tweet-card__header`: flex row with avatar (32px circle), display name (white, bold), @handle (muted)
- `.tweet-card__text`: `font-family: 'Libre Baskerville'; font-style: italic; color: var(--white); line-height: 1.6;`
- `.tweet-card__link`: `color: var(--muted); font-size: 0.8rem;` — "View on X →"

**Step 3: Create `js/tweets.js`**

```javascript
(function() {
  const grid = document.getElementById('voces-grid');
  if (!grid) return;

  const PLACEHOLDER_TWEETS = [
    { display_name: 'Voces de Venezuela', handle: 'HastaLaFinal', text: 'Las voces llegan esta noche... Voices arrive tonight...', avatar_url: null, isHero: true },
    { display_name: '🇻🇪', handle: 'Venezuela', text: 'Preparados para la historia. Ready to make history.', avatar_url: null },
    { display_name: '⚾', handle: 'WBC2026', text: 'Esta noche se escribe un nuevo capítulo. Tonight, a new chapter is written.', avatar_url: null },
    { display_name: '🌎', handle: 'Diaspora', text: 'Desde cada rincón del mundo. From every corner of the world.', avatar_url: null },
  ];

  async function fetchTweets() {
    try {
      const res = await fetch('/api/tweets/approved');
      if (!res.ok) throw new Error('API error');
      const tweets = await res.json();
      return tweets.length > 0 ? tweets : PLACEHOLDER_TWEETS;
    } catch {
      return PLACEHOLDER_TWEETS;
    }
  }

  function renderTweet(tweet, index) {
    const isHero = tweet.isHero || index < 3;
    const card = document.createElement('div');
    card.className = `tweet-card ${isHero && index === 0 ? 'tweet-card--hero' : ''}`;
    card.innerHTML = `
      <div class="tweet-card__header">
        ${tweet.avatar_url ? `<img src="${tweet.avatar_url}" alt="" class="tweet-card__avatar">` : '<div class="tweet-card__avatar-placeholder"></div>'}
        <div>
          <span class="tweet-card__name">${tweet.display_name}</span>
          <span class="tweet-card__handle">@${tweet.handle}</span>
        </div>
      </div>
      <p class="tweet-card__text">${tweet.text}</p>
      ${tweet.tweet_id ? `<a href="https://x.com/i/status/${tweet.tweet_id}" target="_blank" rel="noopener" class="tweet-card__link">View on X →</a>` : ''}
    `;
    return card;
  }

  async function init() {
    const tweets = await fetchTweets();
    grid.innerHTML = '';
    tweets.forEach((tweet, i) => {
      grid.appendChild(renderTweet(tweet, i));
    });

    // GSAP staggered reveal
    if (typeof gsap !== 'undefined') {
      gsap.from('.tweet-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#voces',
          start: 'top 75%',
        },
      });
    }
  }

  // Init on load, refresh every 30s
  init();
  setInterval(init, 30000);
})();
```

**Step 4: Create `admin.html`**

Simple admin page with:
- Dark background matching site
- Password input at top (checks against `/api/tweets/approve` with GET)
- Two columns: Pending (left) + Approved (right)
- Each pending card: avatar, name, handle, text, Approve (green) + Reject (red) buttons
- Auto-refreshes pending list every 15 seconds
- Counter: "X pending · Y approved"
- "Fetch New Tweets" button that calls POST `/api/tweets/fetch`

**Step 5: Create `js/admin.js`**

Admin page logic:
- Password stored in sessionStorage after first entry
- `fetchPending()`: GET `/api/tweets/approve` with password header
- `approveTweet(id)` / `rejectTweet(id)`: POST `/api/tweets/approve`
- `fetchNewTweets()`: POST `/api/tweets/fetch`
- Auto-refresh with setInterval
- Simple, functional — does not need to be beautiful

**Step 6: Verify admin page**

Open `/admin` in browser. Expected: password prompt, then pending/approved columns, buttons work.

**Step 7: Commit**

```bash
git add admin.html js/admin.js js/tweets.js index.html css/globals.css
git commit -m "feat: tweet display + admin approval queue"
```

---

## Task 8: Footer (Track A)

**Files:**
- Modify: `index.html` — fill `<footer>`
- Modify: `css/globals.css` — footer styles

**Step 1: Add Footer HTML**

```html
<footer id="footer" class="section" style="background: var(--bg);">
  <div class="footer-inner">
    <div class="ven-divider" style="width: 60px; margin: 0 auto 1.5rem;"></div>
    <h3 class="font-display footer-title">Venezuela Siempre</h3>
    <p class="footer-sub">Hecho con orgullo · Made with pride · WBC 2026</p>
  </div>
</footer>
```

**Step 2: Add Footer CSS**

- `.footer-inner`: `text-align: center; padding: 4rem 2rem;`
- `.footer-title`: `color: var(--gold); font-size: clamp(2rem, 5vw, 3rem);`
- `.footer-sub`: `color: var(--muted); font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 0.75rem;`

**Step 3: Commit**

```bash
git add index.html css/globals.css
git commit -m "feat: footer — Venezuela Siempre"
```

---

## Task 9: El Latido Timeline (Track D — Independent)

**Files:**
- Create: `js/timeline.js`
- Modify: `index.html` — ensure `#el-latido` has proper structure
- Modify: `css/globals.css` — timeline styles

**Step 1: Add El Latido HTML to `index.html`**

Inside `<div id="el-latido">`:
```html
<div class="section-inner">
  <p class="section-label">El Latido / The Heartbeat</p>
  <h2 class="font-display latido-heading">El Latido del Torneo</h2>
</div>
<div class="latido-track-wrapper">
  <div class="latido-track" id="latido-track">
    <div class="latido-line"></div>
    <!-- 9 pulse points -->
    <div class="latido-moment" data-accent="red">
      <div class="latido-dot"></div>
      <h3 class="latido-moment__title font-display">Venezuela Llega</h3>
      <p class="latido-moment__es font-serif"><em>Por primera vez, el mundo nos toma en serio.</em></p>
      <p class="latido-moment__en">For the first time, the world takes us seriously.</p>
    </div>
    <!-- ... repeat for all 9 moments with data from design doc ... -->
    <!-- Moments 4, 8, 9 get class .latido-moment--hero for oversized treatment -->
    <!-- Moment 9 gets class .latido-moment--tonight for pulsing gold -->
  </div>
</div>
```

Include all 9 moments with full bilingual copy from design doc.

**Step 2: Add Timeline CSS**

- `.latido-track-wrapper`: `overflow: hidden; position: relative;` — this is the pinned container
- `.latido-track`: `display: flex; gap: 0; align-items: flex-start; padding: 4rem 2rem; width: max-content;`
- `.latido-line`: `position: absolute; top: 50%; left: 0; height: 2px; background: var(--red); width: 0;` (animated to 100%)
- `.latido-moment`: `flex: 0 0 clamp(280px, 30vw, 400px); padding: 2rem; text-align: center; position: relative;`
- `.latido-moment--hero`: `flex: 0 0 clamp(350px, 40vw, 500px);`
- `.latido-moment--hero .latido-moment__title`: `font-size: clamp(2rem, 4vw, 3rem); color: var(--gold);`
- `.latido-dot`: `width: 16px; height: 16px; border-radius: 50%; margin: 0 auto 1rem;`
- `[data-accent="red"] .latido-dot`: `background: var(--red);`
- `[data-accent="gold"] .latido-dot`: `background: var(--gold);`
- `[data-accent="blue"] .latido-dot`: `background: var(--blue);`
- `.latido-moment--tonight .latido-dot`: `animation: pulse-gold 2s infinite; box-shadow: 0 0 20px var(--gold);`
- `.latido-moment__title`: `font-size: clamp(1.2rem, 2.5vw, 1.8rem); color: var(--white);`
- `.latido-moment__es`: `color: var(--white); font-size: 0.95rem; margin-top: 0.5rem;`
- `.latido-moment__en`: `color: var(--muted); font-size: 0.85rem;`
- Mobile (`@media (max-width: 640px)`): `.latido-track` becomes `flex-direction: column; width: 100%;` and `.latido-line` becomes vertical

**Step 3: Create `js/timeline.js`**

```javascript
(function() {
  const wrapper = document.querySelector('.latido-track-wrapper');
  const track = document.getElementById('latido-track');
  if (!wrapper || !track || typeof gsap === 'undefined') return;

  // Skip horizontal scroll on mobile
  if (window.innerWidth <= 640) {
    // Vertical: just fade in moments on scroll
    gsap.from('.latido-moment', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '#el-latido',
        start: 'top 70%',
      },
    });
    return;
  }

  // Horizontal scroll
  const totalScroll = track.scrollWidth - wrapper.offsetWidth;

  gsap.to(track, {
    x: -totalScroll,
    ease: 'none',
    scrollTrigger: {
      trigger: wrapper,
      start: 'top top',
      end: () => `+=${totalScroll}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
    },
  });

  // Red line draws as you scroll
  gsap.to('.latido-line', {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: wrapper,
      start: 'top top',
      end: () => `+=${totalScroll}`,
      scrub: 1,
    },
  });

  // Moments fade in as they enter viewport
  document.querySelectorAll('.latido-moment').forEach((moment, i) => {
    gsap.from(moment, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      scrollTrigger: {
        trigger: moment,
        containerAnimation: gsap.getById?.('latido-scroll'), // fallback
        start: 'left 80%',
        toggleActions: 'play none none none',
      },
    });
  });
})();
```

**Step 4: Verify in browser**

Expected: Horizontal scrolling timeline on desktop, vertical on mobile. Red line draws progressively. Moments stagger in. Final "ESTA NOCHE" pulses gold.

**Step 5: Commit**

```bash
git add js/timeline.js index.html css/globals.css
git commit -m "feat: El Latido timeline — horizontal scroll heartbeat"
```

---

## Task 10: Final Orchestration, Polish, and Deploy

**Files:**
- Modify: `js/main.js` — finalize full GSAP ScrollTrigger orchestration
- Modify: `css/globals.css` — responsive polish, transitions between sections
- Modify: `index.html` — final content checks, OG meta tags
- Verify all sections work together

**Step 1: Finalize GSAP orchestration in `js/main.js`**

Ensure the full scroll sequence flows:
1. Hero → parallax out
2. La Ruta → cards stagger in
3. El Lineup → player cards reveal, quote fades in
4. Globe → pins, cities ignite, arcs draw, counter counts up
5. Voces → tweets fade in alongside globe (or after)
6. El Latido → horizontal scroll timeline
7. Footer → simple fade in

Add smooth transitions between sections (opacity fades, subtle Y translations).

**Step 2: Section transitions CSS**

Add subtle dividers between sections — either ven-divider elements or gradient fades from one background to the next.

**Step 3: Responsive audit**

- Test at 375px, 640px, 1024px, 1440px
- Ensure all grids collapse properly
- Globe is auto-rotate only on mobile (disable OrbitControls drag)
- Touch targets >= 44px
- Flip cards work on tap (mobile)
- Timeline is vertical on mobile

**Step 4: Performance check**

- Three.js globe lazy loads (only init when section enters viewport)
- Tweets fetch after initial paint
- Images/textures are optimized
- No layout shift from dynamic content

**Step 5: Final content check**

- All bilingual copy is present (ES leads, EN follows)
- All player data matches design doc
- All journey card data is correct
- Timeline moments are complete
- Footer copy is correct

**Step 6: Deploy to Vercel**

```bash
npx vercel --prod
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `X_API_BEARER_TOKEN`
- `ADMIN_PASSWORD`

**Step 7: Final commit**

```bash
git add -A
git commit -m "feat: final orchestration, polish, and deploy config"
```

---

## Supabase Setup (Manual — Do Before Task 6)

Run this SQL in Supabase dashboard:

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
