# 🍜 PWD Week 4 - Express & Render로 만드는 Ajou Campus Foodmap API

> **실용 웹서비스 개발 4주차**: Node.js와 Express로 백엔드 REST API를 구현하고, Render를 통해 3주차 React 클라이언트와 연동 가능한 서버를 배포합니다.
## 📚 주차 자료
- 4주차 강의자료 (업로드 예정)

---

## 🛠️ 프로젝트 소개

### 만들어볼 서비스
**Ajou Campus Foodmap API** - 아주대학교 주변 맛집 데이터를 제공하고 관리할 수 있는 백엔드 서비스입니다.

### 주요 기능
- `/health`: 서버 상태 확인용 헬스 체크
- `/api/restaurants`: 맛집 목록 비동기 조회 (지연 시뮬레이션 포함)
- `/api/restaurants/sync-demo`: 동기 방식 목록 조회 비교 엔드포인트
- `/api/restaurants/:id`: 개별 맛집 상세 조회
- `/api/restaurants/popular?limit=`: 평점 상위 맛집 조회
- `POST /api/restaurants`: 추천 메뉴를 배열로 정규화하며 신규 맛집 등록
- `POST /api/restaurants/reset-demo`: 데모 데이터 초기화
- Jest + Supertest 기반 서비스/라우터 단위 테스트 제공

### 사용 기술
- **Runtime**: Node.js 22
- **Framework**: Express 5, cors 미들웨어
- **구조**: MVC (controllers / services / routes / middleware)
- **테스트**: Jest, Supertest
- **배포**: Render Web Service (Build Command `npm install`, Start Command `npm start`)

---

## ✅ 사전 준비사항

### 1. 필수 프로그램 설치 확인
```bash
node --version    # 22.0.0 이상 권장
npm --version     # 10.x 이상
git --version
```
> Node.js가 없다면 [nodejs.org](https://nodejs.org) LTS 버전을, Git은 [git-scm.com](https://git-scm.com)에서 설치하세요.

### 2. 계정 준비
- GitHub 계정 (코드 저장 및 협업)
- Render 계정 ([render.com](https://render.com), GitHub 연동 권장)

### 3. 개발 도구
- VS Code (또는 선호 IDE)
- 추천 확장: ESLint, Prettier, REST Client 혹은 Thunder Client
- API 테스트 도구: Postman, 혹은 단순히 `curl`

---

## 🚀 프로젝트 시작하기

### Step 0. Express 프로젝트 생성
```bash
cd C:\Users\hsoh\WorkspaceAjou\pwd-week4
```

### Step 1. 의존성 설치 & 로컬 서버 실행
```bash
npm install
npm run dev   # nodemon으로 개발 서버 실행
```
- 기본 주소: `http://localhost:3000`
- 헬스 체크:
```bash
curl http://localhost:3000/health
```

### Step 2. 폴더 구조 이해
```
src/
 ├─ app.js                # Express 앱 구성
 ├─ routes/               # 라우터 정의
 ├─ controllers/          # 요청/응답 컨트롤러
 ├─ services/             # 비즈니스 로직 (동기/비동기 비교)
 ├─ middleware/           # NotFound, Error 핸들러
 ├─ data/restaurants.json # 시드 데이터
 └─ utils/asyncHandler.js # 공통 비동기 에러 래퍼
```

### Step 4. 프로젝트 기능 구현


### Step 5. API 사용해 보기
```bash
# 전체 맛집 목록
curl http://localhost:3000/api/restaurants

# 인기 맛집 3개만 보기
curl "http://localhost:3000/api/restaurants/popular?limit=3"

# 신규 맛집 추가 (PowerShell)
curl -X POST http://localhost:3000/api/restaurants ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Ajou Cafeteria\",\"location\":\"기숙사 1층\",\"recommendedMenu\":[\"라면\",\"김밥\"],\"rating\":4.6}"
```
> macOS/Linux에서는 줄바꿈 기호로 `\` 를 사용하세요.

### Step 6. 테스트 실행
```bash
npm test
```
- 서비스 로직 + REST 엔드포인트 통합 테스트가 통과해야 합니다.
- 실패한다면 서버가 실행 중인지(`npm run dev`), 필요 시 `POST /api/restaurants/reset-demo` 로 초기화했는지 확인하세요.

### Step 7. Git 초기화 및 첫 커밋
```bash
git init
git status           # 추적할 파일 확인
git add .
git commit -m "feat: set up express backend server"
```
- `.git` 폴더가 이미 있다면 이 단계는 건너뜁니다.
- `npm test`가 통과하는 상태에서 커밋하는 습관을 들이세요.

### Step 6. GitHub 리포지토리 생성 & 연결
1. GitHub → `New repository` → 이름을 `pwd-week4` 로 생성합니다.
2. 터미널에서 원격 저장소를 연결합니다.
```bash
git remote add origin https://github.com/<github-username>/pwd-week4.git
git branch -M main
git push -u origin main
```
3. GitHub에서 코드가 올라갔는지, README/커밋 메시지가 올바른지 확인합니다.

---

## ☁️ Render 배포하기

### Step 7. Render 계정 & GitHub 연동
1. [render.com](https://render.com) 접속 → `Sign In with GitHub` 선택.
2. Render가 GitHub 리포지토리에 접근할 수 있도록 권한을 허용합니다.
3. 대시보드에서 `New +` → `Web Service` 를 선택합니다.

### Step 8. 배포 설정
1. 연결할 저장소로 `pwd-week4` 를 선택합니다. (보이지 않는다면 `Configure account`에서 리포지토리를 허용하세요.)
2. 환경 설정을 다음과 같이 입력합니다.
   - **Name**: `pwd-week4-<nickname>`
   - **Region**: Singapore (ap-southeast-1) 권장
   - **Branch**: `main`
   - **Root Directory**: `/` (모노레포가 아니라면 기본값 유지)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
   - **Auto Deploy**: Yes
3. (선택) Environment Variables 추가
   - `NODE_VERSION = 22`
   - 향후 비밀 키나 DB URL 등도 이곳에서 관리합니다.
4. `Create Web Service` 클릭 → 빌드 로그가 성공(`Live`)인지 확인합니다.

### Step 9. 배포 검증
```bash
# Health 체크
curl https://pwd-week4-<username>.onrender.com/health

# API 목록 조회
curl https://pwd-week4-<username>.onrender.com/api/restaurants

# 데모 데이터 초기화
curl -X POST https://pwd-week4-<username>.onrender.com/api/restaurants/popular
```
- Render Free 플랜은 유휴 상태에서 잠든 뒤 첫 호출이 느릴 수 있습니다.
- 3주차 React 앱에서 API를 호출하려면 `.env` 또는 환경 설정에 Render 도메인을 등록하세요.

---

## 🧰 자주 만나는 오류 & 해결법

오류 발생 상황을 프롬프팅하여 문제 해결

---

## 📎 제출 가이드

- **제출 마감**: 강의 공지 확인 (예: 10월 5일 23:59)
- **제출 항목**
  - GitHub Repository URL: `https://github.com/<username>/pwd-week4`
  - Render Service URL: `https://pwd-week4-<username>.onrender.com`
  - Netlify Service URL: `https://pwd-week3-<username>.netlify.app`

- **체크리스트**
  - `npm test` 가 로컬에서 통과하나요?
  - 주요 REST 엔드포인트가 Render에서 정상 동작하나요?  
  - React 프론트엔드(3주차)와 연동 테스트를 완료했나요?

---

## 📚 추가 학습 자료
- [Express 공식 문서](https://expressjs.com/ko/)
- [Render - Deploy a Node/Express App](https://docs.render.com/deploy-node-express-app)
- [Jest 공식 문서](https://jestjs.io/docs/getting-started)

---

## 💬 질문 & 도움
- [Practical Web Service TA](https://chatgpt.com/g/g-68bbbf3aa57081919811dd57100b1e46-ajou-digtalmedia-practical-web-service-ta)
- 과제 관련 질문은 Slack `#pwd-week4` 채널 또는 LMS 질의응답 게시판을 활용하세요.

---

## 🎉 수고하셨습니다!
이번 주차를 통해
- Express로 REST API를 설계하고,
- 비동기 처리 & 테스트 코드 작성을 연습하고,
- GitHub ↔ Render 배포 흐름을 경험했습니다.

다음 주차에서는 이 API에 데이터베이스와 인증을 추가해 확장할 예정입니다. 계속해서 화이팅! ✨

# AI도구 사용이 신입 프로그래머에 미치는 영향 설문 조사 (스타벅스 커피 쿠폰)
(https://forms.gle/eho8ud3s8DaGPtTM6)