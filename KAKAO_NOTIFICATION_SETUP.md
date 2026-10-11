# 카카오톡 관심등록 알림 설정

관심등록이 접수되면 Vercel의 `/api/interest`가 카카오톡 **나와의 채팅방**으로 알림을 전송합니다. 고객의 개인정보는 브라우저나 공개 코드에 저장되지 않습니다.

## 한 번만 필요한 카카오 설정

1. [Kakao Developers](https://developers.kakao.com/)에서 앱을 만들거나 기존 앱을 선택합니다.
2. **카카오 로그인**을 활성화하고, REST API 키의 Redirect URI에 `https://www.apt-model-house.com/api/kakao-auth`를 등록합니다.
3. **동의항목**에서 `talk_message`(카카오톡 메시지 전송)를 활성화합니다.
4. 카카오 로그인으로 본인 계정을 한 번 인증하여 `talk_message` 동의가 포함된 **Refresh Token**을 발급받습니다.

## Vercel 환경변수

Vercel 프로젝트 **haelingtonplace**의 Production과 Preview에 아래 세 값을 추가합니다.

- `KAKAO_REST_API_KEY`: Kakao Developers 앱의 REST API 키
- `KAKAO_CLIENT_SECRET`: 해당 REST API 키의 카카오 로그인 클라이언트 시크릿
- `KAKAO_REFRESH_TOKEN`: 위 본인 카카오 계정으로 발급받은 Refresh Token

값을 저장한 뒤 재배포하면 적용됩니다. 토큰은 절대 GitHub나 브라우저 코드에 넣지 않습니다. Refresh Token이 만료되면 같은 방식으로 새로 발급해 Vercel 환경변수만 교체합니다.

## 확인 방법

관심등록 폼을 제출한 뒤 카카오톡의 **나와의 채팅**에서 `[새 관심고객 등록]` 알림을 확인합니다. Vercel Runtime Logs에는 개인정보 없이 전송 성공/실패 상태만 남습니다.

카카오 공식 요구 사항은 카카오 로그인, Redirect URI 등록 및 `talk_message` 동의항목 활성화입니다: https://developers.kakao.com/docs/ko/kakaotalk-message/rest-api
