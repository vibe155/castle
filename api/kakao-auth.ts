type Request = {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
};

type Response = {
  status: (code: number) => Response;
  send: (body: string) => void;
  setHeader: (name: string, value: string) => void;
};

type KakaoAuthorizationResponse = {
  refresh_token?: unknown;
};

const REDIRECT_URI = 'https://www.apt-model-house.com/api/kakao-auth';
const TOKEN_URL = 'https://kauth.kakao.com/oauth/token';

const valueOf = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const render = (title: string, body: string) => `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head><body><main>${body}</main></body></html>`;

export default async function handler(request: Request, response: Response) {
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  response.setHeader('Pragma', 'no-cache');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('X-Robots-Tag', 'noindex, nofollow');
  response.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'");

  if (request.method !== 'GET') {
    return response.status(405).send(render('허용되지 않은 요청', '<p>GET 요청만 허용됩니다.</p>'));
  }

  const code = valueOf(request.query?.code);
  const kakaoError = valueOf(request.query?.error);
  if (kakaoError || !code) {
    return response.status(400).send(
      render('카카오 인증 미완료', '<p>카카오 인증이 완료되지 않았습니다. 창을 닫고 다시 시도해 주세요.</p>')
    );
  }

  const restApiKey = process.env.KAKAO_REST_API_KEY;
  const clientSecret = process.env.KAKAO_CLIENT_SECRET;
  if (!restApiKey || !clientSecret) {
    console.error('[kakao-auth] Required Kakao credentials are not configured', {
      hasRestApiKey: Boolean(restApiKey),
      hasClientSecret: Boolean(clientSecret)
    });
    return response.status(500).send(
      render('설정 필요', '<p>서버의 카카오 인증 설정이 아직 완료되지 않았습니다.</p>')
    );
  }

  try {
    const tokenResponse = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: restApiKey,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI,
        code
      }).toString()
    });
    const tokenData = (await tokenResponse.json().catch(() => ({}))) as KakaoAuthorizationResponse;
    const refreshToken = valueOf(tokenData.refresh_token);

    if (!tokenResponse.ok || !refreshToken) {
      console.error('[kakao-auth] Kakao token exchange failed', { status: tokenResponse.status });
      return response.status(502).send(
        render('토큰 발급 실패', '<p>카카오 토큰을 발급하지 못했습니다. 처음부터 다시 시도해 주세요.</p>')
      );
    }

    console.log('[kakao-auth] Kakao refresh token issued');
    return response.status(200).send(
      render(
        '리프레시 토큰 발급 완료',
        `<h1>리프레시 토큰이 발급되었습니다</h1>
<p>아래 값을 복사해 Vercel의 <code>KAKAO_REFRESH_TOKEN</code>에만 저장하세요. 이 창을 닫으면 다시 표시되지 않습니다.</p>
<textarea readonly aria-label="Kakao refresh token" style="width:100%;min-height:8rem">${escapeHtml(refreshToken)}</textarea>`
      )
    );
  } catch (error) {
    console.error('[kakao-auth] Unexpected token exchange failure', {
      message: error instanceof Error ? error.message : String(error)
    });
    return response.status(500).send(
      render('토큰 발급 실패', '<p>예상하지 못한 오류가 발생했습니다. 다시 시도해 주세요.</p>')
    );
  }
}
