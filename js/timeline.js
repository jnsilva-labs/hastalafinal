/* ===== timeline.js — El Latido Vertical Timeline ===== */
/* Hasta la Final — Venezuela WBC 2026 */

(function () {
  'use strict';

  var track = document.getElementById('latido-track');
  if (!track || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  var isMobile = window.innerWidth <= 768;
  var moments = gsap.utils.toArray('.latido-moment');
  var line = track.querySelector('.latido-line');

  // --- Tricolor gradient line draws as you scroll through the section ---
  if (line) {
    if (isMobile) {
      // On mobile just show the full line immediately
      line.style.height = '100%';
    } else {
      gsap.set(line, { height: 0 });
      gsap.to(line, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1
        }
      });
    }
  }

  // On mobile: kill ALL GSAP animations on timeline elements after a delay
  // (to ensure main.js and other scripts have finished setting up their tweens)
  if (isMobile) {
    // Run cleanup multiple times to catch late-loading GSAP tweens from other scripts
    [100, 500, 1500].forEach(function(delay) {
      setTimeout(function() {
        moments.forEach(function(m) {
          gsap.killTweensOf(m);
          m.removeAttribute('style');
          var els = m.querySelectorAll('.latido-dot, .latido-moment__photo, .latido-moment__score');
          els.forEach(function(el) { gsap.killTweensOf(el); el.removeAttribute('style'); });
        });
      }, delay);
    });
    return; // Skip all animation setup on mobile
  }

  moments.forEach(function (moment, i) {
    var isChampion = moment.classList.contains('latido-moment--champion');
    var isRightSide = (i % 2 === 1);
    var xFrom = isChampion ? 0 : (isRightSide ? 40 : -40);

    // Desktop: animated reveal
    moment.style.opacity = '0.4';
    moment.style.transform = 'translateX(' + xFrom + 'px)';
    gsap.to(moment, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: moment,
        start: 'top 92%',
        once: true
      }
    });

    var dot = moment.querySelector('.latido-dot');
    if (dot) {
      dot.style.transform = 'scale(0)';
      gsap.to(dot, {
        scale: 1,
        duration: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: moment,
          start: 'top 92%',
          once: true
        }
      });
    }

    var photo = moment.querySelector('.latido-moment__photo');
    if (photo) {
      photo.style.opacity = '0.4';
      photo.style.transform = 'scale(0.85)';
      gsap.to(photo, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: moment,
          start: 'top 92%',
          once: true
        }
      });
    }

    var score = moment.querySelector('.latido-moment__score');
    if (score) {
      score.style.opacity = '0.4';
      score.style.transform = 'translateY(10px)';
      gsap.to(score, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: moment,
          start: 'top 92%',
          once: true
        }
      });
    }
  });
})();
