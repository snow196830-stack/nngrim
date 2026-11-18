# 눈,그림 (NUNGRIM) 홈페이지

청담 수지눈썹 전문 **눈,그림**의 홈페이지입니다. 한국어 기본 + 일본어 + 영어 3개 국어,
인플루언서 카드(사진 클릭 → 해당 인스타그램), 인스타그램 릴스, 예약 전 안내(FAQ),
원장용 관리자 페이지(`/admin/`)로 구성되어 있습니다.

- 라이브 주소: `https://snow196830-stack.github.io/nngrim/`
- 관리자: `https://snow196830-stack.github.io/nngrim/admin/` (`noindex` 적용)
- 로컬 미리보기: 이 폴더에서 `python3 -m http.server 8099` → `http://localhost:8099/`

---

## 1. 폴더 구성

이 저장소에는 웹에 필요한 파일만 들어 있습니다. 작업 폴더에만 있는 개발용 폴더
(`notes/` 자료 출처, `preview/` 검증 스크린샷, `tools/` 스크립트)는 올리지 않았습니다.

```
저장소 루트 (배포되는 파일 그대로)
├── index.html            화면 골격 (한국어 원문이 그대로 들어 있어 JS가 없어도 읽힘)
├── styles.css            디자인 (paper · ink · terracotta)
├── app.js                3개 국어 전환, 목록 렌더, 릴스 캐러셀, FAQ, LINE 복사
├── data/content.json     모든 문구·사진·링크의 원본 (관리자 페이지가 고치는 파일)
├── admin/                원장용 관리자 (index.html · admin.css · admin.js)
├── assets/
│   ├── hero.jpg          첫 화면 사진 (인스타그램 @nn.grim 게시물)
│   ├── brow-portrait.jpg 시그니처·원장 소개 사진
│   ├── og-image.jpg      카카오톡·SNS 공유 썸네일 (1200×630)
│   ├── gallery/          갤러리 8장
│   ├── influencers/      인플루언서 카드 9명 (600×750)
│   ├── reels/            릴스 영상 3개 (mp4 + jpg 포스터)
│   └── fonts/            Noto Serif/Sans KR 서브셋 woff2
├── robots.txt · sitemap.xml · .nojekyll
```

작업 폴더에만 두는 것(배포하지 않음):

```
├── notes/source-data.md  실제 자료 출처와 확인 시점 (추측 금지 원칙 기록)
├── preview/              검증 스크린샷 (데스크톱·태블릿·모바일·관리자)
├── tools/
│   ├── verify.py         Playwright 자동 검증 (54개 항목)
│   ├── shot-sections.py  원장·FAQ·오시는 길 섹션 스크린샷
│   ├── build-fonts.py    문구가 바뀌면 폰트 서브셋을 다시 만든다
│   └── make-og-image.py  공유 썸네일 생성
```

---

## 2. 관리자 페이지 사용법

1. `/admin/` 접속 → **GitHub 토큰** 입력
   - GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens**
   - Repository access: `snow196830-stack/nngrim` 선택
   - Permissions → **Contents: Read and write**
2. 토큰은 이 브라우저(localStorage)에만 저장됩니다. 공개 코드에는 들어가지 않습니다.
   - 선택: **PIN으로 잠그기** — 토큰을 PBKDF2 + AES-GCM으로 암호화해 저장.
3. 왼쪽 위 **한국어 / 日本語 / English** 버튼으로 편집할 언어를 고릅니다.
   - 번역이 비어 있으면 한국어가 그대로 표시됩니다.
4. **저장 및 홈페이지 반영** → GitHub에 커밋 → 30~60초 뒤 홈페이지 반영(자동 확인).

### 인플루언서 추가 (핵심)

`5. 인플루언서 (핵심)` 카드에서:

- **+ 인플루언서 추가**
- **사진 선택** → 브라우저에서 600×750으로 줄여 `assets/influencers/{id}.jpg`로 자동 업로드
- **인스타그램 아이디**에 `@` 없이 입력 (예: `hyo.ppeu`)
  → 링크가 `https://www.instagram.com/hyo.ppeu/` 로 자동 생성됩니다.
- 이름·팔로워·태그는 선택. **홈페이지에 표시** 체크를 끄면 숨김.
- 순서는 ↑ ↓ 로 바꿉니다.

### 그 밖에 고칠 수 있는 것

기본·공지 / 보이는 영역 on-off / 첫 화면 / 시그니처(시술) / 갤러리 / 릴스 /
원장·철학 / 가격 / 예약 / 예약 전 안내(FAQ) / 오시는 길 / 링크 / JSON 직접 편집.

백업: **백업 내려받기** 로 `content.json`을 보관하고, **백업 불러오기** 로 되돌릴 수 있습니다.

---

## 3. 3개 국어 · 예약 분기

| 언어 | 문서 언어 | 주 예약 채널 | 보조 |
|---|---|---|---|
| 한국어 (기본) | `ko` | 카카오톡 채널 `pf.kakao.com/_HEyixj/chat` | 인스타그램 DM |
| 日本語 | `ja` | **LINE ID `nn.grim` 복사** | 카카오톡 |
| English | `en` | **LINE ID `nn.grim` 복사** | 카카오톡 |

- 언어는 `?lang=jp` / `?lang=en` 으로도 열립니다. 선택은 localStorage에 기억됩니다.
- 일본어·영어에서 주 버튼을 누르면 LINE ID가 클립보드에 복사되고 토스트가 뜹니다.
  **LINE 딥링크는 확인되지 않아 만들지 않았습니다** (아래 6번 참고).
- 언어를 바꾸면 `<title>`·`meta description`·`og:` 태그도 함께 바뀝니다(검색·공유 대응).

---

## 4. 검증

작업 폴더에서 실행합니다(이 저장소에는 `tools/`가 없습니다).

```bash
python3 voi-creative-studio/nngrim/tools/verify.py
```

로컬 서버를 띄우고 Playwright 크로미움으로 54개 항목을 확인합니다 (2026-11-19 기준 **54/54 통과**).

- 데스크톱 1440 / 태블릿 834 / 모바일 390 레이아웃, 가로 스크롤 0
- 3개 국어 전환, 제목·본문 번역, 카카오/LINE 분기, LINE 복사 토스트
- 인플루언서 9명: 이미지 로드 · `href`가 `instagram.com/{아이디}/` · 새 탭 · 실제 클릭
- 갤러리 8장 · 릴스 3개(영상 메타데이터 로드) · FAQ 아코디언
- 관리자: 연결 화면 · 13개 섹션 · 인플루언서 추가 · 표시 토글 · 언어 편집 · JSON 검증/오류 감지
- 콘솔 에러 0 · 404 응답 0 · 로컬 요청 실패 0

스크린샷은 `preview/` 에 저장됩니다.

---

## 5. 자료 출처

`notes/source-data.md` 에 정리했습니다. 요약:

- 업체 정보: 네이버 플레이스(플레이스 ID `1066718288`), 카카오톡 채널 `_HEyixj`, 인스타그램 `@nn.grim`
- 사진·영상: 눈,그림 인스타그램 게시물·릴스·스토리(리포스트)
- 인플루언서 사진: `인플루언서 pick!` 하이라이트에 리포스트된 스토리
- 인플루언서 계정: 각 계정 프로필을 직접 열어 존재·이름·팔로워 확인

---

## 6. 확인되지 않아 비워 둔 것

| 항목 | 상태 | 홈페이지 처리 |
|---|---|---|
| 전화번호 | 네이버 플레이스에 없음 | 표시하지 않음 (카카오톡·DM으로 안내) |
| 운영 시간 | "일요일 off"만 확인 | "일요일 휴무 · 예약제 운영" + 채널 확인 안내 |
| 가격 | 공개된 가격표 없음 | "상담 시 안내" + 예약금·리터치 정책만 안내 |
| 네이버 예약 | 플레이스에 예약 메뉴 없음 | 카카오톡·LINE·인스타그램으로만 연결 |
| LINE 딥링크 | `line.me/ti/p/~nn.grim` 은 계정 확인 불가 | 링크 대신 ID 복사 방식 |
| 주차 | 확인 불가 | 표시하지 않음 |

값이 확인되면 `/admin/` 에서 문구만 고쳐 반영하면 됩니다.

---

## 7. 배포

GitHub Pages 로 배포되어 있습니다. `main` 브랜치 루트(`/`)가 그대로 웹에 올라갑니다.

- 홈페이지: `https://snow196830-stack.github.io/nngrim/`
- 관리자: `https://snow196830-stack.github.io/nngrim/admin/` (`noindex`, 검색 노출 없음)
- `index.html` 의 canonical·og:url, `sitemap.xml`, `robots.txt` 의 주소가 이 주소 기준입니다.
- `admin/index.html` 의 기본 저장소도 `snow196830-stack/nngrim` 으로 맞춰져 있습니다.
- `.nojekyll` 이 있어 `assets/` 가 그대로 배포됩니다(Jekyll 가공 없음).
- 별도 도메인은 연결하지 않았습니다.

### 문구·사진 고치기

코드를 건드리지 않고 `/admin/` 에서 저장하면 이 저장소의 `data/content.json` 이 바뀌고
30~60초 뒤 홈페이지에 반영됩니다. 커밋이 남으므로 GitHub에서 되돌릴 수 있습니다.

### 구조 자체를 바꿨을 때

작업 폴더의 원본을 고친 뒤 배포본을 다시 만들어 올립니다.

```bash
cd voi-creative-studio/nngrim
rsync -a --delete --exclude .git --exclude notes --exclude preview --exclude tools ./ ../nngrim-deploy/
cd ../nngrim-deploy
git add -A && git commit -m "문구·구조 수정" && git push origin main
```

푸시하면 1분 안에 Pages 가 다시 빌드됩니다. 진행 상태는 저장소 **Actions → pages build and deployment**
또는 `https://github.com/snow196830-stack/nngrim/deployments` 에서 볼 수 있습니다.

---

## 8. 문구를 크게 고친 뒤

작업 폴더에서 `tools/build-fonts.py` 를 다시 실행하면 새 글자가 웹폰트 서브셋에 포함됩니다.

```bash
python3 voi-creative-studio/nngrim/tools/build-fonts.py
```
