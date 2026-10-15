# 🍜 PWD Week 6 - TypeScript · Express · Render로 만드는 Ajou Campus Foodmap API

> **실전 웹서비스 개발 6주차**: TypeScript와 Express로 백엔드 REST API를 구현해 Render에 배포하고, Vercel에 배포한 5주차 React 클라이언트와 연동합니다.
---

## 🛠️ 프로젝트 소개

### 만들어볼 서비스
**Ajou Campus Foodmap API** - 아주대학교 주변 맛집 데이터를 제공하고 관리할 수 있는 백엔드 서비스.

### 주요 기능
- `/health`: 서버 상태 확인용 헬스 체크
- `/api/restaurants`: 맛집 목록 비동기 조회 (지연 시뮬레이션 포함)
- `/api/restaurants/sync-demo`: 동기 방식 목록 조회 비교 엔드포인트
- `/api/restaurants/:id`: 개별 맛집 상세 조회
- `/api/restaurants/popular?limit=`: 평점 상위 맛집 조회
- `POST /api/restaurants`: 추천 메뉴를 배열로 정규화하며 신규 맛집 등록
- `POST /api/restaurants/reset-demo`: 데모 데이터 초기화

### 사용 기술
- **Runtime**: Node.js 22 이상
- **Language**: TypeScript (`strict` 모드)
- **Framework**: Express 5, cors 미들웨어
- **구조**: MVCS (controllers / services / routes / middleware)
- **타입 검사**: `npm run typecheck`
- **테스트**: Jest + ts-jest (`npm test`)
- **개발 실행 / 빌드**: `tsx watch` / `tsc`
- **백엔드 배포**: Render Web Service (Build Command `npm ci --include=dev && npm run build`, Start Command `npm start`)
- **클라이언트 배포**: Vercel (Framework Preset `Vite`, Build Command `npm run build`, Output Directory `dist`)

### 실행·배포 안내 바로가기

- [TypeScript 설치·개발 실행·명령어 설명](#typescript-run)
- [타입 검사·테스트·배포용 빌드](#typescript-build)
- [Render 서비스 생성과 설정](#render-deploy)
- [배포 확인·재배포·문제 해결](#render-verify)
- [React 클라이언트 연동과 Vercel 배포](#vercel-client)

이미 이 저장소를 내려받았다면 `package.json`이 있는 프로젝트 루트에서 Step 3부터 진행합니다. Step 1~2는 빈 폴더에서 직접 예제를 만드는 경우의 안내입니다. 이번 주 백엔드는 `pwd-week6`, 연동할 React 맛집 클라이언트는 이전 주차의 `pwd-week5`입니다. GitHub 연결에서는 본인의 실제 저장소 이름을 선택하세요.

---

## ✅ 사전 준비사항

### 1. 필수 프로그램 설치 확인
```bash
node --version    # 이번 연동 실습은 24.x 사용
npm --version     # 10.x 이상
git --version
```
> Node.js가 없다면 [nodejs.org](https://nodejs.org)에서 Node 24.x를, Git은 [git-scm.com](https://git-scm.com)에서 설치하세요. 백엔드는 Node 22 이상을 지원하지만 `pwd-week5`의 `engines.node`는 `24.x`이므로 두 프로젝트를 함께 실습할 때는 Node 24.x로 맞춥니다.

### 2. 계정 준비
- GitHub 계정 (코드 저장 및 협업)
- Render 계정 ([render.com](https://render.com), GitHub 연동 권장)
- Vercel 계정 ([vercel.com](https://vercel.com), 클라이언트 GitHub 저장소 연결)

### 3. 개발 도구
- VS Code (또는 선호 IDE)
- 추천 확장: ESLint, Prettier, REST Client 혹은 Thunder Client
- API 테스트 도구: Postman, 혹은 단순히 `curl`

---

## 🚀 프로젝트 시작하기

### Step 1: TypeScript + Express 프로젝트 개발환경 구축

```bash
# Express 프로젝트 폴더 생성
mkdir pwd-week6

# 프로젝트 폴더로 이동
cd pwd-week6

# 프로젝트 생성 및 런타임 의존성 설치
npm init -y
npm install express cors
```

새로 만든 폴더에서는 Git에 올리기 전에 루트에 `.gitignore`도 작성합니다. 기존 저장소에는 이미 있습니다.

```gitignore
node_modules/
dist/
coverage/
.env
.env.*
!.env.example
*.tsbuildinfo
```

### Step 2: 프로젝트 GitHub 저장소 연동
// 깃허브 접속 후 pwd-week6 저장소 생성 후

```bash
# 현재 폴더를 Git 저장소(Repository)로 초기화(Initialize)
git init

# 모든 변경 파일을 스테이징(Staging Area)에 추가
git add .

# 스테이징된 파일을 커밋(Commit)으로 기록 (-m: 메시지(Message) 옵션)
git commit -m "Init pwd-week6 : TypeScript Express"

# 기본 브랜치(Branch) 이름을 main으로 변경 (-m: move)
git branch -m main

# 원격(Remote) 저장소 'origin' 등록 (GitHub URL로 연결)
git remote add origin "https://github.com/<username>/pwd-week6.git"

# 로컬 main을 원격 origin/main으로 최초 푸시(Push) (-u: 업스트림(Upstream) 설정)
#  → 이후에는 git push 만으로도 동일 브랜치에 푸시 가능
git push -u origin main
```

// 이후 코드 수정 시
```bash
git add .

git commit -m "....."

git push -u origin main
```

<a id="typescript-run"></a>

### Step 3. TypeScript 의존성 설치와 개발 실행

아래 설정 파일은 이 저장소에 이미 포함되어 있습니다. 새 프로젝트를 직접 만드는 경우에만 같은 내용으로 작성합니다. **빈 폴더에서 만드는 경우에는 설정 작성·의존성 설치 후 Step 4~5의 폴더와 모든 소스·시드 JSON·테스트 파일을 먼저 작성한 뒤, Step 3-2로 돌아와 실행합니다.** `server.ts` 작성 전에는 개발 서버를 실행할 수 없습니다.

패키지 의존성(package.json) 설정
```json
{
  "name": "pwd-week4",
  "version": "1.0.0",
  "private": true,
  "type": "commonjs",
  "main": "dist/server.js",
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "dev": "tsx watch server.ts",
    "typecheck": "tsc --noEmit",
    "build": "tsc -p tsconfig.build.json && tsx scripts/copy-data.ts",
    "start": "node dist/server.js",
    "test": "jest --runInBand",
    "test:watch": "jest --watch --runInBand"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^5.1.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/jest": "^29.5.14",
    "@types/node": "^22.20.5",
    "@types/supertest": "^6.0.3",
    "jest": "^29.7.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.4.15",
    "tsx": "^4.23.15",
    "typescript": "^5.9.3"
  }
}
```

TypeScript, 테스트, 빌드 설정 파일을 다음과 같이 작성합니다.

`tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "rootDir": ".",
    "outDir": "dist",
    "strict": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "noEmitOnError": true,
    "sourceMap": true,
    "types": ["node", "jest"]
  },
  "include": ["server.ts", "src/**/*.ts", "tests/**/*.ts", "scripts/**/*.ts"],
  "exclude": ["node_modules", "dist", "coverage"]
}
```

`tsconfig.build.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["node"]
  },
  "include": ["server.ts", "src/**/*.ts"],
  "exclude": ["node_modules", "dist", "coverage", "tests", "scripts"]
}
```

`jest.config.cjs`

```js
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['node_modules', 'src/data'],
  moduleFileExtensions: ['ts', 'js', 'json'],
};
```

`scripts/copy-data.ts`

```ts
import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const source = path.join(__dirname, '..', 'src', 'data', 'restaurants.json');
const destination = path.join(__dirname, '..', 'dist', 'src', 'data');

// tsc는 파일 경로로 읽는 JSON을 복사하지 않으므로 빌드 결과에 함께 넣습니다.
mkdirSync(destination, { recursive: true });
copyFileSync(source, path.join(destination, 'restaurants.json'));
```

소스는 `import` / `export`를 사용하며, `type: "commonjs"`와 `module: "Node16"` 설정으로 Node.js에서 실행할 CommonJS JavaScript를 생성합니다. `tsconfig.json`은 코드·테스트·빌드 스크립트의 타입을 검사하고, `tsconfig.build.json`은 서버 코드만 `dist/`에 컴파일합니다. 시드 JSON은 `scripts/copy-data.ts`가 복사합니다.

`strict`는 엄격한 타입 검사를 활성화하며, Jest는 `ts-jest`로 TypeScript 테스트를 실행합니다.

#### 3-1. 프로젝트 루트에서 의존성 설치

터미널의 현재 폴더에 `package.json`, `package-lock.json`, `server.ts`가 있는지 확인합니다. 새로 내려받은 저장소에는 다음 명령을 사용합니다.

```bash
node --version
npm --version
npm ci --include=dev
```

`npm ci --include=dev`는 잠금 파일에 맞춰 런타임·개발 의존성을 설치합니다. TypeScript와 `tsx`는 배포용 빌드에도 필요합니다.

빈 폴더에서 처음 구성해 잠금 파일이 없거나, 의존성을 의도적으로 추가·변경했다면 `npm install`로 `package-lock.json`을 생성·갱신합니다. 이때 `package.json`과 `package-lock.json`을 함께 Git에 반영합니다. 이미 있는 잠금 파일을 지우는 방식으로 설치 오류를 해결하지 마세요.

#### 3-2. 개발 서버 실행

```bash
npm run dev
```

이 명령은 `tsx watch server.ts`를 실행합니다. TypeScript 소스를 실행하고, 사용 중인 소스 파일을 저장하면 서버 프로세스를 다시 시작합니다. 개발 실행을 위해 `dist/`를 먼저 만들 필요는 없습니다. 종료할 때는 터미널에서 `Ctrl+C`를 누릅니다.

기본 포트에서 정상 시작하면 다음 로그가 출력됩니다.

```text
Server listening on port 3000
```

다른 터미널에서 상태를 확인합니다. Windows PowerShell에서는 `curl` 대신 `curl.exe`를 사용하거나 브라우저로 같은 주소를 엽니다.

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/restaurants
```

`/health`의 정상 응답은 `{"status":"ok"}`입니다. 이 프로젝트는 API 서버이므로 루트 주소 `/`에는 화면이 없으며 `404`를 반환합니다.

`tsx`로 실행에 성공해도 타입 검사가 끝난 것은 아닙니다. 수정 후 별도 터미널에서 `npm run typecheck`를 실행하고, 기능 변경 후에는 `npm test`를 실행합니다.

#### 3-3. npm 명령별 역할

| 명령 | 내부 실행 | 사용할 때와 결과 |
| --- | --- | --- |
| `npm run dev` | `tsx watch server.ts` | 개발 중 소스를 실행하고 저장 시 서버를 재시작합니다. |
| `npm run typecheck` | `tsc --noEmit` | 서버·테스트·빌드 스크립트의 타입을 검사합니다. JavaScript 파일을 생성하지 않습니다. |
| `npm test` | `jest --runInBand` | TypeScript 테스트를 한 번 실행합니다. 별도로 서버를 켤 필요가 없습니다. |
| `npm run test:watch` | `jest --watch --runInBand` | 개발 중 변경과 관련된 테스트를 반복 실행합니다. |
| `npm run build` | `tsc -p tsconfig.build.json && tsx scripts/copy-data.ts` | 서버를 JavaScript로 컴파일하고 시드 JSON을 `dist/`에 복사합니다. |
| `npm start` | `node dist/server.js` | 미리 빌드한 JavaScript 서버를 실행합니다. 자동 빌드나 파일 감시는 하지 않습니다. |

#### 3-4. 로컬 포트와 환경변수

서버는 `PORT` 환경변수를 읽으며, 값이 없으면 `3000`을 사용합니다. 예를 들어 이미 3000번 포트를 사용 중이라면 다음과 같이 4000번으로 실행합니다.

macOS / Linux:

```bash
PORT=4000 npm run dev
```

Windows PowerShell:

```powershell
$env:PORT = "4000"
npm run dev
# Ctrl+C로 종료한 뒤 이 터미널의 설정을 해제할 때
Remove-Item Env:PORT
```

포트를 바꾸었다면 확인 주소도 `http://localhost:4000/health`로 바꿉니다. 환경변수 값은 문자열이므로 `server.ts`에서 `Number(process.env.PORT)`로 숫자로 변환합니다.

이 백엔드는 `.env` 파일을 자동으로 읽지 않습니다. 로컬에서는 위처럼 환경변수를 전달하고, Render에서는 서비스의 **Environment**에 입력합니다.

### Step 4. 폴더 구조 이해
```text
src/
 ├─ app.ts                  # Express 앱 구성
 ├─ routes/                 # 라우터 정의
 ├─ controllers/            # 요청/응답 컨트롤러
 ├─ services/               # 비즈니스 로직 (동기/비동기 비교)
 ├─ models/                 # 타입이 지정된 Restaurant 클래스
 ├─ middleware/             # NotFound, Error 핸들러
 ├─ types/                  # 맛집 입력·응답 타입과 공통 API 타입
 ├─ data/restaurants.json   # 시드 데이터
 └─ utils/                  # asyncHandler, HttpError
scripts/copy-data.ts         # 빌드 시 시드 JSON 복사
tests/                      # TypeScript 테스트
server.ts                   # Node 진입점
tsconfig.json               # 전체 타입 검사 설정
tsconfig.build.json         # 배포용 컴파일 설정
jest.config.cjs             # Jest 실행 설정
dist/                       # 빌드 결과 (Git 제외)
```

### Step 5. 프로젝트 기능 구현

실제 파일과 아래 예제는 동일한 코드입니다. 공통 타입과 오류 클래스를 먼저 살펴보세요.

```ts
// src/types/restaurant.types.ts
export interface RestaurantData {
  id: number;
  name: string;
  category: string;
  location: string;
  priceRange: string;
  rating: number;
  description: string;
  recommendedMenu: string[];
  likes: number;
  image: string;
}

// 모델은 숫자로 전달되거나 문자열로 전달된 값을 모두 숫자로 정규화합니다.
export interface RestaurantInput {
  id: number | string;
  name: string;
  category: string;
  location: string;
  priceRange: string;
  rating: number | string;
  description: string;
  recommendedMenu?: string[];
  likes?: number | string;
  image?: string;
}

export interface CreateRestaurantInput {
  name: string;
  category: string;
  location: string;
  priceRange?: string;
  rating?: number | string;
  description?: string;
  recommendedMenu?: string[];
  image?: string;
}

// HTTP 요청에는 필드가 빠질 수 있으므로 서비스에서 필수 값을 확인합니다.
export type CreateRestaurantBody = Omit<Partial<CreateRestaurantInput>, 'recommendedMenu'> & {
  recommendedMenu?: unknown;
};
```

```ts
// src/types/api.types.ts
export interface DataResponse<T> {
  data: T;
  meta?: {
    execution: 'synchronous';
  };
}

export interface ErrorResponse {
  error: {
    message: string;
    stack?: string;
  };
}
```

```ts
// src/utils/httpError.ts
export default class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}
```

`interface`는 데이터 형태를, `number | string`은 허용하는 값의 종류를, `Promise<Restaurant[]>`는 비동기 반환값을 나타냅니다. `Partial<CreateRestaurantInput>`은 필드 누락이 가능한 입력을 표현합니다.

```ts
// server.ts
import createApp from './src/app';

const PORT = Number(process.env.PORT) || 3000;
const app = createApp();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
```

```ts
// src/app.ts
import express, { type Express } from 'express';
import cors from 'cors';
import restaurantsRouter from './routes/restaurants.routes';
import notFound from './middleware/notFound.middleware';
import errorHandler from './middleware/error.middleware';

export default function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/restaurants', restaurantsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
```

- src/data/restaurants.json
```json
[
  {
    "id": 1,
    "name": "송림식당",
    "category": "한식",
    "location": "경기 수원시 영통구 월드컵로193번길 21 원천동",
    "priceRange": "7,000-13,000원",
    "rating": 4.99,
    "description": "최고의 한식 맛집입니다.",
    "recommendedMenu": ["순두부", "김치찌개","소불고기", "제육볶음"],
    "likes": 0,
    "image": "https://mblogthumb-phinf.pstatic.net/MjAyMjA2MTJfODEg/MDAxNjU0OTYzNTM3MjE1.1BfmrmOsz_B6DBHAnhQSs6qfNIDnssofR-DrzMfigIIg.JHHDheG6ifJjtfKUqLss_mLXWFE9fNJ5BmepNUVXSOog.PNG.cary63/image.png?type=w966"
  },
  {
    "id": 2,
    "name": "별미떡볶이",
    "category": "분식",
    "location": "경기 수원시 영통구 아주로 42 아카데미빌딩",
    "priceRange": "7,000-10,000원",
    "rating": 4.92,
    "description": "바삭한 튀김과 함께하는 행복한 한입",
    "recommendedMenu": ["떡볶이", "튀김", "순대", "어묵"],
    "likes": 0,
    "image": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA4MTJfMjcg%2FMDAxNzU0OTQ5ODk1Mjg0.GR6i3mNpJJXyqQrozGEJ65InCDBGlEmxc0aCeVHncJgg.sduDPX67J8hhoGxq4vLohpS4dXk1w-706dQLPfVs1iwg.JPEG%2Foutput%25A3%25DF1564208956.jpg"
  },
  {
    "id": 3,
    "name": "SOGO",
    "category": "일식",
    "location": "경기 수원시 영통구 월드컵로193번길 7",
    "priceRange": "10,000-16,000원",
    "rating": 4.89,
    "description": "일식 맛집, 구 허수아비,",
    "recommendedMenu": ["냉모밀", "김치돈까스나베", "코돈부르"],
    "likes": 0,
    "image": "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20190707_63%2F1562462598960nPDMy_JPEG%2FW7iKQEhTMzCF3flC1t0pzgzF.jpeg.jpg"
  }
]
```

```ts
// src/routes/restaurants.routes.ts
import { Router } from 'express';
import * as restaurantsController from '../controllers/restaurants.controller';

const router = Router();

router.get('/', restaurantsController.getRestaurants);
router.get('/sync-demo', restaurantsController.getRestaurantsSync);
router.get('/popular', restaurantsController.getPopularRestaurants);
router.get('/:id', restaurantsController.getRestaurant);
router.post('/', restaurantsController.createRestaurant);
router.post('/reset-demo', restaurantsController.resetDemoData);

export default router;
```

```ts
// src/middleware/error.middleware.ts
import type { ErrorRequestHandler } from 'express';
import type { ErrorResponse } from '../types/api.types';

const errorHandler: ErrorRequestHandler<Record<string, string>, ErrorResponse> = (err: unknown, req, res, next) => {
  const error = err instanceof Error ? err : new Error('Internal Server Error');
  const status = 'statusCode' in error && typeof error.statusCode === 'number'
    ? error.statusCode
    : 500;
  const payload: ErrorResponse = {
    error: {
      message: error.message || 'Internal Server Error'
    }
  };

  if (process.env.NODE_ENV !== 'production' && error.stack) {
    payload.error.stack = error.stack;
  }

  res.status(status).json(payload);
};

export default errorHandler;
```

```ts
// src/middleware/notFound.middleware.ts
import type { RequestHandler } from 'express';
import type { ErrorResponse } from '../types/api.types';

const notFound: RequestHandler<Record<string, string>, ErrorResponse> = (req, res) => {
  res.status(404).json({ error: { message: 'Resource not found' } });
};

export default notFound;
```

```ts
// src/controllers/restaurants.controller.ts
import type { RequestHandler } from 'express';
import * as restaurantService from '../services/restaurants.service';
import type { DataResponse, ErrorResponse } from '../types/api.types';
import type { CreateRestaurantBody, RestaurantData } from '../types/restaurant.types';
import asyncHandler from '../utils/asyncHandler';

type NoParams = Record<string, never>;
type RestaurantListResponse = DataResponse<RestaurantData[]>;

const normaliseMenu = (menu: unknown): string[] => {
  if (!menu) return [];
  if (Array.isArray(menu)) return menu.filter((item): item is string => typeof item === 'string');
  if (typeof menu === 'string') {
    return menu
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

export const getRestaurants = asyncHandler<NoParams, RestaurantListResponse>(async (req, res) => {
  const restaurants = await restaurantService.getAllRestaurants();
  res.json({ data: restaurants });
});

export const getRestaurantsSync: RequestHandler<NoParams, RestaurantListResponse> = (req, res) => {
  const restaurants = restaurantService.getAllRestaurantsSync();
  res.json({
    data: restaurants,
    meta: {
      execution: 'synchronous'
    }
  });
};

export const getRestaurant = asyncHandler<{ id: string }, DataResponse<RestaurantData> | ErrorResponse>(async (req, res) => {
  const restaurant = await restaurantService.getRestaurantById(req.params.id);

  if (!restaurant) {
    res.status(404).json({ error: { message: 'Restaurant not found' } });
    return;
  }

  res.json({ data: restaurant });
});

export const getPopularRestaurants = asyncHandler<NoParams, RestaurantListResponse, unknown, { limit?: string }>(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  const restaurants = await restaurantService.getPopularRestaurants(limit);
  res.json({ data: restaurants });
});

export const createRestaurant = asyncHandler<NoParams, DataResponse<RestaurantData>, CreateRestaurantBody | undefined>(async (req, res) => {
  const payload = {
    ...req.body,
    recommendedMenu: normaliseMenu(req.body?.recommendedMenu)
  };

  const restaurant = await restaurantService.createRestaurant(payload);
  res.status(201).json({ data: restaurant });
});

export const resetDemoData = asyncHandler<NoParams, RestaurantListResponse>(async (req, res) => {
  restaurantService.resetStore();
  const restaurants = await restaurantService.getAllRestaurants();
  res.json({ data: restaurants });
});
```

```ts
// src/services/restaurants.service.ts
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import Restaurant from '../models/restaurant.model';
import type { CreateRestaurantInput, RestaurantInput } from '../types/restaurant.types';
import HttpError from '../utils/httpError';

const DATA_PATH = path.join(__dirname, '..', 'data', 'restaurants.json');
let restaurantCache: Restaurant[] = loadRestaurantsSync();

export function loadRestaurantsSync(): Restaurant[] {
  const raw = readFileSync(DATA_PATH, 'utf8');
  const parsed: RestaurantInput[] = JSON.parse(raw);
  return parsed.map((item) => new Restaurant(item));
}

export async function loadRestaurantsAsync(): Promise<Restaurant[]> {
  const raw = await readFile(DATA_PATH, 'utf8');
  const parsed: RestaurantInput[] = JSON.parse(raw);
  return parsed.map((item) => new Restaurant(item));
}

async function ensureCache(): Promise<Restaurant[]> {
  if (!restaurantCache || restaurantCache.length === 0) {
    restaurantCache = await loadRestaurantsAsync();
  }
  return restaurantCache;
}

function nextRestaurantId(): number {
  return restaurantCache.reduce((max, restaurant) => Math.max(max, restaurant.id), 0) + 1;
}

function cloneCollection(collection: Restaurant[]): Restaurant[] {
  return collection.map((restaurant) => new Restaurant(restaurant));
}

// Simulates non-blocking I/O latency so students can compare async vs sync flows.
async function simulateLatency(delayInMs = 20): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayInMs));
}

export async function getAllRestaurants(): Promise<Restaurant[]> {
  await ensureCache();
  await simulateLatency();
  return cloneCollection(restaurantCache);
}

export function getAllRestaurantsSync(): Restaurant[] {
  if (!restaurantCache || restaurantCache.length === 0) {
    restaurantCache = loadRestaurantsSync();
  }
  return cloneCollection(restaurantCache);
}

export async function getRestaurantById(id: number | string): Promise<Restaurant | null> {
  await ensureCache();
  await simulateLatency();
  const numericId = Number(id);
  return restaurantCache.find((restaurant) => restaurant.id === numericId) || null;
}

export async function getPopularRestaurants(limit = 5): Promise<Restaurant[]> {
  const restaurants = await getAllRestaurants();
  return restaurants
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export async function createRestaurant(payload: Partial<CreateRestaurantInput>): Promise<Restaurant> {
  await ensureCache();
  await simulateLatency();

  const { name, category, location } = payload;
  if (!name || !category || !location) {
    const missingField = !name ? 'name' : !category ? 'category' : 'location';
    throw new HttpError(400, `'${missingField}' is required`);
  }

  const restaurant = new Restaurant({
    id: nextRestaurantId(),
    name,
    category,
    location,
    priceRange: payload.priceRange ?? '정보 없음',
    rating: payload.rating ?? 0,
    description: payload.description ?? '',
    recommendedMenu: payload.recommendedMenu ?? [],
    likes: 0,
    image: payload.image ?? ''
  });

  restaurantCache = [...restaurantCache, restaurant];
  return new Restaurant(restaurant);
}

export function resetStore(): void {
  restaurantCache = loadRestaurantsSync();
}
```

```ts
// src/models/restaurant.model.ts
import type { RestaurantData, RestaurantInput } from '../types/restaurant.types';

export default class Restaurant implements RestaurantData {
  id: number;
  name: string;
  category: string;
  location: string;
  priceRange: string;
  rating: number;
  description: string;
  recommendedMenu: string[];
  likes: number;
  image: string;

  constructor({
    id,
    name,
    category,
    location,
    priceRange,
    rating,
    description,
    recommendedMenu = [],
    likes = 0,
    image = ''
  }: RestaurantInput) {
    this.id = Number(id);
    this.name = name;
    this.category = category;
    this.location = location;
    this.priceRange = priceRange;
    this.rating = Number(rating);
    this.description = description;
    this.recommendedMenu = [...recommendedMenu];
    this.likes = Number(likes);
    this.image = image;
  }

  updateLikes(likes: number | string): this {
    this.likes = Number(likes);
    return this;
  }
}
```

```ts
// src/utils/asyncHandler.ts
import type { NextFunction, Request, RequestHandler, Response } from 'express';

export default function asyncHandler<
  Params = Record<string, string>,
  ResponseBody = unknown,
  RequestBody = unknown,
  Query = Request['query'],
>(
  handler: (
    req: Request<Params, ResponseBody, RequestBody, Query>,
    res: Response<ResponseBody>,
    next: NextFunction,
  ) => Promise<void>,
): RequestHandler<Params, ResponseBody, RequestBody, Query> {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
```

- TypeScript 테스트 코드 작성
```ts
// tests/restaurants.routes.test.ts
import type { Express } from 'express';
import request from 'supertest';
import createApp from '../src/app';
import * as restaurantService from '../src/services/restaurants.service';

describe('Restaurant routes', () => {
  let app: Express;

  beforeEach(() => {
    restaurantService.resetStore();
    app = createApp();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('GET /health reports server status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('GET /api/restaurants returns a list', async () => {
    const response = await request(app).get('/api/restaurants');
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test('GET /api/restaurants/sync-demo flags synchronous execution', async () => {
    const response = await request(app).get('/api/restaurants/sync-demo');
    expect(response.status).toBe(200);
    expect(response.body.meta.execution).toBe('synchronous');
  });

  test('GET /api/restaurants/:id returns an item', async () => {
    const response = await request(app).get('/api/restaurants/1');
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(1);
  });

  test('GET /api/restaurants/:id handles missing items', async () => {
    const response = await request(app).get('/api/restaurants/999');
    expect(response.status).toBe(404);
    expect(response.body.error.message).toContain('not found');
  });

  test('POST /api/restaurants validates payload', async () => {
    const response = await request(app)
      .post('/api/restaurants')
      .send({ name: '테스트' })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain('category');
  });

  test('POST /api/restaurants creates a restaurant', async () => {
    const payload = {
      name: '새로운 식당',
      category: '카페',
      location: '캠퍼스 타운',
    };

    const response = await request(app)
      .post('/api/restaurants')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe(payload.name);
  });

  test('GET /api/restaurants/popular respects the limit and rating order', async () => {
    const response = await request(app).get('/api/restaurants/popular?limit=2');
    const expectedIds = restaurantService.getAllRestaurantsSync()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2)
      .map((restaurant) => restaurant.id);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data.map((restaurant: { id: number }) => restaurant.id)).toEqual(expectedIds);
  });

  test.each([
    ['김밥, 라면, ', ['김밥', '라면']],
    [['김밥', '라면'], ['김밥', '라면']],
    [['김밥', 123], ['김밥']],
    [null, []],
  ])('POST /api/restaurants normalises menu %j', async (menu, expected) => {
    const response = await request(app).post('/api/restaurants').send({
      name: '메뉴 테스트 식당',
      category: '분식',
      location: '캠퍼스',
      recommendedMenu: menu,
    });

    expect(response.status).toBe(201);
    expect(response.body.data.recommendedMenu).toEqual(expected);
  });

  test('POST /api/restaurants handles an absent request body', async () => {
    const response = await request(app).post('/api/restaurants');
    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe("'name' is required");
  });

  test('POST /api/restaurants/reset-demo restores seed data', async () => {
    const original = restaurantService.getAllRestaurantsSync();
    await request(app).post('/api/restaurants').send({
      name: '임시 식당', category: '한식', location: '캠퍼스',
    }).expect(201);

    const response = await request(app).post('/api/restaurants/reset-demo');
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(JSON.parse(JSON.stringify(original)));
  });

  test('unknown routes return the standard 404 response', async () => {
    const response = await request(app).get('/unknown');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: { message: 'Resource not found' } });
  });

  test('async failures reach error middleware without exposing stacks in production', async () => {
    jest.replaceProperty(process, 'env', { ...process.env, NODE_ENV: 'production' });
    jest.spyOn(restaurantService, 'getAllRestaurants').mockRejectedValueOnce(new Error('Read failed'));

    const response = await request(app).get('/api/restaurants');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: { message: 'Read failed' } });
  });
});
```

```ts
// tests/restaurants.service.test.ts
import * as restaurantService from '../src/services/restaurants.service';

describe('RestaurantService', () => {
  afterEach(() => {
    restaurantService.resetStore();
  });

  test('getAllRestaurants resolves with data', async () => {
    const restaurants = await restaurantService.getAllRestaurants();
    expect(Array.isArray(restaurants)).toBe(true);
    expect(restaurants.length).toBeGreaterThan(0);
  });

  test('getAllRestaurantsSync returns data immediately', () => {
    const restaurants = restaurantService.getAllRestaurantsSync();
    expect(Array.isArray(restaurants)).toBe(true);
    expect(restaurants.length).toBeGreaterThan(0);
  });

  test('async and sync file loaders read the same seed data', async () => {
    expect(await restaurantService.loadRestaurantsAsync()).toEqual(restaurantService.loadRestaurantsSync());
  });

  test('returned collections do not expose cached menu arrays', async () => {
    const restaurants = await restaurantService.getAllRestaurants();
    restaurants[0].recommendedMenu.push('외부 변경');
    const fresh = restaurantService.getAllRestaurantsSync();
    expect(fresh[0].recommendedMenu).not.toContain('외부 변경');
  });

  test('createRestaurant appends a new entry', async () => {
    const payload = {
      name: '테스트 식당',
      category: '테스트',
      location: '가상 캠퍼스',
      rating: 4.5,
    };

    const created = await restaurantService.createRestaurant(payload);
    expect(created.id).toBeDefined();
    expect(created.name).toBe(payload.name);

    const all = await restaurantService.getAllRestaurants();
    const found = all.find((item) => item.id === created.id);
    expect(found).toBeTruthy();
  });

  test('createRestaurant rejects invalid payloads', async () => {
    await expect(
      restaurantService.createRestaurant({ name: '누락된 식당' })
    ).rejects.toThrow("'category' is required");
  });
});
```

### Step 6. API 응답 확인
```bash
# 전체 맛집 목록
curl http://localhost:3000/api/restaurants

# 인기 맛집 3개만 보기
curl "http://localhost:3000/api/restaurants/popular?limit=3"

# 신규 맛집 추가 (macOS/Linux)
curl -X POST http://localhost:3000/api/restaurants \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ajou Cafeteria","category":"한식","location":"기숙사 1층","recommendedMenu":["라면","김밥"],"rating":4.6}'
```
> Windows PowerShell에서는 `curl.exe`와 PowerShell 문법에 맞는 인수·줄바꿈을 사용하세요.

<a id="typescript-build"></a>

### Step 7. 타입 검사·테스트·배포용 빌드

#### 7-1. 배포 전 검증 순서

프로젝트 루트에서 아래 순서로 실행합니다. 각 명령이 성공한 뒤 다음 단계로 진행합니다.

```bash
npm ci --include=dev
npm run typecheck
npm test
npm run build
```

타입 검사는 서버뿐 아니라 `tests/`, `scripts/`까지 포함합니다. Jest는 Express 앱을 직접 생성하므로 개발 서버를 별도로 켤 필요가 없고, 테스트마다 시드 데이터로 상태를 초기화합니다. `npm run build`는 서버 코드의 컴파일과 데이터 복사를 담당하며 전체 타입 검사 명령과 테스트를 자동으로 실행하지는 않습니다.

#### 7-2. 빌드 결과 이해

`npm run build`는 다음 두 작업을 차례로 수행합니다.

1. `tsc -p tsconfig.build.json`: `server.ts`와 `src/**/*.ts`를 컴파일합니다. `strict` 타입 오류가 있으면 컴파일에 실패합니다.
2. `tsx scripts/copy-data.ts`: 파일 경로로 읽는 시드 JSON을 빌드 폴더로 복사합니다. 컴파일이 실패하면 이 단계는 실행되지 않습니다.

주요 결과물은 다음과 같습니다. `rootDir`이 프로젝트 루트이므로 진입점은 **`dist/server.js`**이고, 앱 모듈은 **`dist/src/app.js`**입니다.

```text
dist/
 ├─ server.js
 ├─ server.js.map
 └─ src/
     ├─ app.js
     ├─ controllers/
     ├─ middleware/
     ├─ models/
     ├─ routes/
     ├─ services/
     ├─ types/
     ├─ utils/
     └─ data/restaurants.json
```

`tests/`와 빌드용 `scripts/`는 배포 결과에 컴파일하지 않습니다. `dist/`는 `.gitignore`에 포함되어 있으며 Render에서 소스로부터 다시 생성합니다. `src/data/restaurants.json`은 Git에 포함되어야 합니다.

#### 7-3. 로컬에서 배포 방식으로 실행

동일한 포트에서 실행 중인 개발 서버를 `Ctrl+C`로 종료한 뒤 실행합니다.

```bash
npm start
```

다른 터미널에서 `curl http://localhost:3000/health`와 `curl http://localhost:3000/api/restaurants`로 확인합니다. `npm start`는 현재 `dist/`의 코드만 실행하므로 `.ts`를 수정한 뒤에는 다시 `npm run build`하고 서버를 재시작해야 변경 내용이 반영됩니다.

#### 7-4. 배포할 소스를 GitHub에 반영

Render는 로컬 작업 폴더가 아니라 연결한 GitHub 브랜치의 커밋을 가져옵니다. 변경 파일을 확인하고, 검증한 소스와 설정을 해당 브랜치에 커밋·푸시합니다.

```bash
git status --short
git add -A
git commit -m "Configure TypeScript API build and deployment"
git push origin main
```

`package.json`, `package-lock.json`, `tsconfig*.json`, `jest.config.cjs`, `server.ts`, `src/`, `scripts/`, `tests/`가 저장소에 포함되어야 합니다. `node_modules/`, `dist/`, 로컬 `.env`는 포함하지 않습니다. 사용하는 브랜치가 `main`이 아니라면 푸시 대상과 Render의 `Branch`를 같은 이름으로 맞춥니다.

---

<a id="render-deploy"></a>

### Step 8. Render에서 GitHub 저장소 연결

#### 8-1. 계정과 Git 배포 권한 연결

1. [Render Dashboard](https://dashboard.render.com/)에 로그인하고 사용할 워크스페이스를 선택합니다.
2. GitHub가 연결되어 있지 않다면 **Account Settings → Account Security → Git Deployment Credentials → Add credential**에서 GitHub를 선택합니다.
3. GitHub 인증 화면에서 Render의 접근을 허용하고 배포할 저장소가 접근 대상에 포함되도록 설정합니다. 서비스 생성 화면에서 Git provider 연결을 시작해도 됩니다.

저장소가 목록에 없다면 GitHub 계정과 Render 앱의 저장소 접근 권한을 확인합니다. 로그인용 GitHub 연결과 배포할 저장소에 대한 접근 권한을 함께 확인하세요. [Git provider 연결 문서](https://render.com/docs/git-provider)

#### 8-2. Web Service 생성 시작

1. 대시보드 오른쪽 위 **+ New → Web Service**를 선택합니다. 이 프로젝트는 HTTP 요청을 처리하는 Express API이므로 `Web Service`를 사용합니다.
2. 코드 소스로 **Git Provider**를 선택합니다.
3. 본인 계정의 실제 저장소를 선택하고 **Connect**를 누릅니다. 이 프로젝트를 그대로 사용한다면 저장소 이름은 `pwd-week6`입니다.

Git provider를 연결하면 이후 커밋을 자동 배포할 수 있습니다. `Public Git Repository`에 URL만 입력하는 연결 방식은 자동 배포를 지원하지 않습니다. [Web Service 코드 연결 방식](https://render.com/docs/web-services#deploy-your-own-code)

### Step 9. Render 빌드·실행·환경변수 설정

#### 9-1. 생성 폼 입력값

자동 입력된 명령도 아래 값과 비교해 수정합니다. 특히 TypeScript 컴파일이 Build Command에 포함되어야 합니다.

| 화면 항목 | 이 프로젝트의 입력값 | 설명 |
| --- | --- | --- |
| **Name** | 예: `pwd-week6-yourname` | 서비스를 구분하는 이름입니다. 생성 후 표시되는 실제 공개 URL을 확인합니다. |
| **Language** | `Node` | TypeScript를 빌드한 뒤 Node.js로 실행합니다. |
| **Branch** | `main` 또는 실제 배포 브랜치 | 검증한 커밋을 푸시한 브랜치를 선택합니다. |
| **Region** | 예: `Singapore` | 한국에서 사용하는 수업 예제의 선택 예시입니다. |
| **Root Directory** | 비워둠 | 현재 저장소는 루트에 `package.json`이 있습니다. |
| **Build Command** | `npm ci --include=dev && npm run build` | 의존성을 설치하고 JavaScript·시드 JSON을 준비합니다. |
| **Start Command** | `npm start` | `node dist/server.js`를 실행합니다. |
| **Compute / Instance Type** | `Free` | 학습용 서비스의 선택 예시입니다. 최종 선택된 플랜을 확인합니다. |

`Region`에서 기존 서비스 지역만 보이면 **Deploy in a new region**에서 다른 지역을 선택할 수 있습니다. 생성한 서비스의 지역은 직접 변경할 수 없으므로 처음 선택할 때 확인합니다. [Render 지역 설정](https://render.com/docs/regions)

`Root Directory`는 비워둡니다. `src`나 `dist`를 입력하지 않습니다.

빌드 중에는 `typescript`, `tsx` 같은 개발 의존성이 필요합니다. `NODE_ENV=production`을 설정하더라도 `npm ci --include=dev`로 이들을 설치해야 합니다. 실행 단계의 `npm start`는 컴파일된 서버를 사용합니다.

#### 9-2. 환경변수와 Node.js 버전

생성 폼의 **Environment Variables**에서 아래 값을 추가합니다. 항목이 접혀 있다면 `Advanced` 영역을 확인합니다.

| Key | Value | 용도 |
| --- | --- | --- |
| `NODE_ENV` | `production` | 배포 환경으로 실행하고 API 오류 응답의 스택을 숨깁니다. |
| `NODE_VERSION` | `node --version` 출력에서 `v`를 뺀 값 | 로컬에서 사용하는 Node 24.x 버전을 지정합니다. |
| `PORT` | 직접 추가하지 않음 | Render가 제공하는 포트를 `server.ts`에서 읽습니다. |

`NODE_VERSION`에는 로컬에서 사용한 Node 24.x의 정확한 버전을 입력합니다. `package.json`의 `>=22`만으로는 배포 버전이 고정되지 않습니다.

Render 웹 서비스의 기본 `PORT`는 `10000`입니다. 현재 `server.ts`는 제공된 `PORT`를 사용하고 로컬에서만 기본값 `3000`을 사용합니다. 공개 요청을 받는 서버는 루프백 주소인 `127.0.0.1`이나 `localhost`에만 묶이지 않아야 합니다. 이 코드의 `app.listen(PORT, ...)`는 호스트를 제한하지 않고 수신합니다. [Render 포트 바인딩 안내](https://render.com/docs/web-services#port-binding)

이미 만든 서비스의 환경변수는 다음 경로로 변경합니다.

1. 서비스 왼쪽 메뉴의 **Environment**를 엽니다.
2. **Environment Variables → + Add Environment Variable**에서 Key와 Value를 입력합니다. 여러 값은 **Add from .env**로 가져올 수도 있습니다.
3. 저장 버튼의 드롭다운에서 적용 방식을 선택합니다.

| 저장 옵션 | 적용 방식 |
| --- | --- |
| **Save, rebuild, and deploy** | 새 환경변수로 다시 빌드한 뒤 배포합니다. `NODE_VERSION`처럼 빌드에 영향을 주는 값 변경에 사용합니다. |
| **Save and deploy** | 기존 빌드 결과를 새 환경변수로 다시 실행합니다. |
| **Save only** | 값만 저장하며 다음 배포 전까지 실행 중인 서비스에 반영되지 않습니다. |

위 메뉴와 저장 동작은 [환경변수 설정 문서](https://render.com/docs/configure-environment-variables#in-the-render-dashboard)를 기준으로 합니다.

#### 9-3. Health Check 설정

생성 화면의 `Advanced`에서 **Health Check Path**를 찾을 수 있으면 `/health`를 입력합니다. 생성 후에는 **Settings → Health Checks → Edit**에서 `/health`를 입력하고 **Save Changes**를 누릅니다. 전체 URL이 아니라 `/`로 시작하는 경로만 입력합니다. [Health Check 설정](https://render.com/docs/health-checks#setup)

이 프로젝트의 `/health`는 HTTP `200`과 `{"status":"ok"}`를 반환합니다. 루트 `/`는 `404`이므로 Health Check Path로 사용하지 않습니다.

#### 9-4. 첫 배포와 자동 배포

폼 하단의 **Deploy** 버튼으로 서비스를 생성합니다. 화면에 **Create Web Service**로 표시되면 해당 버튼을 사용합니다. 생성 후 **Deploys**에서 빌드·시작 로그를 확인하고 상태가 **Live**가 되는지 확인합니다. [첫 배포와 로그 확인](https://render.com/docs/your-first-deploy#5-monitor-your-deploy)

자동 배포는 서비스의 **Settings → Auto-Deploy**에서 설정합니다.

| Auto-Deploy 값 | 동작과 사용 조건 |
| --- | --- |
| **On Commit** | 연결된 브랜치에 push 또는 merge할 때 자동 배포합니다. 이 예제의 기본 선택입니다. |
| **After CI Checks Pass** | GitHub Actions 등 저장소의 CI 검사가 통과한 뒤 배포합니다. CI를 실제로 구성한 경우에 사용합니다. |
| **Off** | 자동 배포를 끄고 수동으로 배포합니다. |

현재 저장소에는 CI 워크플로가 없습니다. `After CI Checks Pass`는 검사 결과가 하나도 없으면 배포하지 않으므로 `On Commit`을 사용합니다. 로컬에서 `npm test`를 실행하는 것만으로 GitHub CI 결과가 생기지는 않습니다. [자동 배포 옵션과 CI 조건](https://render.com/docs/deploys#configuring-auto-deploys)

---

<a id="render-verify"></a>

### Step 10. 배포 확인·재배포·문제 해결

#### 10-1. 공개 URL과 응답 확인

서비스 화면에 표시된 실제 `https://...onrender.com` URL을 복사합니다. 아래 예제의 `https://YOUR-SERVICE.onrender.com` 전체를 복사한 공개 URL로 바꾸고, Windows PowerShell에서는 `curl.exe`를 사용합니다.

```bash
# 상태 확인: HTTP 200과 {"status":"ok"} 확인
curl -i --max-time 120 "https://YOUR-SERVICE.onrender.com/health"

# 시드 데이터가 포함된 맛집 목록 확인
curl -i "https://YOUR-SERVICE.onrender.com/api/restaurants"

# 인기 맛집 2개 확인
curl -i "https://YOUR-SERVICE.onrender.com/api/restaurants/popular?limit=2"

# 개별 맛집과 존재하지 않는 ID의 응답 확인
curl -i "https://YOUR-SERVICE.onrender.com/api/restaurants/1"
curl -i "https://YOUR-SERVICE.onrender.com/api/restaurants/999"
```

예상 결과는 상태·목록·인기 목록·ID 1이 `200`, 존재하지 않는 ID가 `404`입니다. 브라우저로 서비스 루트 `/`만 열어 `Resource not found`가 표시되면 `/health`와 `/api/restaurants`를 확인합니다.

다음 요청으로 맛집 등록과 데이터 초기화를 확인합니다. `YOUR-SERVICE`는 본인의 서비스 주소로 바꿉니다. 초기화하면 추가한 맛집이 지워지고 시드 데이터로 돌아갑니다. 아래 JSON 전송 문법은 macOS / Linux용입니다.

```bash
curl -i -X POST "https://YOUR-SERVICE.onrender.com/api/restaurants" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Render 테스트 식당","category":"한식","location":"아주대 정문","recommendedMenu":"김밥, 라면"}'

curl -i -X POST "https://YOUR-SERVICE.onrender.com/api/restaurants/reset-demo"
```

등록은 `201`과 생성된 맛집을, 초기화는 `200`과 시드 목록을 반환합니다. Render **Deploys**에서는 배포 로그를, **Logs**에서는 실행 중 서버 로그를 확인합니다. 시작 로그는 제공된 포트에 따라 `Server listening on port 10000`과 같이 표시됩니다. [Render 로그 화면](https://render.com/docs/logging)

#### 10-2. 코드 수정 후 재배포

`On Commit`을 선택했다면 로컬에서 타입 검사·테스트·빌드를 통과시킨 변경을 연결 브랜치에 커밋·푸시하고, `Deploys`에서 새 커밋의 배포 결과를 확인합니다. 실패했을 때는 로그에서 **처음 발생한 오류**를 확인합니다.

수동 배포는 **Deploys → Manual Deploy**에서 선택합니다.

| 메뉴 | 사용할 때 |
| --- | --- |
| **Deploy latest commit** | 연결 브랜치의 최신 커밋을 다시 빌드·배포할 때 |
| **Clear build cache & deploy** | 빌드 설정 변경 후 이전 캐시 영향이 의심될 때 |
| **Restart service** | 현재 배포된 커밋과 환경변수로 재시작할 때 |

`Restart service`는 저장만 해둔 새 환경변수를 적용하는 방법이 아닙니다. 환경변수 변경은 Step 9-2의 저장·배포 옵션을 사용합니다. [수동 배포와 재시작 동작](https://render.com/docs/deploys#manual-deploys)

#### 10-3. Free 서비스와 이 예제의 데이터 보관 방식

Render Free 서비스는 대기 후 첫 요청에 응답하기까지 약 1분이 걸릴 수 있습니다. 먼저 `/health` 응답을 확인한 뒤 클라이언트를 새로고침합니다.

이 실습에서 등록한 맛집은 서버가 실행되는 동안 유지됩니다. 재시작하면 시드 데이터로 돌아가므로 등록 후 서버를 재시작하지 않은 상태에서 목록 반영을 확인합니다.

Step 11의 연동 코드는 API 응답을 최대 60초 기다리며, 실패를 대체 데이터로 숨기지 않습니다. Free 서비스가 다시 시작되는 동안 시간 초과가 발생할 수 있으므로 먼저 `/health` 응답을 확인한 뒤 프론트엔드를 새로고침합니다.

#### 10-4. 자주 발생하는 오류

| 증상 | 확인과 해결 |
| --- | --- |
| `tsc: not found`, `tsx: not found` | 프로젝트 루트에서 개발 의존성까지 설치했는지 확인합니다. Render Build Command는 `npm ci --include=dev && npm run build`를 사용합니다. |
| `npm ci`에서 잠금 파일 불일치 오류 | 로컬에서 의도한 의존성에 맞게 `npm install`하고 두 package 파일을 함께 커밋합니다. |
| `package.json`을 찾지 못함 | 로컬 작업 폴더 또는 Render `Root Directory`가 `package.json` 위치인지 확인합니다. |
| `Cannot find module .../dist/server.js` | 빌드 성공 여부와 Start Command를 확인합니다. 현재 진입점은 `dist/server.js`입니다. |
| `ENOENT .../data/restaurants.json` | 시드 JSON이 Git에 포함되었는지, `npm run build`의 데이터 복사 단계까지 완료됐는지 확인합니다. |
| `TS...` 타입 오류로 빌드 실패 | 로컬 `npm run typecheck`로 오류 위치를 확인하고 수정한 뒤 다시 빌드합니다. |
| 로컬 `EADDRINUSE` | 같은 포트의 이전 서버를 종료하거나 Step 3-4처럼 `PORT`를 바꿉니다. |
| Render가 수신 포트를 찾지 못함 | 시작 로그와 `process.env.PORT` 사용 여부를 확인합니다. 현재 Start Command가 서버를 실행하는지, 호스트를 localhost로 제한한 수정이 없는지 확인합니다. |
| `/` 또는 Health Check에서 404 | 실제 확인 경로와 Health Check Path를 `/health`로 지정합니다. |
| push해도 배포가 시작되지 않음 | 연결 브랜치, Git provider 연결, `Auto-Deploy` 값을 확인합니다. CI가 없으면 `On Commit`을 사용합니다. |
| 배포 후 추가한 맛집이 사라짐 | 서버가 재시작되면 시드 데이터로 돌아갑니다. 새 맛집을 등록하고 재시작 없이 목록을 확인합니다. |
| React에서 예전 주소로 요청하거나 API 오류가 보임 | `VITE_API_BASE_URL`의 실제 Render 주소, 프론트엔드 재빌드 여부, Free 서비스 기동 상태를 확인합니다. |

이 밖의 플랫폼 오류는 [Render 배포 문제 해결 문서](https://render.com/docs/troubleshooting-deploys)에서 해당 로그 메시지를 확인합니다.

---

<a id="vercel-client"></a>

### Step 11. TypeScript React 클라이언트 연동과 Vercel 배포

#### 11-1. 클라이언트 API 모듈과 로컬 환경변수 설정

다음 작업은 **`pwd-week5` React 클라이언트**에서 진행합니다. 기존 제보 기능을 유지하도록 원래 API 모듈을 보관한 뒤 백엔드 연동 모듈을 작성합니다.

1. 클라이언트의 `src/services/api.ts`를 **한 번만** `src/services/api.local.ts`로 옮깁니다. 이미 `api.local.ts`가 있으면 이 이동을 반복하지 않습니다.
2. 아래 코드로 새 `src/services/api.ts`를 작성합니다. 공유 타입은 기존 `src/types/index.ts`를 사용하고, `submissionAPI`는 보관한 모듈에서 다시 내보냅니다.
3. `src/pages/AdminPage.tsx`에서 이번 주 서버가 제공하지 않는 맛집 수정·삭제 버튼을 아래 예처럼 비활성화합니다.

macOS / Linux에서 최초 이동:

```bash
# pwd-week5 프로젝트 루트에서 한 번만 실행
mv src/services/api.ts src/services/api.local.ts
```

Windows PowerShell에서 최초 이동:

```powershell
Move-Item src/services/api.ts src/services/api.local.ts
```

클라이언트 루트의 `.env.local`에는 로컬 API 주소를 입력합니다. 아래 환경변수는 Vite가 읽습니다.

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

Vercel의 `VITE_API_BASE_URL`에는 Step 11-5처럼 **실제 HTTPS Render 공개 URL**을 별도로 등록합니다. 두 값 모두 뒤에 `/api/restaurants`를 붙이지 않습니다. 환경변수를 바꾼 뒤에는 로컬 개발 서버 재시작 또는 배포용 재빌드가 필요합니다. [Vite 환경변수](https://vite.dev/guide/env-and-mode)

`pwd-week5`는 Vite 클라이언트 타입이 이미 설정되어 있으므로 아래 API 모듈을 바로 작성합니다.

새 `src/services/api.ts`:

```ts
import axios from 'axios';
import type { ApiResponse, CreateRestaurantInput, EntityId, Restaurant } from '../types';
import { restaurantAPI as localRestaurantAPI } from './api.local';

// 제보는 이전 주차의 브라우저 저장 기능을 유지합니다.
export { submissionAPI } from './api.local';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, '');
const http = axios.create({ baseURL: API_BASE_URL, timeout: 60000 });

function requireApiUrl(): void {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL을 설정한 뒤 개발 서버 재시작 또는 재배포가 필요합니다.');
  }
}

async function getData<T>(url: string): Promise<ApiResponse<T>> {
  requireApiUrl();
  const response = await http.get<ApiResponse<T>>(url);
  return response.data;
}

// 이번 주 서버는 수정·삭제 API를 제공하지 않습니다.
const updateRestaurant: typeof localRestaurantAPI.updateRestaurant = async () => {
  throw new Error('이번 주 서버는 맛집 수정 API를 제공하지 않습니다.');
};
const deleteRestaurant: typeof localRestaurantAPI.deleteRestaurant = async () => {
  throw new Error('이번 주 서버는 맛집 삭제 API를 제공하지 않습니다.');
};

export const restaurantAPI = {
  ...localRestaurantAPI,
  getRestaurants: (): Promise<ApiResponse<Restaurant[]>> => getData('/api/restaurants'),
  getRestaurantById: (id: EntityId): Promise<ApiResponse<Restaurant>> =>
    getData(`/api/restaurants/${encodeURIComponent(String(id))}`),
  getPopularRestaurants: (): Promise<ApiResponse<Restaurant[]>> =>
    getData('/api/restaurants/popular'),
  createRestaurant: async (payload: CreateRestaurantInput): Promise<ApiResponse<Restaurant>> => {
    requireApiUrl();
    const response = await http.post<ApiResponse<Restaurant>>('/api/restaurants', payload);
    return response.data;
  },
  updateRestaurant,
  deleteRestaurant,
};

export default restaurantAPI;
```

`AdminPage.tsx`의 기존 수정·삭제 버튼 두 개에 `disabled`와 안내 문구를 추가합니다. 기존 `onClick` 참조는 유지하므로 타입 검사와 lint에서도 사용하지 않는 함수 오류가 발생하지 않습니다.

```tsx
<Button disabled title="이번 주 서버는 수정 API를 제공하지 않습니다." onClick={() => onEdit(r)}>수정</Button>
<Danger disabled title="이번 주 서버는 삭제 API를 제공하지 않습니다." onClick={() => onDelete(r)}>삭제</Danger>
```

이번 주 완성할 동작과 데이터 위치는 다음과 같습니다.

| 기능 | 동작과 저장 위치 |
| --- | --- |
| 맛집 목록·상세·인기 목록 | Render의 `/api/restaurants` 계열 GET API 조회 |
| 관리자 화면의 새 맛집 생성 | Render의 `POST /api/restaurants` 호출 |
| 제보 작성·조회·승인 상태·삭제 | 기존 브라우저 LocalStorage 기능 유지 |
| 제보 승인 후 맛집 등록 | 같은 브라우저의 제보를 읽어 Render 등록 API 호출 |
| 좋아요 | 기존 브라우저 LocalStorage 기능 유지 |
| 맛집 수정·삭제 | 이번 주 서버에 해당 API가 없어 관리자 버튼 비활성화 |

제보와 좋아요는 해당 브라우저의 LocalStorage를 사용합니다. 맛집 조회·등록은 위 표의 Render API를 사용합니다.

#### 11-2. 클라이언트 빌드와 GitHub 반영

다음 명령은 **별도 React 클라이언트 프로젝트의 루트**에서 실행합니다. 해당 폴더의 `package.json`에서 `dev`가 Vite 개발 서버를, `build`가 Vite의 프로덕션 빌드를 실행하는지 확인합니다. 이 백엔드 저장소의 `npm run build`는 Express 서버용이므로 클라이언트 배포에는 React 저장소를 사용합니다.

```bash
# 클라이언트 package-lock.json이 있는 경우
npm ci --include=dev

# 로컬 연동 확인 (종료: Ctrl+C)
npm run dev

# 개발 서버를 종료한 뒤 배포용 빌드 확인
npm run typecheck
npm run lint
npm run build
```

잠금 파일이 없는 새 클라이언트 프로젝트는 `npm install`로 의존성과 잠금 파일을 준비합니다. 기본 Vite 설정에서는 빌드 후 `dist/index.html`과 정적 리소스가 생성됩니다. 프로젝트에서 `build.outDir`를 변경했다면 Vercel의 Output Directory도 그 경로로 맞춥니다.

검증한 `src/services/api.ts`, `src/services/api.local.ts`, `src/pages/AdminPage.tsx`, `package.json`, 잠금 파일을 클라이언트 GitHub 저장소에 커밋·푸시합니다. `.env.local`은 로컬용이며 Vercel에는 별도로 값을 입력합니다.

#### 11-3. Vercel에서 클라이언트 저장소 가져오기

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인하고 사용할 계정·팀을 선택합니다.
2. **Add New… → Project**를 선택합니다. **New Project** 화면은 [vercel.com/new](https://vercel.com/new)에서 바로 열 수도 있습니다.
3. **Import Git Repository**에서 GitHub를 연결하고 React 클라이언트 저장소 옆의 **Import**를 선택합니다. 예시 저장소 이름은 `pwd-week5`이며, 실제 클라이언트 저장소 이름으로 선택합니다.
4. 목록에 없다면 연결된 GitHub 계정과 Vercel GitHub 앱의 저장소 접근 범위를 확인합니다.

저장소를 가져온 뒤 프로젝트 이름, 프레임워크, 루트 폴더, 빌드 설정, 환경변수를 지정하는 생성 화면으로 이동합니다. [Git 저장소 가져오기](https://vercel.com/docs/git#deploying-a-git-repository)

#### 11-4. Vite 빌드 설정 입력

| 화면 항목 | 입력값·확인 내용 |
| --- | --- |
| **Project Name** | 예: `pwd-week5-yourname`. 생성 후 표시되는 실제 도메인을 사용합니다. |
| **Framework Preset** | `Vite`. 자동 감지 결과를 확인합니다. |
| **Root Directory** | 클라이언트의 `package.json`이 있는 폴더. 클라이언트 전용 저장소라면 기본값 `./`를 사용합니다. |
| **Build Command** | `npm run build`. React 프로젝트의 빌드 스크립트를 실행합니다. |
| **Output Directory** | 기본 Vite 프로젝트는 `dist`. 정적 HTML·CSS·JavaScript가 생성되는 폴더입니다. |
| **Install Command** | 잠금 파일에 따라 자동 감지된 기본값을 사용합니다. npm 잠금 파일이 있고 재현 가능한 설치를 지정하려면 `npm ci --include=dev`로 Override할 수 있습니다. |

생성 화면의 **Build and Output Settings**에서 자동 설정값을 확인하고 필요한 항목만 변경합니다. 기존 프로젝트는 **Settings → Build and Deployment**에서 수정하고 저장합니다. [빌드 설정과 Override](https://vercel.com/docs/builds/configure-a-build)

Vercel의 Node.js 버전은 `24.x`로 설정합니다. 생성 후에는 **Settings → Build and Deployment → Node.js Version**에서 확인할 수 있습니다. 클라이언트 `package.json`의 `engines.node`도 `24.x`를 사용합니다.

#### 11-5. Vercel 환경변수 등록

첫 배포 전 생성 폼의 **Environment Variables**에 다음 값을 등록합니다.

| 항목 | 값 |
| --- | --- |
| **Name / Key** | `VITE_API_BASE_URL` |
| **Value** | 실제 Render 공개 URL. 예: `https://YOUR-SERVICE.onrender.com` |
| **Environment** | `Production`과 `Preview`에 적용 |
| **변수 유형** | `Config`. 브라우저에 포함되는 공개 API 주소입니다. |

Value에는 따옴표, `/api/restaurants`, 로컬 `localhost` 주소를 붙이지 않습니다. 로컬 `.env.local`을 작성했더라도 Vercel 프로젝트에도 등록해야 합니다. `Production`은 정식 배포, `Preview`는 다른 브랜치·PR의 미리보기 배포에서 사용할 값입니다. [환경별 변수 적용](https://vercel.com/docs/environment-variables)

기존 프로젝트에서는 **Environment Variables** 메뉴를 열어 `Add New` 영역에서 이름·값·적용 환경을 입력하고 **Save**합니다. 환경변수 화면이 Settings 안에 표시되면 **Settings → Environment Variables**로 이동합니다. 저장한 값은 새 배포부터 반영되므로 Step 11-7에 따라 재배포합니다. [환경변수 추가·수정](https://vercel.com/docs/environment-variables/managing-environment-variables)

#### 11-6. 첫 배포와 Render API 연결 확인

생성 폼 하단의 **Deploy**를 누르고 빌드 로그를 확인합니다. 프로젝트의 **Deployments**에서 해당 배포가 `Ready`인지 확인한 뒤 제공된 URL로 앱을 엽니다. 제출용 주소는 프로젝트의 정식 Production 도메인(예: `https://pwd-week5-yourname.vercel.app`)을 복사합니다.

`Ready`를 확인한 뒤 아래 Network 요청과 화면 동작까지 확인합니다.

브라우저 개발자 도구의 **Network** 탭에서 다음을 확인합니다.

- 맛집 목록·상세 화면이 정상 표시되는지 확인합니다.
- 목록 요청이 `https://실제-Render-주소/api/restaurants`로 전송되고 `200`을 받는지 확인합니다.
- 관리자 `/#/admin`에서 새 맛집을 생성한 뒤 `/#/list`에 표시되는지, 등록 요청이 `201`인지 확인합니다. 수정·삭제 버튼은 비활성화되어 있어야 합니다.
- 제보 `/#/submit`은 LocalStorage에 기록하고, 같은 브라우저의 `/#/submissions`에서 승인하면 Render 등록 요청이 발생하는지 확인합니다.
- Render Free 서비스가 대기 중이면 먼저 `/health` 응답을 기다린 뒤 Vercel 앱을 새로고침합니다.

백엔드의 `app.use(cors())`는 Vercel 클라이언트의 브라우저 요청을 허용합니다.

#### 11-7. 코드 수정·환경변수 변경 후 재배포

GitHub에 연결한 프로젝트는 Production Branch(보통 `main`)의 새 커밋을 Production으로, 다른 브랜치의 커밋을 Preview로 자동 배포합니다. 제출 전에는 **Deployments**에서 Environment가 `Production`인 배포와 실제 커밋을 확인합니다. [Production·Preview 브랜치 배포](https://vercel.com/docs/git#production-branch)

Production 브랜치를 확인·변경하려면 **Settings → Environments → Production → Branch Tracking**에서 브랜치 이름을 확인하고 변경 시 **Save**합니다. [Production 브랜치 설정](https://vercel.com/docs/git#customizing-the-production-branch)

환경변수나 빌드 설정만 변경했다면 다음 순서로 수동 재배포합니다.

1. 프로젝트의 **Deployments**에서 재배포할 항목을 찾습니다.
2. 해당 배포의 **… → Redeploy**를 선택합니다.
3. 대상 환경이 맞는지 확인하고 **Redeploy**를 누릅니다. 빌드 캐시 영향이 의심되면 기존 Build Cache를 사용하지 않도록 선택합니다.
4. 새 배포가 `Ready`가 되면 Production URL에서 Network 요청 주소를 다시 확인합니다.

브라우저 새로고침만으로 이미 빌드된 API 주소가 바뀌지는 않습니다. 환경변수 변경은 새 빌드·배포가 필요합니다. [재배포 메뉴](https://vercel.com/docs/deployments/managing-deployments#redeploy-a-project)

#### 11-8. 클라이언트 경로와 새로고침 확인

현재 `pwd-week5`는 **HashRouter**를 사용합니다. 목록은 `/#/list`, 상세는 `/#/restaurant/1`, 인기 목록은 `/#/popular`입니다. `#` 뒤의 경로는 서버에 전송되지 않으며 이 주소로 직접 접속·새로고침을 검증합니다.

#### 11-9. 클라이언트 배포 오류 확인

| 증상 | 확인·해결 |
| --- | --- |
| Vite가 감지되지 않거나 서버 코드가 빌드됨 | 선택한 저장소와 Root Directory가 React 클라이언트인지 확인합니다. |
| Output Directory 관련 오류 | 클라이언트 로컬 빌드가 만든 폴더와 Vercel의 Output Directory가 같은지 확인합니다. |
| API 요청이 localhost·예전 주소로 전송됨 | `VITE_API_BASE_URL`의 값과 적용 환경을 확인하고 Redeploy합니다. |
| Production은 되지만 Preview API 연결 실패 | 환경변수가 `Preview`에도 적용되는지 확인하고 Preview 배포를 다시 만듭니다. |
| API 대신 이전 로컬 목록이 보임 | 새 API 모듈 적용 여부와 Network 요청을 확인합니다. `api.local.ts`는 기존 제보 기능 보관용이며 맛집 조회는 새 `api.ts`를 사용합니다. |
| 상세 주소에서 새로고침 시 404 | Step 11-8처럼 `/#/restaurant/1` 형태의 HashRouter 주소를 사용합니다. |
| 제출 주소에서 로그인 화면이 나옴 | Preview URL 대신 정식 Production 도메인인지, 프로젝트의 Deployment Protection 설정이 해당 배포에 적용되는지 확인합니다. |

---

## 📎 제출 가이드

- **제출 마감**: 강의 공지 확인
- **제출 항목**
  - Backend GitHub URL: `https://github.com/<username>/pwd-week6`
  - Client GitHub URL: `https://github.com/<username>/pwd-week5`
  - Render Service URL: `https://pwd-week6-yourname.onrender.com`
  - Vercel Client URL: 프로젝트에 표시된 Production 도메인 (예: `https://pwd-week5-yourname.vercel.app`)

- **체크리스트**
  - `npm run typecheck`, `npm test`, `npm run build`가 로컬에서 통과하나요?
  - 주요 REST 엔드포인트가 Render에서 정상 동작하나요?
  - Vercel Production URL에서 React 클라이언트가 정상 동작하나요?
  - 브라우저 Network 탭에서 실제 Render API의 정상 응답을 확인했나요?
  - `VITE_API_BASE_URL`을 필요한 Production·Preview 환경에 등록하고 새 배포에 반영했나요?

---

## 📚 추가 학습 자료
- [Express 공식 문서](https://expressjs.com/ko/)
- [TypeScript 설정 참고](https://www.typescriptlang.org/tsconfig/)
- [Render - 첫 배포 가이드](https://render.com/docs/your-first-deploy)
- [Render - Node/Express 배포](https://render.com/docs/deploy-node-express-app)
- [Vercel - Git 저장소 배포](https://vercel.com/docs/git)
- [Vercel - Vite 배포](https://vercel.com/docs/frameworks/frontend/vite)
- [Vercel - 환경변수 관리](https://vercel.com/docs/environment-variables/managing-environment-variables)

---

## 💬 질문 & 도움
- [Practical Web Service TA](https://chatgpt.com/g/g-68bbbf3aa57081919811dd57100b1e46-ajou-digtalmedia-practical-web-service-ta)
- 과제 관련 질문은 강의 Slack 채널 또는 LMS 질의응답 게시판을 활용하세요.
