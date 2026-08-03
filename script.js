const modal = document.querySelector('#video-modal');
document.querySelector('[data-open-video]').addEventListener('click', () => {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
});
document.querySelector('.modal-close').addEventListener('click', () => {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
});
modal.addEventListener('click', (event) => {
  if (event.target === modal) document.querySelector('.modal-close').click();
});
document.querySelector('#lead-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const toast = document.querySelector('.toast');
  toast.classList.add('show');
  event.currentTarget.reset();
  window.setTimeout(() => toast.classList.remove('show'), 4200);
});
