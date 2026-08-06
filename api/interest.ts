type RequestBody = {
  name?: unknown;
  phone?: unknown;
  message?: unknown;
};

type Response = {
  status: (code: number) => Response;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const valueOf = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const errorMessageOf = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

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
  const phone = valueOf(body.phone);
  const message = valueOf(body.message);

  if (!name || !phone || !message) {
    console.error('[interest] Required fields are missing', {
      hasName: Boolean(name),
      hasPhone: Boolean(phone),
      hasMessage: Boolean(message)
    });
    return response.status(400).json({
      error: 'Required fields are missing'
    });
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: '관심등록 알림 <onboarding@resend.dev>',
        to: ['twogunj@gmail.com'],
        subject: '[새 관심고객 등록]',
        text: '이름: ' + name + '\n연락처: ' + phone + '\n문의내용: ' + message
      })
    });

    const resendBody = await resendResponse.text();
    console.log('[interest] Resend response', {
      status: resendResponse.status,
      body: resendBody
    });

    if (!resendResponse.ok) {
      console.error('[interest] Resend email failed', {
        status: resendResponse.status,
        body: resendBody
      });
      return response.status(502).json({
        error: 'Email delivery failed',
        resend: {
          status: resendResponse.status,
          body: resendBody
        }
      });
    }

    console.log('[interest] Registration email sent successfully', {
      status: resendResponse.status
    });
    return response.status(200).json({ ok: true });
  } catch (error) {
    const details = errorMessageOf(error);
    console.error('[interest] Unexpected email delivery error', { details });
    return response.status(500).json({
      error: 'Unexpected email delivery error',
      details
    });
  }
}
