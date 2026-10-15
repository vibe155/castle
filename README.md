# e편한세상 시티 천안아산역 랜딩

천안아산역 현장 검토용 정적 랜딩 페이지입니다. 이 브랜치는 운영 사이트와 분리된 작업 공간입니다.

## 개발 브랜치

- 공유 개발 브랜치: `feature/cheonanasn-draft`
- 운영 `main` 브랜치와 별도로 작업합니다. 이 브랜치의 변경사항을 `main`에 병합하거나 배포 설정을 바꾸지 마세요.

## 다른 PC에서 시작하기

### 1. 준비물

- [Git](https://git-scm.com/downloads)
- Node.js 20 이상 (로컬 웹 서버 및 Vercel 개발 서버용)
- 이 저장소에 접근할 수 있는 GitHub 계정

### 2. 클론 및 브랜치 전환

```bash
git clone https://github.com/vibe155/castle.git
cd castle
git switch feature/cheonanasn-draft
```

또는 한 번에 해당 브랜치만 받으려면:

```bash
git clone --branch feature/cheonanasn-draft --single-branch https://github.com/vibe155/castle.git
cd castle
```

### 3. 정적 화면 실행

이 프로젝트는 별도 `package.json` 없이 HTML, CSS, JavaScript와 이미지 파일로 구성되어 있습니다. 아래 명령으로 로컬 서버를 실행하세요.

```bash
npx serve . -l 3000
```

브라우저에서 `http://localhost:3000`을 엽니다.

> 관심고객 등록 폼의 `/api/interest` 호출은 정적 서버만으로는 동작하지 않습니다. 화면·반응형·클라이언트 상호작용 확인에는 위 명령이면 충분합니다.

### 4. API까지 로컬에서 확인하기 (선택)

`api/`는 Vercel 서버리스 함수 형식입니다. 폼 전송까지 점검해야 한다면 먼저 환경 변수 파일을 만들고 Vercel 개발 서버를 실행하세요.

```bash
cp .env.example .env.local
# .env.local에 실제 값 입력. 파일은 Git에 올리지 않습니다.
npx vercel dev
```

Windows PowerShell에서는 복사 명령을 다음처럼 사용합니다.

```powershell
Copy-Item .env.example .env.local
npx vercel dev
```

필요한 값은 `.env.example`을 기준으로 입력합니다.

- `RESEND_API_KEY`
- `KAKAO_REST_API_KEY`
- `KAKAO_CLIENT_SECRET`
- `KAKAO_REFRESH_TOKEN`

실제 키·토큰·개인정보는 소스 코드나 GitHub에 커밋하지 마세요. 카카오 알림 초기 설정은 `KAKAO_NOTIFICATION_SETUP.md`를 참고하세요.

## 작업 저장 및 공유

```bash
git status
git add index.html styles.css script.js api/ README.md
git commit -m "Describe your change"
git push origin feature/cheonanasn-draft
```

이미지나 설정 파일을 바꿨다면 필요한 파일만 `git add`에 추가하세요. 푸시 전에는 항상 `git status`로 환경 변수 파일이나 빌드 결과물이 포함되지 않았는지 확인합니다.

## 제외되는 로컬 파일

`.gitignore`는 환경 변수, Node 의존성, 패키지 캐시, 빌드 결과물, 로그, 에디터/OS 파일을 제외합니다. `.env.example`만 공유하고 실제 `.env*` 및 `.dev.vars`는 공유하지 않습니다.

## 배포 관련 주의

이 저장소 동기화는 PC 간 개발 환경 공유를 위한 것입니다. 도메인 구매나 새 배포, 기존 Vercel·Cloudflare 설정 변경을 수행하지 않습니다.
