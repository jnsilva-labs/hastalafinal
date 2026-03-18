/**
 * Tricolor background particle field
 * Fixed full-viewport canvas behind all content.
 * Uses Three.js (already loaded by globe.gl).
 * Gold / Red / Blue particles in a spherical distribution
 * with mouse-reactive parallax camera movement.
 */
(function () {
  'use strict';

  // Bail if Three.js isn't available (globe.gl loads it)
  if (typeof THREE === 'undefined') return;

  /* ---- Container ---- */
  const container = document.getElementById('particles-bg');
  if (!container) return;

  /* ---- Scene ---- */
  const scene = new THREE.Scene();

  /* ---- Camera ---- */
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 50;

  /* ---- Renderer ---- */
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  /* ---- Particles ---- */
  const PARTICLE_COUNT = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);

  const colorGold = new THREE.Color('#F4C430');
  const colorRed = new THREE.Color('#CF142B');
  const colorBlue = new THREE.Color('#1a3a8f');

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    // Push particles further back — radius 50-120, camera at z=50
    // Most particles sit behind and around the camera for depth
    const r = 50 + Math.random() * 70;
    const theta = Math.PI * 2 * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);

    // Tricolor distribution: 50% gold, 20% blue, 30% red
    const rand = Math.random();
    let c;
    if (rand > 0.8) c = colorRed;
    else if (rand > 0.6) c = colorBlue;
    else c = colorGold;

    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;

    sizes[i] = 0.2 + Math.random() * 0.4;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const mesh = new THREE.Points(geometry, material);
  scene.add(mesh);

  /* ---- Mouse tracking ---- */
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  /* ---- Animation loop ---- */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Slow organic rotation
    mesh.rotation.y = t * 0.04;
    mesh.rotation.x = t * 0.015;

    // Mouse-reactive parallax on camera
    camera.position.x += (mouseX * 12 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 12 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  /* ---- Resize ---- */
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
