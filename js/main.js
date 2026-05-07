/* ============================================
   MeowCat × MeowAgent — Interactive Engine
   Works across index / framework / agent pages
   ============================================ */

(function () {
  'use strict';

  /* === Navbar === */
  const navbar = document.getElementById('navbar');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (navbar) {
    if (navbar.classList.contains('scrolled')) {
      // Sub-pages come pre-scrolled
    } else {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
    }
  }

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* === Smooth Scroll === */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* === Copy Code === */
  window.copyCode = function (btn) {
    const block = btn.closest('.code-block');
    if (!block) return;
    const code = block.querySelector('code');
    if (!code) return;
    navigator.clipboard.writeText(code.textContent).then(() => {
      const lang = window.currentLang || 'zh';
      btn.textContent = lang === 'zh' ? '已复制' : 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = lang === 'zh' ? '复制' : 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  };

  /* === Tagline Typewriter (Hero pages) === */
  const taglineEl = document.getElementById('heroTagline');
  if (taglineEl) {
    const phrases = [
      'Not another LLM wrapper — a living organism blueprint.',
      'Framework defines the skeleton. You choose the materials.',
      '20 organs. 5 categories. 1 unified nervous system.',
      '像猫一样构建 AI Agent。',
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeLoop() {
      const current = phrases[phraseIdx];
      if (isDeleting) {
        charIdx--;
        taglineEl.textContent = current.substring(0, charIdx);
        if (charIdx === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(typeLoop, 500);
          return;
        }
        setTimeout(typeLoop, 30);
      } else {
        charIdx++;
        taglineEl.textContent = current.substring(0, charIdx);
        if (charIdx === current.length) {
          setTimeout(() => { isDeleting = true; typeLoop(); }, 3000);
          return;
        }
        setTimeout(typeLoop, 70);
      }
    }
    setTimeout(typeLoop, 1000);
  }

  /* === Particle System === */
  function initParticles(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const parent = container.parentElement;
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const PARTICLE_COUNT = Math.min(70, Math.floor(window.innerWidth / 15));
    const CONNECT_DIST = 140;
    let mouseX = -1000, mouseY = -1000;
    let particles = [];

    function resize() {
      canvas.width = parent.offsetWidth || window.innerWidth;
      canvas.height = parent.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    parent.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    parent.addEventListener('mouseleave', () => {
      mouseX = -1000; mouseY = -1000;
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.35 + 0.12,
        baseAlpha: 0,
      });
      particles[i].baseAlpha = particles[i].alpha;
    }

    function draw() {
      if (!container.isConnected) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 160) {
          p.alpha = Math.min(p.baseAlpha + (1 - distToMouse / 160) * 0.45, 0.7);
          const force = (1 - distToMouse / 160) * 0.6;
          p.vx += (dx / distToMouse) * force * 0.025;
          p.vy += (dy / distToMouse) * force * 0.025;
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.04;
        }
        p.vx *= 0.999;
        p.vy *= 0.999;
      }

      // Lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineAlpha = 0.08 * (1 - dist / CONNECT_DIST);
            ctx.strokeStyle = `rgba(168,85,247,${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Dots with glow
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        glow.addColorStop(0, `rgba(192,132,252,${p.alpha * 0.5})`);
        glow.addColorStop(1, 'rgba(192,132,252,0)');
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192,132,252,${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;
      }

      requestAnimationFrame(draw);
    }
    draw();
  }

  // Init particles for main hero and agent page
  initParticles('particlesCanvas');
  initParticles('agentParticles');

  /* === Parallax Orbs === */
  const orbs = document.querySelectorAll('.gradient-orb');
  if (orbs.length) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.5;
        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    }, { passive: true });
  }

  /* === Scroll Reveal === */
  const revealSelectors = [
    '.highlight-card', '.philosophy-card', '.arch-cat',
    '.install-step', '.agent-loop', '.preview-card',
    '.organ-category', '.plug-style', '.signal-layer',
    '.defense-card', '.metaphor-card', '.cta-card',
    '.colony-room', '.colony-board', '.quick-link-card',
    '.agent-feature-item', '.relation-item', '.think-card'
  ];
  const revealEls = document.querySelectorAll(revealSelectors.join(','));
  revealEls.forEach(el => el.classList.add('reveal'));

  function checkReveal() {
    const trigger = window.innerHeight * 0.92;
    revealEls.forEach(el => {
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('load', checkReveal);
  checkReveal();

  /* === Active Nav Link on scroll === */
  const sections = document.querySelectorAll('section[id], .mc-subsection[id]');
  const navAs = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navAs.length) {
    function updateActiveNav() {
      let current = '';
      sections.forEach(sec => {
        if (sec.getBoundingClientRect().top < 200) current = sec.getAttribute('id');
      });
      navAs.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });
  }

})();
