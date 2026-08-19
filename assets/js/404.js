document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu');
  const navbar = document.querySelector('.navbar');
  if (menuBtn && navbar) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('fa-times');
      navbar.classList.toggle('nav-toggle');
    });
  }
});
