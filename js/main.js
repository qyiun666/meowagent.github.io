/* ============================================
   MeowAgent Official Website - Main JS
   ============================================ */

(function () {
  'use strict';

  /* --- Navbar scroll shadow --- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* --- Mobile menu toggle --- */
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navLinks.classList.remove('open'); });
    });
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = navbar ? navbar.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset - 8;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* --- Copy code button --- */
  window.copyCode = function (btn) {
    var block = btn.closest('.code-block');
    if (!block) return;
    var code = block.querySelector('code');
    if (!code) return;
    navigator.clipboard.writeText(code.textContent).then(function () {
      btn.textContent = '已复制';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = '复制';
        btn.classList.remove('copied');
      }, 1800);
    });
  };

  /* --- Quantum particle animation (Canvas) --- */
  var particleContainer = document.getElementById('particles');
  if (particleContainer) {
    var canvas = document.createElement('canvas');
    particleContainer.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 60;

    function resize() {
      canvas.width = particleContainer.offsetWidth;
      canvas.height = particleContainer.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      };
    }
    for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Lines
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(168,85,247,' + (0.12 * (1 - dist / 140)) + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      // Dots
      for (var k = 0; k < particles.length; k++) {
        var p = particles[k];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(192,132,252,' + p.alpha + ')';
        ctx.fill();
        // Move
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* --- Scroll reveal --- */
  var revealEls = document.querySelectorAll(
    '.highlight-card, .feature-card, .flow-step, .install-step, .cli-card, .timeline-item, .community-card'
  );
  revealEls.forEach(function (el) { el.classList.add('reveal'); });

  function checkReveal() {
    var trigger = window.innerHeight * 0.88;
    revealEls.forEach(function (el) {
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('load', checkReveal);
  checkReveal();

})();
