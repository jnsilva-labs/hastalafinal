# Globe v2 + Full Page Polish — Design Doc

## Date: 2026-03-18
## Status: Approved

---

## 1. Globe: "La Diáspora Iluminada"

### Point Density Strategy (~800-1000 total points)

**Tier 1 — Venezuela (THE BLAZE):** 150+ red (#CF142B) points covering every state.
- Caracas cluster: 30 scatter points in gaussian radius
- Maracaibo, Valencia, Barquisimeto: 15-20 each
- Smaller cities (Mérida, Ciudad Bolívar, Puerto La Cruz, etc.): 5-10 each
- The country should look like it's literally on fire

**Tier 2 — Major hubs (30K+):** 15-40 gold scatter points per city
- Bogotá (40), Lima (35), Miami (35), Santiago (25), Madrid (25)
- Houston (20), NYC (15), Buenos Aires (15), etc.

**Tier 3 — Medium cities (5K-30K):** 5-10 scatter points per city
- Toronto, London, Rome, São Paulo, Barcelona, etc.

**Tier 4 — Lonely lights (200-5K):** 1-3 bright dots in unexpected places
- Africa: Lagos, Nairobi, Cape Town, Johannesburg, Cairo, Accra, Dakar, Casablanca, Addis Ababa, Tunis, Dar es Salaam
- Asia: Tokyo, Seoul, Mumbai, Bangkok, Singapore, Shanghai, Beijing, Hong Kong, Manila, Jakarta, Taipei, Ho Chi Minh City, Hanoi, Kuala Lumpur
- Middle East: Dubai, Doha, Riyadh, Beirut, Amman, Tel Aviv
- Other: Moscow, St. Petersburg, Tbilisi, Almaty, Reykjavik, Honolulu, Anchorage, Perth, Brisbane
- These get LARGER radius (0.3-0.4) despite small population — visual presence matters

**Tier 5 — Trail dust:** 80-100 random faint points
- Scattered along migration corridors (Caracas→Bogotá, Caracas→Miami, Caracas→Madrid)
- Very dim (0.2 opacity), tiny radius (0.1)
- Creates visual "paths" of migration

### Arc Upgrades
- Arcs from ALL tier 2+3 cities (not just 30K+)
- Brighter strokes: 0.5-1.2 width
- Faster dash animation: 1500-3000ms
- Color: gold-to-red gradient

### Venezuela Polygon
- Cap opacity: 0.6
- Altitude: 0.03 (raised surface, more prominent)
- Side color: bright red
- Pulsing glow animation

### Counter
- "7,700,000+" — the plus matters

### Scroll-Driven Camera (restored)
- Start: Close on Caracas (altitude 0.5)
- Pull back: South America visible (altitude 1.8)
- Rotate: North America, show Miami hub (lat 30, lng -85, altitude 2.2)
- Pan: Europe, show Madrid/Barcelona (lat 42, lng 5, altitude 2.5)
- Full globe: Atlantic view (lat 20, lng -40, altitude 3.0)
- NO pinning — just smooth transitions on scroll

---

## 2. Full Page Polish Pass

### Restore Lost GSAP Animations
- Staggered card reveals on La Ruta (without opacity:0 bug)
- Player card entrance animations
- Section header slide-in animations
- Parallax on cinematic divider photos
- Quote fade-up animations in Voces

### Visual Enhancements
- Tricolor hover glow on La Ruta cards (from Variant design)
- Better card backgrounds — glassmorphism with backdrop-blur
- Section transitions — tricolor gradient dividers between major sections
- Typography polish — ensure Bebas Neue, Libre Baskerville, Plus Jakarta Sans all loading

### Celebration Effects (Victory Mode)
- Confetti burst on page load (tricolor particles)
- 🇻🇪 emoji flags floating continuously
- Gold shimmer on "CAMPEONES" text
- Victory photo (victory.jpg) prominently placed

---

## 3. Implementation Plan

### Agent 1: Globe Overhaul
- Rewrite globe.js with 800+ points across all 5 tiers
- Venezuela polygon with glow
- Restored scroll camera
- Enhanced arcs

### Agent 2: GSAP Animation Restoration
- Fix all scroll-triggered animations
- Add tricolor hover effects
- Section entrance animations
- Parallax on photos

### Agent 3: Victory Celebration Effects
- Confetti system
- Floating flag emojis
- Gold shimmer CSS
- Wire in victory.jpg and CHAMPIONS.jpeg
