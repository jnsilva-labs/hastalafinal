(function() {
  var canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;';
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var colors = ['#F4C430', '#1a3a8f', '#CF142B', '#FFE066', '#FFFFFF'];
  var confetti = [];
  var NUM_CONFETTI = 200;

  for (var i = 0; i < NUM_CONFETTI; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height,
      w: 4 + Math.random() * 6,
      h: 8 + Math.random() * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  var frame = 0;
  var maxFrames = 300; // ~5 seconds at 60fps

  function animate() {
    if (frame > maxFrames) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var fadeStart = maxFrames * 0.7;

    for (var i = 0; i < confetti.length; i++) {
      var c = confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.05; // gravity
      c.vx *= 0.99; // air resistance
      c.rotation += c.rotationSpeed;

      if (frame > fadeStart) {
        c.opacity = Math.max(0, 1 - (frame - fadeStart) / (maxFrames - fadeStart));
      }

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation * Math.PI / 180);
      ctx.globalAlpha = c.opacity;
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    }

    frame++;
    requestAnimationFrame(animate);
  }

  // Start after a brief delay for page load
  setTimeout(animate, 500);

  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
})();
