document.addEventListener('DOMContentLoaded', () => {

  /* ---------- mobile menu ---------- */
  const menuBtn = document.getElementById('menu');
  const navbar = document.querySelector('.navbar');
  if (menuBtn && navbar) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('fa-times');
      navbar.classList.toggle('nav-toggle');
    });
  }

  /* ---------- scroll-top button ---------- */
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    scrollTopBtn?.classList.toggle('active', window.scrollY > 300);
  }, { passive: true });

  const cardHTML = (a) => `
    <div class="box award-box reveal">
      <a href="./detail.html?id=${encodeURIComponent(a.id)}" class="thumb" aria-label="View ${a.title}">
        ${a.image
          ? `<img draggable="false" src="../assets/images/awards/${a.image}" alt="${a.title}" loading="lazy">`
          : `<div class="no-image"><i class="fas fa-certificate"></i><span>Certificate</span></div>`}
        <span class="cat">${a.category || 'award'}</span>
      </a>
      <div class="content">
        <div class="meta"><span class="issuer">${a.issuer}</span>${a.date ? `<span>${a.date}</span>` : ''}</div>
        <div class="tag"><h3>${a.title}</h3></div>
        <div class="desc"><p>${a.desc || ''}</p></div>
        <div class="btns">
          <a href="./detail.html?id=${encodeURIComponent(a.id)}" class="btn"><i class="fas fa-eye"></i> View Certificate</a>
        </div>
      </div>
    </div>`;

  /* ---------- awards listing page ---------- */
  const awardsContainer = document.getElementById('awardsContainer');
  if (awardsContainer) {
    fetch('./awards.json')
      .then(res => res.json())
      .then(list => {
        awardsContainer.innerHTML = list.map(cardHTML).join('');
        const io = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
          });
        }, { threshold: 0.1 });
        awardsContainer.querySelectorAll('.reveal').forEach(el => io.observe(el));
      })
      .catch(() => {
        awardsContainer.innerHTML = `<p class="not-found">Couldn't load certificates right now. Please refresh.</p>`;
      });
  }

  /* ---------- certificate detail page ---------- */
  const detailContainer = document.getElementById('detailContainer');
  if (detailContainer) {
    const id = new URLSearchParams(window.location.search).get('id');
    fetch('./awards.json')
      .then(res => res.json())
      .then(list => {
        const a = list.find(item => item.id === id);
        if (!a) {
          detailContainer.innerHTML = `<p class="not-found">Certificate not found. It may have been moved — check the full list of awards.</p>`;
          return;
        }
        document.getElementById('pageTitle').textContent = `${a.title} | Raka Wirya Kusuma`;

        const certBlock = a.image_full
          ? `<div class="cert-frame bracket-frame"><img draggable="false" src="../assets/images/awards/${a.image_full}" alt="${a.title}"></div>`
          : `<div class="cert-frame"><div class="cert-placeholder"><i class="fas fa-certificate"></i><p>This certificate is verified externally.<br>Use the button below to view it on the issuer's site.</p></div></div>`;

        const infoRows = [
          a.issuer ? { label: 'Issued by', value: a.issuer } : null,
          a.date ? { label: 'Date', value: a.date } : null,
          a.known_as ? { label: 'Known as', value: a.known_as } : null,
          a.team ? { label: 'Team', value: a.team } : null,
          a.cert_number ? { label: 'Certificate No.', value: a.cert_number } : null,
          a.signer ? { label: 'Signed by', value: a.signer } : null,
        ].filter(Boolean);

        detailContainer.innerHTML = `
          <div class="detail-card reveal in">
            <span class="d-kicker">// ${a.category || 'award'}</span>
            <h1>${a.title}</h1>
            ${certBlock}
            <p class="d-desc">${a.desc || ''}</p>
            <div class="d-grid">
              ${infoRows.map(r => `<div class="d-box"><span>${r.label}</span><p>${r.value}</p></div>`).join('')}
            </div>
            <div class="d-actions">
              ${a.image_full ? `<a href="../assets/images/awards/${a.image_full}" target="_blank" rel="noopener" class="btn"><i class="fas fa-expand"></i> Open Full Image</a>` : ''}
              ${a.verify_url ? `<a href="${a.verify_url}" target="_blank" rel="noopener" class="btn primary"><i class="fas fa-shield-alt"></i> Verify Certificate</a>` : ''}
            </div>
          </div>`;
      })
      .catch(() => {
        detailContainer.innerHTML = `<p class="not-found">Couldn't load this certificate right now. Please refresh.</p>`;
      });
  }
});
