/* ===== main.js — GSAP Animation Orchestrator ===== */
/* Hasta la Final — Venezuela WBC 2026 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Register GSAP plugins ---
  gsap.registerPlugin(ScrollTrigger);

  // --- Lenis smooth scroll ---
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // =========================================================
  // 1. HERO TEXT REVEAL — stagger fade-up for each word
  // =========================================================
  gsap.from('.hero-word', {
    opacity: 0,
    y: 40,
    duration: 1,
    stagger: 0.25,
    ease: 'power3.out',
    delay: 0.3
  });

  // Hero entrance animation for other elements
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.2 });
  heroTl
    .from('.hero-meta', { opacity: 0, y: 15, duration: 0.8 })
    .from('.stars-arch svg', { opacity: 0, y: 10, duration: 0.4, stagger: 0.05 }, '-=0.4')
    .from('.matchup-badge', { opacity: 0, x: 20, duration: 0.8 }, '-=0.6')
    .from('.hero-scroll-cue', { opacity: 0, duration: 1 }, '-=0.3');

  // =========================================================
  // 2. HERO PARALLAX — reflection follows scroll
  // =========================================================
  gsap.to('.hero-reflection', {
    y: window.innerHeight * 0.4,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // =========================================================
  // 3. SECTION HEADERS — slide in from left with reveal
  // =========================================================
  document.querySelectorAll('.section-header, .section h2, .section-title').forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      x: -30,
      opacity: 0.3,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // =========================================================
  // 4. LA RUTA — staggered card reveal (min opacity 0.5!)
  // =========================================================
  const journeyGrid = document.querySelector('.journey-grid');
  if (journeyGrid) {
    gsap.from('.journey-card', {
      scrollTrigger: {
        trigger: '.journey-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      scale: 0.95,
      opacity: 0.5,
      y: 20,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power2.out'
    });
  }

  // =========================================================
  // 5. EL LINEUP — staggered player card reveal (min opacity 0.5!)
  // =========================================================
  const playerGrid = document.querySelector('.player-grid');
  if (playerGrid) {
    gsap.from('.player-card', {
      scrollTrigger: {
        trigger: '.player-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      scale: 0.9,
      opacity: 0.5,
      y: 30,
      stagger: 0.1,
      duration: 0.5,
      ease: 'back.out(1.2)'
    });
  }

  // =========================================================
  // 6. LINEUP QUOTE — fade in from left
  // =========================================================
  gsap.from('.lineup-quote', {
    x: -30,
    opacity: 0.3,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.lineup-quote',
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  });

  // =========================================================
  // 7. VOCES QUOTES — alternating slide from left/right
  // =========================================================
  document.querySelectorAll('.tweet-card, .voice-card').forEach((tweet, i) => {
    const fromX = i % 2 === 0 ? -40 : 40;
    gsap.from(tweet, {
      scrollTrigger: {
        trigger: tweet,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      x: fromX,
      opacity: 0.3,
      duration: 0.7,
      ease: 'power2.out'
    });
  });

  // =========================================================
  // 8. CINEMATIC DIVIDER PARALLAX — scrub image on scroll
  // =========================================================
  document.querySelectorAll('.cinematic-divider').forEach(div => {
    const img = div.querySelector('.cinematic-divider__img') || div;
    gsap.to(img, {
      scrollTrigger: {
        trigger: div,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -50,
      ease: 'none'
    });
  });

  // =========================================================
  // 9. DIASPORA COUNTER — handled by globe.js (no duplicate here)
  // =========================================================

  // =========================================================
  // 10. VENEZUELAN DIVIDER ANIMATIONS — draw in from width:0
  // =========================================================
  gsap.utils.toArray('.ven-divider').forEach((divider) => {
    gsap.from(divider, {
      width: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: divider,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // =========================================================
  // 11. BULLPEN CARDS — staggered fade up
  // =========================================================
  const bullpenGrid = document.querySelector('.bullpen-grid');
  if (bullpenGrid) {
    gsap.from('.bullpen-card', {
      scrollTrigger: {
        trigger: '.bullpen-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 20,
      opacity: 0.4,
      stagger: 0.08,
      duration: 0.5,
      ease: 'power2.out'
    });
  }

  // 12. LATIDO MOMENTS — handled by timeline.js (removed duplicate)

  // =========================================================
  // 13. CLOSING SECTION — dramatic entrance
  // =========================================================
  const closingPoster = document.querySelector('.closing__poster');
  if (closingPoster) {
    gsap.from(closingPoster, {
      scrollTrigger: {
        trigger: closingPoster,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      scale: 0.9,
      opacity: 0.3,
      duration: 1,
      ease: 'power2.out'
    });
  }

  const closingTitle = document.querySelector('.closing__title');
  if (closingTitle) {
    gsap.from(closingTitle, {
      scrollTrigger: {
        trigger: closingTitle,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0.3,
      duration: 1,
      ease: 'power2.out'
    });
  }

});
