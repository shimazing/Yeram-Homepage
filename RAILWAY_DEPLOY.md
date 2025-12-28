# Railway 배포 가이드 (data.json 사용)

이 가이드는 Railway에 data.json 기반 FileStorage를 사용하여 예람교회 웹사이트를 배포하는 방법을 설명합니다.

## 사전 준비

1. [Railway 계정](https://railway.app/) 생성
2. GitHub 저장소에 코드 푸시

## 배포 단계

### 1. Railway 프로젝트 생성

1. [Railway 대시보드](https://railway.app/dashboard)에 로그인
2. "New Project" 클릭
3. "Deploy from GitHub repo" 선택
4. 저장소 선택 및 연결

### 2. Volume 생성 (데이터 영구 보존용)

Railway는 기본적으로 ephemeral filesystem을 사용하므로, 데이터를 영구 보존하려면 Volume이 필요합니다.

1. Railway 프로젝트 대시보드에서 서비스 클릭
2. 상단 탭에서 "Variables" 옆의 "Volumes" 클릭
3. "New Volume" 클릭
4. Volume 설정:
   - **Name**: `data-volume` (원하는 이름)
   - **Mount Path**: `/data`
5. "Create" 클릭

### 3. 환경 변수 설정

Railway 프로젝트 대시보드에서:

1. "Variables" 탭 클릭
2. 다음 환경 변수 추가:

```env
NODE_ENV=production
DATA_FILE_PATH=/data/data.json
```

**중요**: `DATABASE_URL`은 설정하지 마세요! 이 변수가 없어야 FileStorage가 활성화됩니다.

### 4. 배포 설정 확인

Railway는 자동으로 `nixpacks.toml` 파일을 감지하여 다음과 같이 빌드합니다:

- **빌드 명령**: `npm run build`
- **시작 명령**: `npm start`
- **Node.js 버전**: 20.x

수동으로 설정하려면:
1. "Settings" 탭 클릭
2. "Deploy" 섹션에서:
   - Build Command: `npm run build`
   - Start Command: `npm start`

### 5. 배포

1. 코드를 GitHub에 푸시하면 자동으로 배포됩니다
2. 또는 Railway 대시보드에서 "Deploy" 버튼 클릭

### 6. 배포 확인

1. 배포 로그에서 다음 메시지 확인:
   ```
   📁 FileStorage initialized. Data file path: /data/data.json
   ✅ Found existing data.json, loading data...
   ```
   또는 (처음 배포 시):
   ```
   ⚠️  No data.json found, creating initial data...
   💾 Saving initial data to file...
   ```

2. Railway가 제공하는 URL로 접속하여 웹사이트 동작 확인

## 데이터 관리

### 초기 데이터

첫 배포 시 다음 초기 데이터가 자동으로 생성됩니다:
- 공지사항 1개
- 주간 예배 정보 1개
- 갤러리 사진 4개 (worship, fellowship, youth, events 카테고리별 1개씩)

### 데이터 백업

Railway 대시보드에서 Volume 데이터를 백업할 수 있습니다:

1. Volume 탭에서 생성한 Volume 클릭
2. Volume 관리 인터페이스에서 백업 옵션 사용

또는 SSH로 접속하여 수동 백업:
```bash
railway run bash
cat /data/data.json > backup.json
```

### 데이터 복원

1. Railway 대시보드의 Volume에서 파일 업로드
2. 또는 SSH로 접속하여 수동 복원:
   ```bash
   railway run bash
   # data.json 파일을 /data/data.json에 복사
   ```

## 문제 해결

### 데이터가 재배포 시 사라지는 경우

**원인**: Volume이 제대로 마운트되지 않았거나 환경 변수가 잘못 설정됨

**해결**:
1. Volume이 `/data` 경로에 마운트되었는지 확인
2. `DATA_FILE_PATH=/data/data.json` 환경 변수가 설정되었는지 확인
3. 배포 로그에서 FileStorage가 `/data/data.json` 경로를 사용하는지 확인

### 서버가 시작되지 않는 경우

**원인**: 빌드 실패 또는 환경 설정 오류

**해결**:
1. 배포 로그 확인
2. `NODE_ENV=production` 설정 확인
3. `DATABASE_URL`이 설정되어 있다면 제거

### 포트 오류

이 앱은 항상 포트 5173을 사용합니다. Railway는 자동으로 포트를 매핑하므로 별도 설정이 필요 없습니다.

## 로컬에서 프로덕션 빌드 테스트

배포 전에 로컬에서 프로덕션 빌드를 테스트할 수 있습니다:

```bash
# 빌드
npm run build

# 프로덕션 모드로 실행
npm start
```

## 비용

- Railway 무료 티어: 월 $5 크레딧 (약 500시간 실행)
- Volume: 1GB까지 무료
- 추가 사용량은 [Railway 가격 정책](https://railway.app/pricing) 참고

## 추가 리소스

- [Railway 문서](https://docs.railway.app/)
- [Railway Volume 가이드](https://docs.railway.app/reference/volumes)
- [Nixpacks 문서](https://nixpacks.com/)
