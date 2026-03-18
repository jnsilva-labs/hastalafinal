/* ===== timeline.js — El Latido Vertical Timeline ===== */
/* Hasta la Final — Venezuela WBC 2026 */

(function () {
  'use strict';

  var track = document.getElementById('latido-track');
  if (!track || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  var moments = gsap.utils.toArray('.latido-moment');
  var line = track.querySelector('.latido-line');

  // --- Tricolor gradient line draws as you scroll through the section ---
  if (line) {
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

  // --- Each moment fades in from its side (odd=left, even=right) ---
  // CSS nth-child is 1-based but includes the .latido-line as child 1,
  // so .latido-moment elements start at child 2.
  // We use the DOM index among .latido-moment siblings instead.
  moments.forEach(function (moment, i) {
    var isChampion = moment.classList.contains('latido-moment--champion');
    // i is 0-based among .latido-moment elements:
    // i=0,2,4,6,8 → left side (fade from -40)
    // i=1,3,5,7   → right side (fade from +40)
    var isRightSide = (i % 2 === 1);
    var xFrom = isChampion ? 0 : (isRightSide ? 40 : -40);

    gsap.from(moment, {
      opacity: 0,
      x: xFrom,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: moment,
        start: 'top 85%',
        once: true
      }
    });

    // Dot pops in
    var dot = moment.querySelector('.latido-dot');
    if (dot) {
      gsap.from(dot, {
        scale: 0,
        duration: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: moment,
          start: 'top 85%',
          once: true
        }
      });
    }

    // Photos scale in slightly
    var photo = moment.querySelector('.latido-moment__photo');
    if (photo) {
      gsap.from(photo, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: moment,
          start: 'top 80%',
          once: true
        }
      });
    }

    // Score badges fade up
    var score = moment.querySelector('.latido-moment__score');
    if (score) {
      gsap.from(score, {
        y: 10,
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: moment,
          start: 'top 80%',
          once: true
        }
      });
    }
  });
})();
