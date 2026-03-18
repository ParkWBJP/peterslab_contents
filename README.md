# Yukiharu SNS Content Kit

단계형 위저드 방식으로 반려동물 브랜드용 인스타그램 카드뉴스와 슬라이드 영상을 만드는 Next.js 앱이다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 된다.

## OpenAI 환경

현재는 바로 더미 데이터로 동작하도록 세팅해두었다.

- `.env.local`에서 `OPENAI_API_KEY`가 비어 있으면 모든 AI 단계는 mock 데이터를 반환한다.
- 나중에 실제 OpenAI를 붙일 때는 `.env.local`의 `OPENAI_API_KEY`에 키만 넣으면 바로 live 호출로 전환된다.
- 모델도 이미 env로 분리되어 있다.

```env
OPENAI_API_KEY=
OPENAI_TEXT_MODEL=gpt-4.1-mini
OPENAI_IMAGE_MODEL=gpt-image-1-mini
```

## 현재 상태

- 주제 제안, 시나리오 제안, 이미지/캡션/해시태그 생성은 기본적으로 더미 데이터 사용
- 브랜드 워터마크와 마지막 고정 이미지 업로드 가능
- 이미지별 프롬프트 수정 및 재생성 가능
- `ffmpeg-static`으로 MP4 슬라이드 영상 렌더링 가능

## 검증

```bash
npm run lint
npm run build
```
