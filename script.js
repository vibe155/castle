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


const INTEREST_REGISTRATION_CONVERSION = 'AW-17503629912/QgqrCLbEv5sdENjksJpB';
const interestRegistrationConversionIds = new Set();

const reportInterestRegistrationConversion = (leadId) => {
  if (!leadId || interestRegistrationConversionIds.has(leadId) || typeof window.gtag !== 'function') return;

  interestRegistrationConversionIds.add(leadId);
  window.gtag('event', 'conversion', {
    send_to: INTEREST_REGISTRATION_CONVERSION,
    transaction_id: leadId
  });
};


const interestForm = document.querySelector('#interest-form');
const phonePattern = /^01[0-9][0-9]{7,8}$/;
let interestSubmissionInProgress = false;
let interestSubmissionId = '';

const createInterestSubmissionId = () =>
  window.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const clearInterestFieldError = (field) => {
  field?.removeAttribute('aria-invalid');
};

const setInterestFieldError = (field) => {
  if (field) field.setAttribute('aria-invalid', 'true');
};

interestForm?.addEventListener('input', (event) => clearInterestFieldError(event.target));
interestForm?.addEventListener('change', (event) => clearInterestFieldError(event.target));

interestForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = form.querySelector('.form-message');
  const submitButton = form.querySelector('button[type="submit"]');
  const nameField = form.elements.namedItem('name');
  const phoneField = form.elements.namedItem('phone');
  const typeField = form.elements.namedItem('type');
  const messageField = form.elements.namedItem('message');
  const privacyConsentField = form.elements.namedItem('privacyConsent');
  const marketingConsentField = form.elements.namedItem('marketingConsent');

  if (interestSubmissionInProgress) return;

  [nameField, phoneField, messageField, privacyConsentField].forEach(clearInterestFieldError);
  const name = String(nameField?.value || '').trim();
  const phone = String(phoneField?.value || '').replace(/\D/g, '');
  const inquiry = String(messageField?.value || '').trim();
  const privacyConsent = privacyConsentField?.checked === true;
  const errors = [];

  if (!name) {
    errors.push('성함을 입력해 주세요.');
    setInterestFieldError(nameField);
  }
  if (!phonePattern.test(phone)) {
    errors.push('연락처를 정확히 입력해 주세요.');
    setInterestFieldError(phoneField);
  }
  if (!inquiry) {
    errors.push('문의내용을 입력해 주세요.');
    setInterestFieldError(messageField);
  }
  if (!privacyConsent) {
    errors.push('개인정보 수집 및 이용에 동의해 주세요.');
    setInterestFieldError(privacyConsentField);
  }

  if (errors.length) {
    message.textContent = errors.join(' ');
    (nameField?.getAttribute('aria-invalid') === 'true' ? nameField :
      phoneField?.getAttribute('aria-invalid') === 'true' ? phoneField :
      messageField?.getAttribute('aria-invalid') === 'true' ? messageField : privacyConsentField)?.focus();
    return;
  }

  phoneField.value = phone;
  const selectedType = String(typeField?.value || '').trim();
  const submissionId = interestSubmissionId || createInterestSubmissionId();
  interestSubmissionId = submissionId;
  const defaultSubmitLabel = submitButton.innerHTML;

  interestSubmissionInProgress = true;
  message.textContent = '관심고객 등록을 전송하고 있습니다.';
  submitButton.disabled = true;
  submitButton.setAttribute('aria-busy', 'true');
  submitButton.textContent = '관심고객 등록 중…';


  try {
    const response = await fetch('/api/interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        type: selectedType === '선택해 주세요' ? '' : selectedType,
        message: inquiry,
        privacyConsent,
        marketingConsent: marketingConsentField?.checked === true,
        submissionId
      })
    });

    const result = await response.json().catch(() => null);
    const leadId = typeof result?.leadId === 'string' ? result.leadId : '';
    if (!response.ok || result?.ok !== true || !leadId) {
      throw new Error('Interest registration failed');
    }


    if (typeof gtag === 'function') gtag('event', 'generate_lead', { method: 'interest_form', housing_type: selectedType });
    reportInterestRegistrationConversion(leadId);
    form.reset();
    interestSubmissionId = '';
    message.textContent = '관심등록이 완료되었습니다.';
  } catch (error) {
    message.textContent = '등록 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  } finally {
    interestSubmissionInProgress = false;
    submitButton.disabled = false;
    submitButton.removeAttribute('aria-busy');
    submitButton.innerHTML = defaultSubmitLabel;
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











































































































































































































