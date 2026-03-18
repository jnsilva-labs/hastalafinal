/**
 * celebrations.js — EPIC victory celebration effects
 * Venezuela WBC 2026 World Champions
 * Vanilla JS + GSAP (global). No ES modules.
 */
(function () {
  'use strict';

  var isMobile = window.innerWidth < 768;
  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initConfetti();
    initFloatingFlags();
    initSparkles();
    if (!isTouchDevice) {
      initArepaTrail();
    }
    setTimeout(initFirework, 1500);
  }

  /* =========================================================================
     1. CONFETTI CANNON
     ========================================================================= */
  function initConfetti() {
    var canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:998;pointer-events:none;';
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var W, H;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var COLORS = ['#F4C430', '#CF142B', '#1a3a8f', '#FFFFFF'];
    var SHAPES = ['rect', 'circle', 'star'];
    var particles = [];
    var maxParticles = isMobile ? 150 : 280;
    var animId = null;
    var startTime = 0;
    var DURATION = 6000; // ms total animation life

    function createParticle(originX, originY, spread) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 4 + Math.random() * 8;
      return {
        x: originX + (Math.random() - 0.5) * spread,
        y: originY + (Math.random() - 0.5) * (spread * 0.3),
        vx: Math.cos(angle) * speed * (0.5 + Math.random()),
        vy: -Math.abs(Math.sin(angle) * speed) - Math.random() * 4,
        size: 3 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.12 + Math.random() * 0.08,
        wind: (Math.random() - 0.5) * 0.5,
        opacity: 1,
        life: 0,
        maxLife: 3000 + Math.random() * 3000
      };
    }

    function burst(originX, originY, count, spread) {
      for (var i = 0; i < count; i++) {
        particles.push(createParticle(originX, originY, spread));
      }
    }

    function drawStar(ctx, cx, cy, size, rotation) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.beginPath();
      for (var i = 0; i < 5; i++) {
        var outerAngle = ((i * 72 - 90) * Math.PI) / 180;
        var innerAngle = (((i * 72 + 36) - 90) * Math.PI) / 180;
        var outerR = size;
        var innerR = size * 0.4;
        if (i === 0) {
          ctx.moveTo(Math.cos(outerAngle) * outerR, Math.sin(outerAngle) * outerR);
        } else {
          ctx.lineTo(Math.cos(outerAngle) * outerR, Math.sin(outerAngle) * outerR);
        }
        ctx.lineTo(Math.cos(innerAngle) * innerR, Math.sin(innerAngle) * innerR);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, W, H);

      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.life += 16;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx += p.wind;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;

        // Fade out in last 40% of life
        var lifeFrac = p.life / p.maxLife;
        if (lifeFrac > 0.6) {
          p.opacity = Math.max(0, 1 - (lifeFrac - 0.6) / 0.4);
        }

        if (p.life > p.maxLife || p.y > H + 50) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6);
          ctx.restore();
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'star') {
          drawStar(ctx, p.x, p.y, p.size * 0.6, p.rotation);
        }
      }

      ctx.globalAlpha = 1;

      if (particles.length > 0 && elapsed < DURATION + 4000) {
        animId = requestAnimationFrame(animate);
      } else {
        // Cleanup
        cancelAnimationFrame(animId);
        canvas.remove();
        window.removeEventListener('resize', resize);
      }
    }

    // Initial big burst
    burst(W * 0.3, H * 0.2, Math.floor(maxParticles * 0.4), W * 0.3);
    burst(W * 0.7, H * 0.15, Math.floor(maxParticles * 0.35), W * 0.3);
    burst(W * 0.5, H * 0.1, Math.floor(maxParticles * 0.25), W * 0.4);

    animId = requestAnimationFrame(animate);

    // Second burst when scrolling past hero
    var heroSection = document.getElementById('hero');
    var secondBurstFired = false;
    if (heroSection) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting && !secondBurstFired) {
              secondBurstFired = true;
              observer.disconnect();

              // Re-create canvas if it was removed
              var c = document.getElementById('confetti-canvas');
              if (!c) {
                c = document.createElement('canvas');
                c.id = 'confetti-canvas';
                c.style.cssText =
                  'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:998;pointer-events:none;';
                document.body.appendChild(c);
                ctx = c.getContext('2d');
                canvas = c;
                resize();
              }

              var smallCount = isMobile ? 60 : 120;
              burst(W * 0.5, 0, smallCount, W * 0.6);
              startTime = 0;
              DURATION = 4000;
              animId = requestAnimationFrame(animate);
            }
          });
        },
        { threshold: 0 }
      );
      observer.observe(heroSection);
    }
  }

  /* =========================================================================
     2. AREPA MOUSE TRAIL
     ========================================================================= */
  function initArepaTrail() {
    var lastTime = 0;
    var THROTTLE = 50; // ms

    document.addEventListener('mousemove', function (e) {
      var now = Date.now();
      if (now - lastTime < THROTTLE) return;
      lastTime = now;

      var el = document.createElement('div');
      el.textContent = '\uD83E\uDED3'; // arepa emoji
      el.style.cssText =
        'position:fixed;pointer-events:none;z-index:997;font-size:20px;' +
        'left:' + e.clientX + 'px;top:' + e.clientY + 'px;' +
        'transform:translate(-50%,-50%);user-select:none;';
      document.body.appendChild(el);

      // Use GSAP if available, otherwise CSS fallback
      if (window.gsap) {
        gsap.to(el, {
          y: 40 + Math.random() * 30,
          x: (Math.random() - 0.5) * 20,
          opacity: 0,
          scale: 0,
          duration: 1,
          ease: 'power2.out',
          onComplete: function () {
            if (el.parentNode) el.parentNode.removeChild(el);
          }
        });
      } else {
        // Pure CSS fallback
        el.style.transition = 'all 1s ease-out';
        requestAnimationFrame(function () {
          el.style.opacity = '0';
          el.style.transform = 'translate(-50%, 30px) scale(0)';
        });
        setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 1100);
      }
    });
  }

  /* =========================================================================
     3. FLOATING VENEZUELA FLAGS
     ========================================================================= */
  function initFloatingFlags() {
    var container = document.createElement('div');
    container.id = 'floating-flags';
    container.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:50;pointer-events:none;overflow:hidden;';
    document.body.appendChild(container);

    var FLAG_COUNT = isMobile ? 4 : 10;

    for (var i = 0; i < FLAG_COUNT; i++) {
      createFlag(container, i, FLAG_COUNT);
    }
  }

  function createFlag(container, index, total) {
    var flag = document.createElement('div');
    flag.textContent = '\uD83C\uDDFB\uD83C\uDDEA'; // Venezuela flag emoji
    flag.style.cssText =
      'position:absolute;font-size:24px;opacity:0.4;user-select:none;pointer-events:none;';

    var x = 5 + Math.random() * 90; // % from left
    var duration = 12 + Math.random() * 10; // seconds to float up
    var swayAmp = 15 + Math.random() * 25; // px horizontal sway
    var swaySpeed = 2 + Math.random() * 3; // sway cycle seconds
    var delay = (index / total) * duration; // stagger start

    flag.style.left = x + '%';
    flag.style.bottom = '-40px';
    container.appendChild(flag);

    function animateFlag() {
      // Reset to bottom
      flag.style.bottom = '-40px';
      flag.style.opacity = '0.4';

      var startBottom = -40;
      var targetBottom = window.innerHeight + 40;
      var startTime = null;
      var durationMs = duration * 1000;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / durationMs, 1);

        // Linear rise
        var currentBottom = startBottom + progress * (targetBottom - startBottom);
        // Sine sway
        var sway = Math.sin(((elapsed / 1000) / swaySpeed) * Math.PI * 2) * swayAmp;

        flag.style.bottom = currentBottom + 'px';
        flag.style.transform = 'translateX(' + sway + 'px)';

        // Fade in at start, fade out at top
        if (progress < 0.1) {
          flag.style.opacity = (progress / 0.1) * 0.4;
        } else if (progress > 0.85) {
          flag.style.opacity = ((1 - progress) / 0.15) * 0.4;
        } else {
          flag.style.opacity = '0.4';
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // Loop: restart
          animateFlag();
        }
      }

      requestAnimationFrame(step);
    }

    // Stagger start
    setTimeout(animateFlag, delay * 1000);
  }

  /* =========================================================================
     4. GOLDEN SPARKLES (CSS-only around CAMPEONES)
     ========================================================================= */
  function initSparkles() {
    var heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    // Make hero-content the positioning parent if not already
    var pos = window.getComputedStyle(heroContent).position;
    if (pos === 'static') heroContent.style.position = 'relative';

    var SPARKLE_COUNT = isMobile ? 10 : 20;

    // Inject keyframes once
    var styleEl = document.createElement('style');
    styleEl.textContent =
      '@keyframes sparkle-twinkle{' +
        '0%,100%{opacity:0;transform:scale(0) rotate(0deg);}' +
        '50%{opacity:1;transform:scale(1) rotate(180deg);}' +
      '}' +
      '.celebration-sparkle{' +
        'position:absolute;width:4px;height:4px;border-radius:50%;' +
        'background:radial-gradient(circle,#F4C430 0%,#e6b800 40%,transparent 70%);' +
        'box-shadow:0 0 6px 2px rgba(244,196,48,0.6);' +
        'pointer-events:none;z-index:5;' +
        'animation:sparkle-twinkle 2s ease-in-out infinite;' +
      '}';
    document.head.appendChild(styleEl);

    for (var i = 0; i < SPARKLE_COUNT; i++) {
      var sparkle = document.createElement('div');
      sparkle.className = 'celebration-sparkle';
      sparkle.style.left = (5 + Math.random() * 90) + '%';
      sparkle.style.top = (5 + Math.random() * 90) + '%';
      sparkle.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
      sparkle.style.animationDuration = (1.5 + Math.random() * 2).toFixed(2) + 's';

      // Vary size slightly
      var size = 3 + Math.random() * 4;
      sparkle.style.width = size + 'px';
      sparkle.style.height = size + 'px';

      heroContent.appendChild(sparkle);
    }

    // Auto-remove sparkles after 20 seconds to reduce ongoing DOM nodes
    setTimeout(function () {
      var sparkles = heroContent.querySelectorAll('.celebration-sparkle');
      sparkles.forEach(function (s) {
        if (window.gsap) {
          gsap.to(s, {
            opacity: 0,
            duration: 1,
            onComplete: function () {
              if (s.parentNode) s.parentNode.removeChild(s);
            }
          });
        } else {
          s.style.transition = 'opacity 1s';
          s.style.opacity = '0';
          setTimeout(function () {
            if (s.parentNode) s.parentNode.removeChild(s);
          }, 1100);
        }
      });
    }, 20000);
  }

  /* =========================================================================
     5. VICTORY FIREWORK BURST
     ========================================================================= */
  function initFirework() {
    var heroSection = document.getElementById('hero');
    if (!heroSection) return;

    var canvas = document.getElementById('confetti-canvas');
    var ownCanvas = false;

    // Create or reuse canvas
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'firework-canvas';
      canvas.style.cssText =
        'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:998;pointer-events:none;';
      document.body.appendChild(canvas);
      ownCanvas = true;
    }

    var ctx = canvas.getContext('2d');
    var W = (canvas.width = window.innerWidth);
    var H = (canvas.height = window.innerHeight);

    // Center of hero
    var rect = heroSection.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height * 0.4;

    var particles = [];
    var PARTICLE_COUNT = isMobile ? 60 : 120;
    var COLORS = ['#F4C430', '#e6b800', '#FFD700', '#FFFFFF', '#CF142B'];

    // Create explosion particles
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.3;
      var speed = 3 + Math.random() * 7;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 1,
        life: 0,
        maxLife: 1200 + Math.random() * 800,
        trail: []
      });
    }

    var startTime = 0;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;

      // Don't clear if sharing canvas with confetti — use separate compositing
      if (ownCanvas) {
        ctx.clearRect(0, 0, W, H);
      }

      var alive = false;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.life += 16;
        if (p.life > p.maxLife) continue;
        alive = true;

        // Store trail position
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // slight gravity
        p.vx *= 0.98; // friction
        p.vy *= 0.98;

        var lifeFrac = p.life / p.maxLife;
        p.opacity = lifeFrac > 0.4 ? Math.max(0, 1 - (lifeFrac - 0.4) / 0.6) : 1;

        // Draw trail
        for (var t = 0; t < p.trail.length; t++) {
          var trailOpacity = (t / p.trail.length) * p.opacity * 0.3;
          ctx.globalAlpha = trailOpacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.trail[t].x, p.trail[t].y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw particle
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;

      if (alive && elapsed < 3000) {
        requestAnimationFrame(animate);
      } else {
        // Cleanup
        if (ownCanvas && canvas.parentNode) {
          canvas.remove();
        }
      }
    }

    requestAnimationFrame(animate);
  }
})();
