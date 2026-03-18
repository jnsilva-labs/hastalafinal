import React, { useState, useEffect, useRef } from 'react';

const customStyles = {
  root: {
    '--bg-void': '#07070f',
    '--ven-red': '#CF142B',
    '--ven-gold': '#F4C430',
    '--ven-blue': '#1a3a8f',
    '--text-main': '#F5F0E8',
    '--text-muted': '#5a5870',
  },
  heroTitle: {
    fontSize: 'clamp(6rem, 15vw, 18rem)',
    lineHeight: '0.8',
    letterSpacing: '-0.02em',
    display: 'flex',
    flexDirection: 'column',
    color: 'transparent',
    WebkitTextStroke: '1px rgba(255,255,255,0.2)',
    position: 'relative',
    fontFamily: "'Bebas Neue', sans-serif",
    textTransform: 'uppercase',
  },
  heroTitleSpan: {
    position: 'relative',
    transition: 'all 0.5s ease',
  },
  tricolorGrad: {
    background: 'linear-gradient(90deg, #F4C430 0%, #1a3a8f 50%, #CF142B 100%)',
  },
  tricolorGlow: {
    boxShadow: '0 0 20px rgba(244, 196, 48, 0.2), 0 0 40px rgba(26, 58, 143, 0.2), 0 0 60px rgba(207, 20, 43, 0.2)',
  },
};

const StarSVG = ({ style }) => (
  <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, fill: '#F4C430', opacity: 0.8, ...style }}>
    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
  </svg>
);

const StarsArch = () => {
  const archStyles = [
    { transform: 'translateY(0px) rotate(-30deg)' },
    { transform: 'translateY(-8px) rotate(-15deg)' },
    { transform: 'translateY(-14px) rotate(-5deg)' },
    { transform: 'translateY(-16px) rotate(5deg)' },
    { transform: 'translateY(-16px) rotate(5deg)' },
    { transform: 'translateY(-14px) rotate(-5deg)' },
    { transform: 'translateY(-8px) rotate(-15deg)' },
    { transform: 'translateY(0px) rotate(-30deg)' },
  ];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: 30, gap: 4 }}>
      {archStyles.map((s, i) => <StarSVG key={i} style={s} />)}
    </div>
  );
};

const TricolorBar = ({ style }) => (
  <div style={{
    height: 2,
    background: 'linear-gradient(90deg, #F4C430 0%, #1a3a8f 50%, #CF142B 100%)',
    opacity: 0.8,
    ...style
  }} />
);

const RutaCard = ({ stage, opponent, scoreWin, scoreLose, note, isFinal, stageColor }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: isFinal ? 'rgba(207, 20, 43, 0.05)' : '#07070f',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        borderTop: isFinal ? '1px solid #CF142B' : 'none',
        transform: hovered && !isFinal ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? '0 0 20px rgba(244, 196, 48, 0.2), 0 0 40px rgba(26, 58, 143, 0.2), 0 0 60px rgba(207, 20, 43, 0.2)' : 'none',
      }}
    >
      {hovered && !isFinal && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: 2,
          background: 'linear-gradient(90deg, #F4C430 0%, #1a3a8f 50%, #CF142B 100%)',
        }} />
      )}
      <span style={{
        fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: stageColor || '#F4C430', marginBottom: '2rem', display: 'block',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>{stage}</span>
      <h3 style={{
        fontFamily: "'Bebas Neue', sans-serif", textTransform: 'uppercase',
        fontSize: '2.5rem', color: isFinal ? '#F5F0E8' : '#5a5870',
      }}>{opponent}</h3>
      {isFinal ? (
        <div style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: '2rem', fontStyle: 'italic',
          color: '#CF142B', marginTop: '2rem',
        }}>Pending</div>
      ) : (
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif", textTransform: 'uppercase',
          fontSize: '5rem', lineHeight: '0.9', marginTop: '1rem', display: 'block',
        }}>
          <span style={{ color: '#F5F0E8' }}>{scoreWin}</span> - {scoreLose}
        </div>
      )}
      {isFinal ? (
        <div style={{ display: 'flex', gap: 4, marginTop: '1.5rem' }}>
          <StarSVG />
        </div>
      ) : (
        <div style={{
          color: '#5a5870', fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '0.6rem', marginTop: '1rem', textTransform: 'uppercase',
        }}>{note}</div>
      )}
    </article>
  );
};

const PlayerCard = ({ number, name, position, imgSrc, stats }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      style={{ aspectRatio: '2/3', perspective: '1000px', cursor: 'pointer' }}
    >
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* Front */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          backgroundColor: '#000',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '1.5rem', overflow: 'hidden',
        }}>
          <img src={imgSrc} alt={name} style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: 0.6, filter: 'grayscale(100%) contrast(1.2)',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%',
            background: 'linear-gradient(to top, #07070f 0%, transparent 100%)',
          }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem',
              color: '#F4C430', lineHeight: 1, opacity: 0.8,
            }}>{number}</div>
            <div style={{
              fontSize: '1.5rem', fontWeight: 600, textTransform: 'uppercase',
              marginTop: '0.5rem', letterSpacing: '0.05em',
              fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#F5F0E8',
            }}>{name}</div>
            <div style={{
              fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic',
              color: '#5a5870', fontSize: '0.9rem',
            }}>{position}</div>
          </div>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          border: '1px solid rgba(255,255,255,0.1)',
          backgroundColor: '#0a0a12',
          borderTop: '3px solid #1a3a8f',
          padding: '2rem',
          display: 'flex', flexDirection: 'column',
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              padding: '0.8rem 0', fontSize: '0.8rem',
            }}>
              <span style={{
                color: '#5a5870', textTransform: 'uppercase',
                letterSpacing: '0.1em', fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>{stat.label}</span>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem',
                letterSpacing: '0.05em', color: '#F5F0E8',
              }}>{stat.value}</span>
            </div>
          ))}
          <div style={{ flexGrow: 1 }} />
          <TricolorBar style={{ width: 30 }} />
        </div>
      </div>
    </div>
  );
};

const Tweet = ({ intercept, text, loc, isEven, visible }) => (
  <div style={{
    padding: '1.5rem',
    borderLeft: isEven ? 'none' : '1px solid #5a5870',
    borderRight: isEven ? '1px solid #1a3a8f' : 'none',
    background: isEven
      ? 'linear-gradient(-90deg, rgba(26,58,143,0.1) 0%, transparent 100%)'
      : 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
    maxWidth: 500,
    alignSelf: isEven ? 'flex-end' : 'flex-start',
    textAlign: isEven ? 'right' : 'left',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 0.8s ease',
  }}>
    <div style={{
      fontSize: '0.7rem', color: '#F4C430', letterSpacing: '0.1em',
      marginBottom: '0.5rem', textTransform: 'uppercase',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>{intercept}</div>
    <div style={{
      fontFamily: "'Libre Baskerville', serif", fontSize: '1.1rem',
      lineHeight: 1.5, fontStyle: 'italic', color: '#F5F0E8',
    }}>{text}</div>
    <div style={{
      fontSize: '0.65rem', color: '#5a5870', marginTop: '1rem',
      letterSpacing: '0.2em', textTransform: 'uppercase',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>{loc}</div>
  </div>
);

const CanvasBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!window.THREE) return;
    const THREE = window.THREE;
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const colorGold = new THREE.Color('#F4C430');
    const colorRed = new THREE.Color('#CF142B');
    const colorBlue = new THREE.Color('#1a3a8f');

    for (let i = 0; i < particlesCount * 3; i += 3) {
      const r = 40 + Math.random() * 60;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      posArray[i] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = r * Math.cos(phi);

      const rand = Math.random();
      let mixedColor;
      if (rand > 0.8) mixedColor = colorRed;
      else if (rand > 0.6) mixedColor = colorBlue;
      else mixedColor = colorGold;

      colorsArray[i] = mixedColor.r;
      colorsArray[i + 1] = mixedColor.g;
      colorsArray[i + 2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.4, vertexColors: true, transparent: true,
      opacity: 0.8, blending: THREE.AdditiveBlending,
    });

    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);

    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) - 0.5;
      mouseY = (event.clientY / window.innerHeight) - 0.5;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      particleMesh.rotation.y = elapsedTime * 0.05;
      particleMesh.rotation.x = elapsedTime * 0.02;
      camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 10 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      zIndex: 0, pointerEvents: 'none', opacity: 0.6,
    }} />
  );
};

const HeroSection = () => (
  <header style={{
    height: '100vh', display: 'flex', flexDirection: 'column',
    justifyContent: 'flex-end', padding: '4rem', position: 'relative',
  }}>
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '50vh',
      backgroundImage: "url('https://images.pexels.com/photos/159490/baseball-field-stadium-night-lights-159490.jpeg?auto=compress&cs=tinysrgb&w=2000')",
      backgroundSize: 'cover', backgroundPosition: 'center bottom',
      opacity: 0.15,
      maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
      filter: 'contrast(1.5) sepia(1) hue-rotate(180deg) saturate(2)',
      zIndex: -1,
    }} />

    <div style={{
      maxWidth: 1200, margin: '0 auto', width: '100%',
      borderBottom: '1px solid rgba(245, 240, 232, 0.1)',
      paddingBottom: '2rem', position: 'relative',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: '1rem', fontSize: '0.75rem', letterSpacing: '0.2em',
        textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#F5F0E8',
      }}>
        <div>MDC / LOANDEPOT PARK</div>
        <StarsArch />
        <div>CLASS: CONFIDENTIAL</div>
      </div>

      <h1 style={customStyles.heroTitle}>
        <span style={{
          ...customStyles.heroTitleSpan,
          position: 'relative',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.2)',
        }}>
          <span style={{
            position: 'absolute', left: 0, top: 0,
            color: '#F5F0E8',
            textShadow: '0 0 40px #F4C430',
            WebkitTextStroke: '0px',
          }}>HASTA</span>
          HASTA
        </span>
        <span style={{
          ...customStyles.heroTitleSpan,
          position: 'relative',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.2)',
        }}>
          <span style={{
            position: 'absolute', left: 0, top: 0,
            color: '#F5F0E8',
            textShadow: '0 0 40px #CF142B',
            WebkitTextStroke: '0px',
          }}>LA FINAL</span>
          LA FINAL
        </span>
      </h1>

      <div style={{ position: 'absolute', right: 0, bottom: '20%', textAlign: 'right' }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif", textTransform: 'uppercase',
          fontSize: '3rem', letterSpacing: '0.1em',
          display: 'flex', alignItems: 'center', gap: '1rem', color: '#F5F0E8',
        }}>
          VEN{' '}
          <span style={{
            fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic',
            fontSize: '1.5rem', color: '#CF142B',
          }}>vs</span>
          {' '}USA
        </div>
        <div style={{
          fontSize: '0.8rem', letterSpacing: '0.3em', marginTop: '0.5rem',
          color: '#5a5870', fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>ESTA NOCHE / TONIGHT</div>
      </div>
    </div>

    <TricolorBar style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }} />
  </header>
);

const RutaSection = () => (
  <section style={{ padding: '10rem 4rem', maxWidth: 1400, margin: '0 auto' }}>
    <div style={{
      marginBottom: '4rem', borderLeft: '3px solid #CF142B', paddingLeft: '1.5rem',
    }}>
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif", textTransform: 'uppercase',
        fontSize: '4rem', lineHeight: 1, color: '#F5F0E8',
      }}>LA RUTA<br />DEL GUERRERO</h2>
      <p style={{
        fontFamily: "'Libre Baskerville', serif", fontSize: '1.1rem',
        maxWidth: 400, marginTop: '1rem', lineHeight: 1.6, color: '#5a5870',
      }}>
        El camino no fue dado, fue arrebatado.{' '}
        <span style={{ fontSize: '0.7em', opacity: 0.5, display: 'block', marginTop: 4, fontStyle: 'normal' }}>
          The path wasn't given, it was taken.
        </span>
      </p>
    </div>

    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.05)',
    }}>
      <RutaCard stage="MIA / POOL D" opponent="DOM" scoreWin="5" scoreLose="1" note="Mano, tengo fe." />
      <RutaCard stage="TOK / QF" opponent="JPN" scoreWin="4" scoreLose="3" note="10TH INNING" />
      <RutaCard stage="MIA / SF" opponent="ITA" scoreWin="8" scoreLose="2" note="AREPA POWER" />
      <RutaCard stage="MIA / FINAL" opponent="USA" isFinal stageColor="#CF142B" />
    </div>
  </section>
);

const LineupSection = () => {
  const players = [
    {
      number: '24', name: 'Acuña Jr.', position: 'CF / El De La Sabana',
      imgSrc: 'https://images.pexels.com/photos/13054174/pexels-photo-13054174.jpeg?auto=compress&cs=tinysrgb&w=600',
      stats: [
        { label: 'AVG', value: '.385' }, { label: 'HR', value: '4' },
        { label: 'RBI', value: '9' }, { label: 'OPS', value: '1.250' },
      ],
    },
    {
      number: '27', name: 'Altuve', position: '2B / Astroboy',
      imgSrc: 'https://images.pexels.com/photos/10196720/pexels-photo-10196720.jpeg?auto=compress&cs=tinysrgb&w=600',
      stats: [
        { label: 'AVG', value: '.310' }, { label: 'OBP', value: '.420' },
        { label: 'R', value: '8' },
      ],
    },
    {
      number: '13', name: 'Pérez', position: 'C / El Capitán',
      imgSrc: 'https://images.pexels.com/photos/15694086/pexels-photo-15694086.jpeg?auto=compress&cs=tinysrgb&w=600',
      stats: [
        { label: 'AVG', value: '.290' }, { label: 'HR', value: '2' },
        { label: 'CS%', value: '45%' },
      ],
    },
    {
      number: '2', name: 'Arráez', position: '1B / La Regadera',
      imgSrc: 'https://images.pexels.com/photos/10008546/pexels-photo-10008546.jpeg?auto=compress&cs=tinysrgb&w=600',
      stats: [
        { label: 'AVG', value: '.450' }, { label: 'H', value: '12' },
        { label: 'K%', value: '3.2%' },
      ],
    },
  ];

  return (
    <section style={{
      padding: '10rem 4rem', maxWidth: 1400, margin: '0 auto',
      background: 'rgba(255,255,255,0.02)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ marginBottom: '4rem', borderLeft: '3px solid #CF142B', paddingLeft: '1.5rem' }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif", textTransform: 'uppercase',
          fontSize: '4rem', lineHeight: 1, color: '#F5F0E8',
        }}>EL LINEUP</h2>
        <p style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: '1.1rem',
          maxWidth: 400, marginTop: '1rem', lineHeight: 1.6, color: '#5a5870',
        }}>
          Los hijos del Araguaney.{' '}
          <span style={{ fontSize: '0.7em', opacity: 0.5, display: 'block', marginTop: 4, fontStyle: 'normal' }}>
            The sons of the Araguaney.
          </span>
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem', marginTop: '4rem',
      }}>
        {players.map((p, i) => (
          <PlayerCard key={i} {...p} />
        ))}
      </div>
    </section>
  );
};

const DiasporaSection = () => {
  const [visibleTweets, setVisibleTweets] = useState([false, false, false]);
  const tweetRefs = useRef([]);

  useEffect(() => {
    const observers = tweetRefs.current.map((ref, index) => {
      if (!ref) return null;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleTweets(prev => {
                const next = [...prev];
                next[index] = true;
                return next;
              });
            }, index * 300);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(obs => obs && obs.disconnect());
    };
  }, []);

  const tweets = [
    {
      intercept: 'Intercept 01 / Santiago, CL',
      text: '"Viendo el juego a las 3 AM con la chaqueta de los Leones puesta. Llorando por un país que extraño todos los días. Hoy somos uno."',
      loc: '@caraqueñocongelado — 8,043 KM FROM HOME',
      isEven: false,
    },
    {
      intercept: 'Intercept 02 / Madrid, ES',
      text: '"La arepa en el sartén y Acuña en el plato. No importa donde estemos, el tricolor nos amarra el pecho."',
      loc: '@venezuelaninomad — 7,200 KM FROM HOME',
      isEven: true,
    },
    {
      intercept: 'Intercept 03 / Miami, USA',
      text: '"I\'m at the stadium. It sounds like Caracas. It feels like home. They can\'t beat this energy. Hasta la final."',
      loc: '@miamiguaro — GROUND ZERO',
      isEven: false,
    },
  ];

  return (
    <section style={{
      position: 'relative', minHeight: '120vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        position: 'relative', zIndex: 2, textAlign: 'center',
        maxWidth: 800, padding: '2rem',
        background: 'radial-gradient(circle, rgba(7,7,15,0.8) 0%, rgba(7,7,15,0) 70%)',
      }}>
        <h2 style={{
          fontFamily: "'Libre Baskerville', serif",
          fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.2,
          marginBottom: '2rem', color: '#F4C430',
          textShadow: '0 0 20px rgba(244, 196, 48, 0.3)',
        }}>
          Dejamos la casa... <br /> para construir un estadio entero.
        </h2>
        <p style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.1em',
          textTransform: 'uppercase', fontSize: '0.8rem', color: '#5a5870',
        }}>We left home... to build an entire stadium.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '4rem', textAlign: 'left' }}>
          {tweets.map((tweet, i) => (
            <div key={i} ref={el => tweetRefs.current[i] = el}>
              <Tweet {...tweet} visible={visibleTweets[i]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer style={{
    padding: '6rem 4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'linear-gradient(to top, #000 0%, #07070f 100%)',
    position: 'relative',
  }}>
    <div style={{
      fontFamily: "'Bebas Neue', sans-serif", fontSize: '4rem',
      letterSpacing: '0.3em', color: 'transparent',
      WebkitTextStroke: '1px rgba(255,255,255,0.3)', marginBottom: '1rem',
    }}>VENEZUELA SIEMPRE</div>

    <TricolorBar style={{ width: 100 }} />

    <div style={{
      textAlign: 'justify', textAlignLast: 'center',
      fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem',
      letterSpacing: '0.15em', color: '#5a5870', lineHeight: 1.4,
      maxWidth: 1000, margin: '3rem 0', opacity: 0.7,
    }}>
      A FEDERACIÓN VENEZOLANA DE BÉISBOL PRODUCTION{' '}
      <span style={{ fontSize: '0.6rem', verticalAlign: 'middle', margin: '0 0.5rem', color: '#CF142B' }}>✦</span>
      {' '}MANAGER <strong style={{ color: '#F5F0E8', fontWeight: 'normal' }}>OMAR LÓPEZ</strong>{' '}
      <span style={{ fontSize: '0.6rem', verticalAlign: 'middle', margin: '0 0.5rem', color: '#CF142B' }}>✦</span>
      {' '}CAPTAIN <strong style={{ color: '#F5F0E8', fontWeight: 'normal' }}>SALVADOR PÉREZ</strong>{' '}
      <span style={{ fontSize: '0.6rem', verticalAlign: 'middle', margin: '0 0.5rem', color: '#CF142B' }}>✦</span>
      {' '}ROSTER <strong style={{ color: '#F5F0E8', fontWeight: 'normal' }}>ACUÑA JR, ALTUVE, ARRÁEZ, GIMÉNEZ, SUÁREZ, SANTANDER, PERALTA, LUZARDO, LÓPEZ, SUÁREZ</strong>{' '}
      <span style={{ fontSize: '0.6rem', verticalAlign: 'middle', margin: '0 0.5rem', color: '#CF142B' }}>✦</span>
      {' '}COACHING STAFF <strong style={{ color: '#F5F0E8', fontWeight: 'normal' }}>C. GUILLÉN, R. CHIRINOS, W. ROMERO</strong>{' '}
      <span style={{ fontSize: '0.6rem', verticalAlign: 'middle', margin: '0 0.5rem', color: '#CF142B' }}>✦</span>
      {' '}SPIRITUAL ADVISOR <strong style={{ color: '#F5F0E8', fontWeight: 'normal' }}>EL TURPIAL &amp; LA ORQUÍDEA</strong>{' '}
      <span style={{ fontSize: '0.6rem', verticalAlign: 'middle', margin: '0 0.5rem', color: '#CF142B' }}>✦</span>
      {' '}FUEL <strong style={{ color: '#F5F0E8', fontWeight: 'normal' }}>CACAO Y AREPA</strong>{' '}
      <span style={{ fontSize: '0.6rem', verticalAlign: 'middle', margin: '0 0.5rem', color: '#CF142B' }}>✦</span>
      {' '}SHOT ON LOCATION <strong style={{ color: '#F5F0E8', fontWeight: 'normal' }}>LOANDEPOT PARK, MIAMI, FL</strong>{' '}
      <span style={{ fontSize: '0.6rem', verticalAlign: 'middle', margin: '0 0.5rem', color: '#CF142B' }}>✦</span>
      {' '}RATING <strong style={{ color: '#F5F0E8', fontWeight: 'normal' }}>HISTORIC</strong>
    </div>

    <div style={{
      display: 'flex', gap: '2rem', marginTop: '2rem', opacity: 0.3,
      fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
      fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#F5F0E8',
    }}>
      <div>TEPUY</div>
      <div>•</div>
      <div>ARAGUANEY</div>
      <div>•</div>
      <div>CUATRO</div>
    </div>
  </footer>
);

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
      body { background-color: #07070f; overflow-x: hidden; cursor: crosshair; }
      html { scroll-behavior: smooth; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{
      backgroundColor: '#07070f', color: '#F5F0E8',
      fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: 'hidden',
      minHeight: '100vh',
    }}>
      {/* Noise overlay */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 999, opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      <CanvasBackground />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <HeroSection />
        <RutaSection />
        <LineupSection />
        <DiasporaSection />
        <Footer />
      </div>
    </div>
  );
};

export default App;