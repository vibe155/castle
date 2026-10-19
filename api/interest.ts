type RequestBody = {
  name?: unknown;
  phone?: unknown;
  type?: unknown;
  message?: unknown;
  privacyConsent?: unknown;
  marketingConsent?: unknown;
  submissionId?: unknown;
};

type Response = {
  status: (code: number) => Response;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const valueOf = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const normalizedPhoneOf = (value: unknown) => valueOf(value).replace(/\D/g, '');
const phonePattern = /^01[0-9][0-9]{7,8}$/;
const submissionIdPattern = /^[A-Za-z0-9_-]{8,128}$/;

const errorMessageOf = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

type KakaoTokenResponse = {
  access_token?: unknown;
};

type ResendEmailResponse = {
  id?: unknown;
};

const KAKAO_NOTIFY_URL = 'https://kapi.kakao.com/v2/api/talk/memo/default/send';
const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const SITE_URL = 'https://www.apt-model-house.com/';

async function sendKakaoNotification(payload: {
  name: string;
  phone: string;
  type: string;
  message: string;
  marketingConsent: boolean;
}) {
  const restApiKey = process.env.KAKAO_REST_API_KEY;
  const clientSecret = process.env.KAKAO_CLIENT_SECRET;
  const refreshToken = process.env.KAKAO_REFRESH_TOKEN;

  if (!restApiKey || !clientSecret || !refreshToken) {
    console.warn('[interest] Kakao notification is not configured', {
      hasRestApiKey: Boolean(restApiKey),
      hasClientSecret: Boolean(clientSecret),
      hasRefreshToken: Boolean(refreshToken)
    });
    return { sent: false, configured: false };
  }

  const tokenBody = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: restApiKey,
    client_secret: clientSecret,
    refresh_token: refreshToken
  });
  const tokenResponse = await fetch(KAKAO_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body: tokenBody.toString()
  });
  const tokenData = (await tokenResponse.json().catch(() => ({}))) as KakaoTokenResponse;
  const accessToken = valueOf(tokenData.access_token);

  if (!tokenResponse.ok || !accessToken) {
    console.error('[interest] Kakao access token refresh failed', {
      status: tokenResponse.status
    });
    return { sent: false, configured: true };
  }

  const notificationText = [
    '[새 관심고객 등록]',
    '이름: ' + payload.name,
    '연락처: ' + payload.phone,
    '관심 주택형: ' + (payload.type || '미선택'),
    '광고성 정보 수신 동의: ' + (payload.marketingConsent ? '동의' : '미동의'),
    '문의내용: ' + payload.message
  ].join('\n');
  const templateObject = {
    object_type: 'text',
    text: notificationText,
    link: { web_url: SITE_URL, mobile_web_url: SITE_URL },
    button_title: '홈페이지 확인'
  };
  const notificationBody = new URLSearchParams({
    template_object: JSON.stringify(templateObject)
  });
  const notificationResponse = await fetch(KAKAO_NOTIFY_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    body: notificationBody.toString()
  });
  const notificationData = (await notificationResponse.json().catch(() => ({}))) as {
    result_code?: unknown;
  };
  const sent = notificationResponse.ok && notificationData.result_code === 0;

  if (!sent) {
    console.error('[interest] Kakao notification failed', {
      status: notificationResponse.status
    });
  } else {
    console.log('[interest] Kakao notification sent successfully');
  }

  return { sent, configured: true };
}

export default async function handler(
  request: { method?: string; body?: RequestBody | string },
  response: Response
) {
  console.log('[interest] Request received', { method: request.method });

  if (request.method !== 'POST') {
    console.error('[interest] Unsupported request method', request.method);
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    const environmentVariableNames = Object.keys(process.env).sort();
    console.error('[interest] RESEND_API_KEY is missing', {
      environmentVariableNames
    });
    return response.status(500).json({
      error: 'Email service is not configured',
      details: 'RESEND_API_KEY is missing'
    });
  }

  let body: RequestBody;
  try {
    body =
      typeof request.body === 'string'
        ? JSON.parse(request.body)
        : request.body || {};
  } catch (error) {
    const details = errorMessageOf(error);
    console.error('[interest] Invalid request body', { details });
    return response.status(400).json({
      error: 'Invalid request body',
      details
    });
  }

  const name = valueOf(body.name);
  const phone = normalizedPhoneOf(body.phone);
  const type = valueOf(body.type);
  const message = valueOf(body.message);
  const privacyConsent = body.privacyConsent === true;
  const marketingConsent = body.marketingConsent === true;
  const submissionId = valueOf(body.submissionId);

  if (!name || !phone || !message || !privacyConsent || !phonePattern.test(phone)) {
    console.error('[interest] Required fields are missing', {
      hasName: Boolean(name),
      hasValidPhone: phonePattern.test(phone),
      hasMessage: Boolean(message),
      hasPrivacyConsent: privacyConsent
    });
    return response.status(400).json({
      error: 'Required fields are missing'
    });
  }

  if (submissionId && !submissionIdPattern.test(submissionId)) {
    return response.status(400).json({ error: 'Invalid submission identifier' });
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json',
        ...(submissionId
          ? { 'Idempotency-Key': 'interest-registration/' + submissionId }
          : {})
      },
      body: JSON.stringify({
        from: '관심등록 알림 <notice@mail.apt-model-house.com>',
        to: ['jwon9899@gmail.com'],
        subject: '[새 관심고객 등록]',
        text:
          '이름: ' +
          name +
          '\n연락처: ' +
          phone +
          '\n관심 주택형: ' +
          (type || '미선택') +
          '\n광고성 정보 수신 동의: ' +
          (marketingConsent ? '동의' : '미동의') +
          '\n문의내용: ' +
          message
      })
    });

    const resendBody = (await resendResponse.json().catch(() => ({}))) as ResendEmailResponse;
    const leadId = valueOf(resendBody.id);

    if (!resendResponse.ok || !leadId) {
      console.error('[interest] Resend email failed', {
        status: resendResponse.status
      });
      return response.status(502).json({
        error: 'Email delivery failed'
      });
    }

    console.log('[interest] Registration email sent successfully', {
      status: resendResponse.status,
      leadId
    });

    let kakaoNotification = false;
    try {
      kakaoNotification = (await sendKakaoNotification({
        name,
        phone,
        type,
        message,
        marketingConsent
      })).sent;
    } catch (error) {
      console.error('[interest] Kakao notification failed after email save', {
        details: errorMessageOf(error)
      });
    }
    return response.status(200).json({ ok: true, leadId, kakaoNotification });
  } catch (error) {
    const details = errorMessageOf(error);
    console.error('[interest] Unexpected email delivery error', { details });
    return response.status(500).json({
      error: 'Unexpected email delivery error',
      details
    });
  }
}
