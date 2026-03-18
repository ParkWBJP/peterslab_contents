import type {
  AssetsRequest,
  AssetsResponse,
  Language,
  ScenarioOption,
  ScenariosRequest,
  ScenariosResponse,
  TopicSuggestion,
  TopicsRequest,
  TopicsResponse,
} from "@/lib/types";
import { createId } from "@/lib/utils";

const topicPools: Record<
  Language,
  Array<{ title: string; description: string }>
> = {
  ja: [
    {
      title: "写真フォルダが全部うちの子",
      description: "日本の飼い主が共感しやすい、かわいさと日常感を両立した切り口。",
    },
    {
      title: "散歩前の顔が全部語ってる",
      description: "犬猫の日常の感情を短いカードでテンポよく見せやすいテーマ。",
    },
    {
      title: "ただ隣にいるだけで救われる日",
      description: "保存・共感を狙いやすい飼い主感情のテーマ。",
    },
    {
      title: "気温差が大きい日の小さなケア",
      description: "健康管理でも重すぎず、実用的に整理しやすい構成。",
    },
    {
      title: "留守番後のいつもの儀式",
      description: "ブランドらしい温かさを残しながら関係性を描ける。",
    },
  ],
  ko: [
    {
      title: "사진 폴더가 전부 우리 아이",
      description: "보호자 공감과 귀여움을 함께 담기 좋은 일상형 주제.",
    },
    {
      title: "산책 전 표정이 이미 답",
      description: "짧은 카드 장면으로 감정을 전달하기 쉬운 테마.",
    },
    {
      title: "그냥 옆에 있어줘서 고마운 날",
      description: "저장과 공유를 유도하기 좋은 감정형 콘텐츠 소재.",
    },
    {
      title: "기온차 큰 날의 작은 케어",
      description: "건강관리형이지만 부담 없이 읽히는 실용 주제.",
    },
    {
      title: "외출 후 다시 만나는 루틴",
      description: "브랜드가 관계성 안에 자연스럽게 들어가기 좋다.",
    },
  ],
  en: [
    {
      title: "Why the camera roll is all pets",
      description: "A warm relatable angle for everyday pet-owner emotions.",
    },
    {
      title: "The face they make before walk time",
      description: "Easy to turn into short card slides with clear emotional beats.",
    },
    {
      title: "The day your pet quietly saves you",
      description: "Built for empathy, saves, and soft sharing.",
    },
    {
      title: "Small care rituals on weather-shift days",
      description: "Useful without sounding clinical or heavy.",
    },
    {
      title: "The little reunion routine after being apart",
      description: "Lets the brand land gently at the end of the story.",
    },
  ],
};

function scenarioTemplates(language: Language, topic: string): string[][] {
  if (language === "ko") {
    return [
      [
        `${topic}, 이런 적 있나요?`,
        "작은 신호는 먼저 온다",
        "보호자는 그 차이를 느낀다",
        "한 가지 습관이 바뀌면",
        "일상이 더 편안해진다",
        "마지막은 브랜드 이미지로",
      ],
      [
        `${topic}, 스크롤 멈춤`,
        "익숙한 하루에서 시작된다",
        "감정이 먼저 움직이고",
        "짧은 체크가 안심을 만든다",
        "가벼운 루틴이 이어진다",
        "저장해두면 다시 보기 쉽다",
      ],
      [
        `왜 이 장면이 남을까`,
        "정답보다 감정이 먼저 온다",
        "우리 아이를 더 보게 되고",
        "작게 바꾸는 쪽이 오래 간다",
        "오늘부터 한 가지만 해보자",
        "브랜드가 조용히 마무리한다",
      ],
    ];
  }

  if (language === "en") {
    return [
      [
        `Have you seen this, too?`,
        `It starts with ${topic.toLowerCase()}`,
        "Owners notice the smallest cue first",
        "One tiny routine shifts the mood",
        "The day feels calmer after that",
        "Finish with the brand slide",
      ],
      [
        `Stop scrolling for this`,
        "A very ordinary scene opens it",
        "Then the feeling slowly changes",
        "A gentle check brings clarity",
        "The routine becomes easier",
        "Save it for later",
      ],
      [
        `Why does this stay with us?`,
        "The emotion arrives before the answer",
        "Pet owners feel it right away",
        "Small changes work better",
        "Try one thing today",
        "Close with quiet brand warmth",
      ],
    ];
  }

  return [
    [
      `${topic}ってある？`,
      "小さなサインは先に出る",
      "飼い主は意外と気づいてる",
      "一つの習慣で変わる",
      "毎日が少し楽になる",
      "最後はブランド画像で締める",
    ],
    [
      `スクロールが止まる理由`,
      "いつもの日常から始まる",
      "気持ちが先に動いて",
      "短い確認で安心できる",
      "やさしいルーティンが続く",
      "保存したくなる余韻で終える",
    ],
    [
      `なぜ気になるんだろう`,
      "答えより先に感情が来る",
      "うちの子を見る目が変わる",
      "無理なく整えるのがコツ",
      "今日から一つだけ試す",
      "ブランドで静かに着地する",
    ],
  ];
}

function svgDataUrl(title: string, body: string, accent: string) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="768" viewBox="0 0 1024 768">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${accent}" />
        <stop offset="100%" stop-color="#f7f1ea" />
      </linearGradient>
    </defs>
    <rect width="1024" height="768" rx="32" fill="url(#g)" />
    <circle cx="160" cy="160" r="120" fill="rgba(255,255,255,0.22)" />
    <circle cx="860" cy="560" r="120" fill="rgba(110,72,45,0.10)" />
    <text x="88" y="110" fill="#513628" font-size="42" font-family="Arial">Yukiharu Demo</text>
    <text x="88" y="430" fill="#281c17" font-size="60" font-weight="700" font-family="Arial">${escapeXml(title)}</text>
    <foreignObject x="88" y="476" width="780" height="160">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial; font-size: 27px; color: #4d3931; line-height: 1.45;">
        ${escapeXml(body)}
      </div>
    </foreignObject>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function generateMockTopics(input: TopicsRequest): TopicsResponse {
  const topics: TopicSuggestion[] = topicPools[input.language].map((item) => ({
    id: createId("topic"),
    title: item.title,
    description: item.description,
  }));
  return { topics, usedFallback: true };
}

export function generateMockScenarios(
  input: ScenariosRequest,
): ScenariosResponse {
  const hooks: Array<ScenarioOption["hook"]> = [
    "question",
    "impact",
    "scrollStop",
  ];
  const scenarios: ScenarioOption[] = scenarioTemplates(
    input.language,
    input.topic,
  ).map((slides, index) => ({
    id: createId("scenario"),
    title:
      input.language === "en"
        ? `Option ${index + 1}`
        : input.language === "ko"
          ? `시나리오 ${index + 1}`
          : `シナリオ ${index + 1}`,
    hook: hooks[index],
    slides: slides.map((text) => ({ id: createId("slide"), text })),
  }));
  return { scenarios, usedFallback: true };
}

export function generateMockAssets(input: AssetsRequest): AssetsResponse {
  const slides = input.slides.map((slide, index) => {
    const isFinal = index === input.slides.length - 1;
    const prompt =
      input.promptOverrides?.[index] ||
      (input.language === "en"
        ? `Warm pet Instagram editorial slide about "${slide.text}", 4:3 frame, clean negative space for text, Japanese audience empathy, no watermark embedded`
        : input.language === "ko"
          ? `"${slide.text}"를 중심으로 한 따뜻한 펫 인스타그램 카드뉴스, 4:3 비율, 텍스트 여백 확보, 일본 보호자 공감 톤, 워터마크 미삽입`
          : `「${slide.text}」を中心にした温かいペット向けInstagramカード、4:3構図、文字余白あり、日本の飼い主向けの共感トーン、透かしは入れない`);

    return {
      slideId: slide.id,
      text: slide.text,
      prompt,
      imageUrl: svgDataUrl(
        slide.text,
        isFinal ? "Brand ending slide" : prompt,
        ["#ead0c2", "#dfe8d7", "#eadfc7", "#d8e1ef"][index % 4],
      ),
      isFinal,
    };
  });

  const caption =
    input.language === "en"
      ? `A warm, save-worthy Instagram story about ${input.topic}. Built to feel relatable for Japanese pet owners, with a clear hook, short slide copy, and a soft brand finish.`
      : input.language === "ko"
        ? `${input.topic}를 주제로 한 저장형 인스타그램 카드뉴스입니다. 일본 반려동물 보호자 관점의 공감, 짧은 장면 문장, 부드러운 브랜드 마무리를 중심으로 구성했습니다.`
        : `${input.topic}をテーマにした、保存したくなるInstagramカードです。日本の飼い主視点の共感、短いスライド文、やわらかなブランドの締めを軸に構成しています。`;

  const hashtags =
    input.language === "en"
      ? [
          "#petbrand",
          "#petparents",
          "#dogsofinstagram",
          "#catsofinstagram",
          "#petcare",
          "#petlovers",
          "#japanpet",
          "#yukiharu",
          "#petstory",
          "#pettips",
          "#dogmom",
          "#catmom",
          "#instapet",
          "#petcontent",
          "#brandstory",
        ]
      : input.language === "ko"
        ? [
            "#반려동물",
            "#펫브랜드",
            "#강아지",
            "#고양이",
            "#펫스타그램",
            "#반려생활",
            "#보호자공감",
            "#펫건강",
            "#일본펫",
            "#콘텐츠제작",
            "#저장각",
            "#브랜드콘텐츠",
            "#인스타콘텐츠",
            "#유키하루",
            "#펫팁",
          ]
        : [
            "#ペット",
            "#犬のいる暮らし",
            "#猫のいる暮らし",
            "#ペットブランド",
            "#ペットケア",
            "#共感投稿",
            "#保存したい投稿",
            "#日本のペット",
            "#ユキハル",
            "#インスタ運用",
            "#犬好き",
            "#猫好き",
            "#ブランド投稿",
            "#ペット情報",
            "#ペットライフ",
          ];

  return { slides, caption, hashtags, usedFallback: true };
}
