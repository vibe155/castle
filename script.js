const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '닫기' : '메뉴';
});

document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  if (menuToggle) menuToggle.textContent = '메뉴';
}));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const visualMotionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.complex-visual, .community-cards figure').forEach((element) => {
  if (prefersReducedMotion) element.classList.add('is-visible');
  else visualMotionObserver.observe(element);
});

const locationArticles = document.querySelectorAll('#location .location-grid article');
const typeLocationCopy = (element, text, interval = 24) => {
  let index = 0;
  const typeNext = () => {
    element.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) window.setTimeout(typeNext, interval);
  };
  typeNext();
};

const locationMotionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const article = entry.target;
    const title = article.querySelector('h3');
    const copy = article.querySelector('p');
    const copyText = copy.textContent;
    const order = [...locationArticles].indexOf(article);
    article.classList.add('is-visible');
    if (!prefersReducedMotion) {
      copy.textContent = '';
      window.setTimeout(() => typeLocationCopy(copy, copyText), 650 + (order * 220));
    }
    observer.unobserve(article);
  });
}, { threshold: 0.35 });

locationArticles.forEach((article) => {
  if (prefersReducedMotion) article.classList.add('is-visible');
  else locationMotionObserver.observe(article);
});

const plans = {
  '84A': { size: '전용 84.9880㎡ · 공급 114.5410㎡', layout: '4Bay 판상형 · 알파룸', count: '147세대', feature: '넓은 거실과 팬트리, 효율적인 수납 동선', image: '/floorplan-84a.png' },
  '84B': { size: '전용 84.8990㎡ · 공급 113.3740㎡', layout: '타워형 · 세탁실', count: '150세대', feature: '개방감 있는 거실과 실용적인 생활 동선', image: '/floorplan-84b.png' },
  '84B1': { size: '전용 84.9550㎡ · 공급 113.3870㎡', layout: '타워형 · 세탁실', count: '14세대', feature: '수납과 동선을 고려한 균형 잡힌 구성', image: '/floorplan-84b1.png' },
  '84C': { size: '전용 84.9460㎡ · 공급 113.9310㎡', layout: '타워형 · 세탁실', count: '76세대', feature: '넓은 거실 중심의 편안한 주거공간', image: '/floorplan-84c.png' },
  '84D': { size: '전용 84.9310㎡ · 공급 112.9320㎡', layout: '판상형 · 알파룸', count: '14세대', feature: '알파룸을 더한 유연한 공간 활용', image: '/floorplan-84d.png' },
  '84E': { size: '전용 84.9380㎡ · 공급 113.4610㎡', layout: '판상형 · 팬트리', count: '14세대', feature: '생활 수납을 강화한 실용적 설계', image: '/floorplan-84e.png' },
  '84F': { size: '전용 84.9060㎡ · 공급 112.9530㎡', layout: '판상형 · 알파룸', count: '12세대', feature: '개방감과 수납 효율을 함께 고려한 설계', image: '/floorplan-84f.png' },
};

document.querySelectorAll('[data-type]').forEach((button) => button.addEventListener('click', () => {
  const selected = plans[button.dataset.type];
  document.querySelectorAll('[data-type]').forEach((item) => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-selected', String(item === button));
  });
  document.querySelector('[data-plan="type"]').textContent = button.dataset.type;
  document.querySelector('[data-plan="size"]').textContent = selected.size;
  document.querySelector('[data-plan="layout"]').textContent = selected.layout;
  document.querySelector('[data-plan="count"]').textContent = selected.count;
  document.querySelector('[data-plan="feature"]').textContent = selected.feature;
  const planImage = document.querySelector('[data-plan="image"]');
  planImage.src = selected.image;
  planImage.alt = `${button.dataset.type} 타입 평면도`;
}));

document.querySelector('#interest-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  event.currentTarget.querySelector('.form-message').textContent = '등록 화면을 준비했습니다. 실제 상담 접수는 분양 CRM 또는 이메일 연동 후 활성화됩니다.';
  event.currentTarget.reset();
});
