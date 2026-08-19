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

  /* ---------- fetch + render projects ---------- */
  const workContainer = document.getElementById('workContainer');
  let allProjects = [];

  function render(filter) {
    const list = filter === '*' ? allProjects : allProjects.filter(p => p.category === filter);
    if (!list.length) {
      workContainer.innerHTML = `<p class="empty-state">No projects in this category yet — check back soon.</p>`;
      return;
    }
    workContainer.innerHTML = list.map(p => `
      <div class="box grid-item">
        <div class="thumb">
          <img draggable="false" src="../assets/images/projects/${p.image}.png" alt="${p.name}" loading="lazy">
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
  }

  fetch('./projects.json')
    .then(res => res.json())
    .then(data => { allProjects = data; render('*'); })
    .catch(() => {
      workContainer.innerHTML = `<p class="empty-state">Couldn't load the project list right now. Please refresh.</p>`;
    });

  document.getElementById('filters')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;
    document.querySelectorAll('#filters .btn').forEach(b => b.classList.remove('is-checked'));
    btn.classList.add('is-checked');
    render(btn.dataset.filter);
  });

});
