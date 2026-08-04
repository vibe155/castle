const modal = document.querySelector('#video-modal');
const modalBox = modal.querySelector('.modal-box');
const modalClose = modal.querySelector('.modal-close');
let brandFilm;

function ensureBrandFilm() {
  if (brandFilm) return brandFilm;
  brandFilm = document.createElement('video');
  brandFilm.className = 'brand-film-video';
  brandFilm.src = 'lotte-castle-brand-film.mp4';
  brandFilm.controls = true;
  brandFilm.playsInline = true;
  brandFilm.preload = 'metadata';
  brandFilm.setAttribute('aria-label', '롯데캐슬 더퍼스트 홍보영상');
  Object.assign(brandFilm.style, {
    display: 'block', width: '100%', maxHeight: '72vh', objectFit: 'contain', background: '#000'
  });
  modalBox.querySelectorAll('.eyebrow, h2, .play-circle, small').forEach((element) => {
    element.hidden = true;
  });
  modalBox.append(brandFilm);
  return brandFilm;
}

function closeBrandFilm() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  if (brandFilm) brandFilm.pause();
}

document.querySelector('[data-open-video]').addEventListener('click', () => {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  const video = ensureBrandFilm();
  video.play().catch(() => {});
});

modalClose.addEventListener('click', closeBrandFilm);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeBrandFilm();
});

document.querySelector('#lead-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const toast = document.querySelector('.toast');
  toast.classList.add('show');
  event.currentTarget.reset();
  window.setTimeout(() => toast.classList.remove('show'), 4200);
});
