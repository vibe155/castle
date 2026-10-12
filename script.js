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


const promotionBanner = document.querySelector('.promotion-banner');
const promotionBannerDismiss = document.querySelector('.promotion-banner-dismiss');
const promotionBannerClose = document.querySelector('.promotion-banner-close');
const promotionBannerStorageKey = 'oryong-promotion-banner-hidden-until';

const hidePromotionBanner = () => promotionBanner?.classList.add('is-hidden');
const hiddenUntil = Number(window.localStorage.getItem(promotionBannerStorageKey));
if (hiddenUntil > Date.now()) {
  hidePromotionBanner();
} else {
  window.localStorage.removeItem(promotionBannerStorageKey);
}

promotionBannerDismiss?.addEventListener('click', () => {
  window.localStorage.setItem(promotionBannerStorageKey, String(Date.now() + (60 * 60 * 1000)));
  hidePromotionBanner();
});

promotionBannerClose?.addEventListener('click', hidePromotionBanner);


const prefersReducedMotion = false; // Keep the requested visual effects consistent on mobile browsers.


const visualMotionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.2 });


document.querySelectorAll('.complex-visual, .complex-media figure, .community-cards figure').forEach((element) => {
  if (prefersReducedMotion) element.classList.add('is-visible');
  else visualMotionObserver.observe(element);
});


if (!window.__locationSequenceController) {
const locationArticles = [...document.querySelectorAll('#location .location-grid article')];
const typeLocationCopy = (element, text, interval = 22) => new Promise((resolve) => {
  let index = 0;
  const typeNext = () => {
    element.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) window.setTimeout(typeNext, interval);
    else resolve();
  };
  typeNext();
});


const playLocationSequence = async () => {
  for (const article of locationArticles) {
    const copy = article.querySelector('p');
    const copyText = copy.textContent;
    article.classList.add('is-visible');
    if (!prefersReducedMotion) {
      copy.textContent = '';
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      await typeLocationCopy(copy, copyText);
      await new Promise((resolve) => window.setTimeout(resolve, 380));
    }
  }
};


const locationGrid = document.querySelector('#location .location-grid');
const locationMotionObserver = new IntersectionObserver((entries, observer) => {
  if (!entries.some((entry) => entry.isIntersecting)) return;
  playLocationSequence();
  observer.unobserve(locationGrid);
}, { threshold: 0.35 });


if (prefersReducedMotion) locationArticles.forEach((article) => article.classList.add('is-visible'));
else if (locationGrid) locationMotionObserver.observe(locationGrid);
}


const plans = {
  '84A': { size: '전용 84.9831㎡ · 약 25.7평', layout: '3ROOM · 2BATH · 수납공간', count: '158실', feature: '4BAY 중심의 맞통풍 설계', image: '/unit-plan.png' },
  '84B': { size: '전용 84.9831㎡ · 약 25.7평', layout: '3ROOM · 2BATH · 수납공간', count: '121실', feature: '4BAY 중심의 맞통풍 설계', image: '/unit-plan.png' },
  '84C': { size: '전용 84.9715㎡ · 약 25.7평', layout: '3ROOM · 2BATH · 수납공간', count: '80실', feature: '3ROOM · 2BATH 구성', image: '/unit-plan.png' },
  '84D': { size: '전용 84.9831㎡ · 약 25.7평', layout: '3ROOM · 2BATH · 수납공간', count: '37실', feature: '4BAY 중심의 맞통풍 설계', image: '/unit-plan.png' }
};


document.querySelectorAll('[data-type]').forEach((button) => button.addEventListener('click', () => {
  const selected = plans[button.dataset.type];
  if (typeof gtag === 'function') gtag('event', 'select_floorplan', { floorplan_type: button.dataset.type });
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


const consentContents = {
  privacy: {
    title: '개인정보 수집 및 이용 동의',
    body: [
      ['수집 항목', '이름, 연락처, 관심 타입, 모델하우스 방문 예정일, 알고싶은 정보'],
      ['수집·이용 목적', '분양 상담 신청 처리, 고객 문의 응대, 방문상담 및 고객이 요청한 상담 관련 안내'],
      ['보유 및 이용기간', '상담 목적 달성 후 지체 없이 파기합니다. 다만 관계 법령에 따라 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관할 수 있습니다.'],
      ['동의 거부 권리', '개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만 필수 개인정보 수집·이용에 동의하지 않을 경우 관심고객 등록 및 상담 신청이 제한될 수 있습니다.']
    ]
  },
  marketing: {
    title: '광고성 정보 수신 동의',
    body: [
      ['이용 목적', '분양정보, 잔여세대, 분양조건 변경, 이벤트 및 기타 분양 관련 광고성 정보 안내'],
      ['수신 방법', '문자(SMS/LMS/MMS), 전화 등'],
      ['이용 정보', '이름, 연락처'],
      ['동의 철회', '광고성 정보 수신동의는 선택사항이며 동의하지 않아도 관심고객 등록 및 상담 신청이 가능합니다. 동의 후에도 언제든지 수신거부 또는 동의 철회를 요청할 수 있습니다.']
    ]
  }
};
const consentModal = document.querySelector('#consent-modal');
const consentModalTitle = document.querySelector('#consent-modal-title');
const consentModalContent = document.querySelector('#consent-modal-content');
document.querySelectorAll('.consent-open').forEach((button) => button.addEventListener('click', () => {
  const consent = consentContents[button.dataset.consent];
  if (!consent) return;
  consentModalTitle.textContent = consent.title;
  consentModalContent.replaceChildren(...consent.body.map(([heading, copy]) => {
    const section = document.createElement('section');
    const title = document.createElement('h4');
    const text = document.createElement('p');
    title.textContent = heading;
    text.textContent = copy;
    section.append(title, text);
    return section;
  }));
  consentModal.hidden = false;
  document.body.classList.add('modal-open');
}));
document.querySelectorAll('[data-consent-close]').forEach((button) => button.addEventListener('click', () => {
  consentModal.hidden = true;
  document.body.classList.remove('modal-open');
}));


document.querySelector('#interest-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = form.querySelector('.form-message');
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);


  message.textContent = '관심등록을 전송하고 있습니다.';
  submitButton.disabled = true;


  try {
    const response = await fetch('/api/interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        phone: formData.get('phone'),
        type: formData.get('type'),
        message: formData.get('message'),
        privacyConsent: formData.get('privacyConsent') === 'on',
        marketingConsent: formData.get('marketingConsent') === 'on'
      })
    });


    if (!response.ok) throw new Error('Interest registration failed');


    if (typeof gtag === 'function') gtag('event', 'generate_lead', { method: 'interest_form', housing_type: formData.get('type') });
    form.reset();
    message.textContent = '관심등록이 완료되었습니다.';
  } catch (error) {
    message.textContent = '등록 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  } finally {
    submitButton.disabled = false;
  }
});

// Funding guide: values remain in the browser and are never sent to analytics or the server.
const fundingForm = document.querySelector('#funding-form');
if (fundingForm) {
  const valueOf = (name) => Math.max(0, Number(fundingForm.querySelector('[data-funding="' + name + '"]')?.value) || 0);
  const formatWon = (amount) => amount > 0 ? Math.round(amount).toLocaleString('ko-KR') + '만원' : '입력 필요';
  const setFundingOutput = (name, value) => { const output = document.querySelector('[data-funding-output="' + name + '"]'); if (output) output.textContent = value; };
  const updateFunding = () => {
    const price = valueOf('price');
    const option = valueOf('option');
    const fees = valueOf('fees');
    const depositRate = valueOf('depositRate');
    const loan = valueOf('loan');
    const income = valueOf('income');
    const existing = valueOf('existing');
    const rate = valueOf('rate') / 100 / 12;
    const years = valueOf('years');
    const total = price + option + fees;
    const deposit = price && depositRate ? price * depositRate / 100 : 0;
    let monthly = 0;
    if (loan && years) { const periods = years * 12; monthly = rate ? loan * rate * Math.pow(1 + rate, periods) / (Math.pow(1 + rate, periods) - 1) : loan / periods; }
    const dsr = income && monthly ? ((monthly * 12 + existing) / income) * 100 : 0;
    setFundingOutput('total', formatWon(total));
    setFundingOutput('deposit', formatWon(deposit));
    setFundingOutput('cash', total ? formatWon(Math.max(total - loan, 0)) : '입력 필요');
    setFundingOutput('monthly', formatWon(monthly));
    setFundingOutput('dsr', dsr ? dsr.toFixed(1) + '%' : '입력 필요');
  };
  fundingForm.addEventListener('input', updateFunding);
}











































































































































































































