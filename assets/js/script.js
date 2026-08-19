/* ==========================================================================
   RAKA PORTFOLIO — main script (vanilla JS, no jQuery)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- mobile menu ---------- */
  const menuBtn = document.getElementById('menu');
  const navbar = document.querySelector('.navbar');
  if (menuBtn && navbar) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('fa-times');
      navbar.classList.toggle('nav-toggle');
    });
    navbar.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menuBtn.classList.remove('fa-times');
      navbar.classList.remove('nav-toggle');
    }));
  }

  /* ---------- header + scroll-top + scrollspy ---------- */
  const header = document.querySelector('header');
  const scrollTopBtn = document.getElementById('scroll-top');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar ul li a');

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 40);
    scrollTopBtn?.classList.toggle('active', y > 400);

    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 220;
      if (y >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- smooth anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- typed.js rotating role text ---------- */
  if (window.Typed) {
    new Typed('.typing-text', {
      strings: ['for the web', 'for Android', 'game mechanics', 'my next big project'],
      loop: true, typeSpeed: 55, backSpeed: 30, backDelay: 900,
    });
  }

  /* ---------- reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.reveal, .kicker, .heading, .player-card, .status-line, .cta-row, .socials, ' +
    '.stack-card, .education .box, .work .box, .about .box, .t-item, ' +
    '.dream-head, .marquee, .contact .container, .footer .box'
  );
  revealTargets.forEach(el => { if (!el.classList.contains('reveal')) el.classList.add('reveal'); });

  // stagger children of grid-like groups for a wave effect
  const staggerGroups = document.querySelectorAll(
    '.stack-grid, .education .box-container, .work .box-container, .about .box-container, .footer .box-container'
  );
  staggerGroups.forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.style.transitionDelay = `${Math.min(i, 8) * 70}ms`;
    });
  });
  document.querySelectorAll('.timeline .t-item').forEach((item, i) => {
    item.classList.remove('reveal');
    item.classList.add('reveal-left');
    item.style.transitionDelay = `${Math.min(i, 6) * 80}ms`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => io.observe(el));
  document.querySelectorAll('.timeline .t-item').forEach(el => io.observe(el));

  /* ---------- player-card XP bar fill on view ---------- */
  const xpFill = document.querySelector('.xp-fill');
  if (xpFill) {
    const xpIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          xpFill.style.width = xpFill.dataset.width || '80%';
          xpIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    xpIo.observe(xpFill);
  }

  /* ---------- dream companies marquee ---------- */
  const companies = [
    { name: 'Amazon', icon: 'https://img.icons8.com/?size=100&id=L4fVTj2H2Fcl&format=png&color=000000' },
    { name: 'Microsoft', icon: 'https://img.icons8.com/?size=100&id=22989&format=png&color=000000' },
    { name: 'Paypal', icon: 'https://img.icons8.com/?size=100&id=13611&format=png&color=000000' },
    { name: 'Meta', icon: 'https://img.icons8.com/?size=100&id=PvvcWRWxRKSR&format=png&color=000000' },
    { name: 'Garena', icon: 'https://img.icons8.com/?size=100&id=7zjhdLNWyPpS&format=png&color=000000' },
    { name: 'Apple', icon: 'https://img.icons8.com/?size=100&id=30840&format=png&color=000000' },
    { name: 'Google', icon: 'https://img.icons8.com/?size=100&id=17949&format=png&color=000000' },
    { name: 'IBM', icon: 'https://img.icons8.com/?size=100&id=31754&format=png&color=000000' },
    { name: 'Samsung', icon: 'https://img.icons8.com/?size=100&id=wGYgIlqPWdC2&format=png&color=000000' },
    { name: 'Adobe', icon: 'https://img.icons8.com/?size=100&id=gav46YArUSy1&format=png&color=000000' },
    { name: 'Intel', icon: 'https://img.icons8.com/?size=100&id=4gOsVGPywkWU&format=png&color=000000' },
    { name: 'Lenovo', icon: 'https://img.icons8.com/?size=100&id=pKl6oyq4IKpu&format=png&color=000000' },
    { name: 'Netflix', icon: 'https://img.icons8.com/?size=100&id=20519&format=png&color=000000' },
    { name: 'Nvidia', icon: 'https://img.icons8.com/?size=100&id=yqf95864UzeQ&format=png&color=000000' },
  ];
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    const chip = c => `<div class="brand-chip"><img src="${c.icon}" alt="${c.name}" loading="lazy"><span>${c.name}</span></div>`;
    // duplicate list for a seamless infinite loop
    marqueeTrack.innerHTML = companies.map(chip).join('') + companies.map(chip).join('');
  }

  /* ---------- projects (fetched from /projects/projects.json) ---------- */
  const workContainer = document.getElementById('workContainer');
  if (workContainer) {
    fetch('./projects/projects.json')
      .then(res => res.json())
      .then(projects => {
        const shown = projects.filter(p => p.category !== 'android').slice(0, 3);
        workContainer.innerHTML = shown.map(p => `
          <div class="box reveal">
            <div class="thumb">
              <img draggable="false" src="./assets/images/projects/${p.image}.png" alt="${p.name}" loading="lazy">
              <span class="cat">${p.category}</span>
            </div>
            <div class="content">
              <div class="tag"><h3>${p.name}</h3></div>
              <div class="desc"><p>${p.desc}</p></div>
              <div class="btns">
                <a href="${p.links.view}" class="btn" target="_blank" rel="noopener"><i class="fas fa-eye"></i> View</a>
                <a href="${p.links.code}" class="btn" target="_blank" rel="noopener">Code <i class="fas fa-code"></i></a>
              </div>
            </div>
          </div>`).join('');
        workContainer.querySelectorAll('.box').forEach(el => {
          io.observe(el);
        });
      })
      .catch(() => {
        workContainer.innerHTML = `<p style="color:var(--text-dim)">Projects couldn't be loaded right now — check the full list on the Projects page.</p>`;
      });
  }

  /* ---------- awards & certificates (fetched from /awards/awards.json) ---------- */
  const awardsContainer = document.getElementById('awardsContainer');
  if (awardsContainer) {
    fetch('./awards/awards.json')
      .then(res => res.json())
      .then(list => {
        awardsContainer.innerHTML = list.slice(0, 3).map(a => `
          <div class="box award-box reveal">
            <a href="/awards/detail.html?id=${encodeURIComponent(a.id)}" class="thumb" aria-label="View ${a.title}">
              ${a.image
                ? `<img draggable="false" src="./assets/images/awards/${a.image}" alt="${a.title}" loading="lazy">`
                : `<div class="no-image"><i class="fas fa-certificate"></i><span>Certificate</span></div>`}
              <span class="cat">${a.category || 'award'}</span>
            </a>
            <div class="content">
              <div class="meta"><span class="issuer">${a.issuer}</span>${a.date ? `<span>${a.date}</span>` : ''}</div>
              <div class="tag"><h3>${a.title}</h3></div>
              <div class="desc"><p>${a.desc || ''}</p></div>
              <div class="btns">
                <a href="/awards/detail.html?id=${encodeURIComponent(a.id)}" class="btn"><i class="fas fa-eye"></i> View Certificate</a>
              </div>
            </div>
          </div>`).join('');
        awardsContainer.querySelectorAll('.box').forEach(el => io.observe(el));
      })
      .catch(() => {
        awardsContainer.innerHTML = `<p style="color:var(--text-dim)">Certificates couldn't be loaded right now — check the full list on the Awards page.</p>`;
      });
  }

  /* ---------- contact form: async submit via web3forms ---------- */
  const form = document.querySelector('.contact form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending… <i class="fas fa-spinner fa-spin"></i>';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });
        const data = await res.json();
        if (data.success) {
          submitBtn.innerHTML = 'Sent! <i class="fas fa-check"></i>';
          form.reset();
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        submitBtn.innerHTML = 'Failed — try again <i class="fas fa-exclamation-triangle"></i>';
      } finally {
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
        }, 3000);
      }
    });
  }

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- experience timeline: plane follows scroll along the pole ---------- */
  const timeline = document.querySelector('.timeline');
  const plane = document.getElementById('planeTrack');
  if (timeline && plane) {
    let lastY = window.scrollY;
    let ticking = false;

    const updatePlane = () => {
      const rect = timeline.getBoundingClientRect();
      const trackHeight = timeline.offsetHeight - 32; // keep plane inside the pole
      const viewportAnchor = window.innerHeight * 0.5;

      let progress = (viewportAnchor - rect.top) / (rect.height || 1);
      progress = Math.max(0, Math.min(1, progress));
      plane.style.top = `${progress * trackHeight}px`;

      const y = window.scrollY;
      if (y > lastY + 1) plane.classList.remove('flying-up');
      else if (y < lastY - 1) plane.classList.add('flying-up');
      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updatePlane);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', updatePlane);
    updatePlane();
  }

  /* ---------- ambient HUD grid canvas (hero background) ---------- */
  const canvas = document.getElementById('hud-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let w, h, nodes = [];
    const NODE_COUNT = 46;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    function init() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }
    function step() {
      ctx.clearRect(0, 0, w, h);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(89,133,209,${(1 - dist / 140) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        ctx.fillStyle = 'rgba(89,133,209,0.5)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(step);
    }
    resize(); init(); step();
    window.addEventListener('resize', () => { resize(); init(); });
  }

});
