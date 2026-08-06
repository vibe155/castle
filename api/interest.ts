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

const valueOf = (value: unknown) => typeof value === 'string' ? value.trim() : '';

export default async function handler(request: { method?: string; body?: RequestBody | string }, response: Response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    return response.status(500).json({ error: 'Email service is not configured' });
  }

  let body: RequestBody;
  try {
    body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body || {};
  } catch {
    return response.status(400).json({ error: 'Invalid request body' });
  }

  const name = valueOf(body.name);
  const phone = valueOf(body.phone);
  const message = valueOf(body.message);

  if (!name || !phone || !message) {
    return response.status(400).json({ error: 'Required fields are missing' });
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: '관심등록 알림 <onboarding@resend.dev>',
      to: ['twogunj@gmail.com'],
      subject: '[새 관심고객 등록]',
      text: `이름: ${name}\n연락처: ${phone}\n문의내용: ${message}`
    })
  });

  if (!resendResponse.ok) {
    console.error('Resend email failed', await resendResponse.text());
    return response.status(502).json({ error: 'Email delivery failed' });
  }

  return response.status(200).json({ ok: true });
}
