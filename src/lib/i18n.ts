import type {
  ContentType,
  Language,
  PetKind,
  ScenarioHook,
  WizardStep,
} from "@/lib/types";

type Dictionary = {
  appName: string;
  brandLabel: string;
  tagLine: string;
  chooseLanguage: string;
  languageLocked: string;
  start: string;
  startDescription: string;
  fixedAssetsHint: string;
  mockModeLabel: string;
  choosePetKind: string;
  chooseContentType: string;
  stepOneTitle: string;
  stepOneDescription: string;
  continueToTopics: string;
  topicSuggestions: string;
  pickOneTopic: string;
  regenerate: string;
  regenerateAll: string;
  topicInputLabel: string;
  topicDescriptionLabel: string;
  topicTaglineLabel: string;
  whyInterestingLabel: string;
  seasonalTrendLabel: string;
  confirmTopic: string;
  scenarioSuggestions: string;
  scenarioInputLabel: string;
  editScenario: string;
  generateAssets: string;
  reviewAssets: string;
  caption: string;
  hashtags: string;
  prompt: string;
  promptHint: string;
  changeImage: string;
  saveEdits: string;
  instagramPreview: string;
  previewHandle: string;
  previewSubline: string;
  previewPlaceholder: string;
  makeVideo: string;
  slideDuration: string;
  renderVideo: string;
  videoReady: string;
  downloadVideo: string;
  downloadImage: string;
  copyAction: string;
  saveAction: string;
  finalCongrats: string;
  progress: string;
  score: string;
  step: string;
  back: string;
  startOver: string;
  trackLabel: string;
  loadingTitle: string;
  loadingTopics: string;
  loadingScenarios: string;
  loadingAssets: string;
  renderingVideo: string;
  stepTitles: Record<WizardStep, string>;
  petKinds: Record<PetKind, string>;
  contentTypes: Record<ContentType, string>;
  hookTypes: Record<ScenarioHook, string>;
};

export const dictionaries: Record<Language, Dictionary> = {
  ja: {
    appName: "ユキハル SNSコンテンツ制作キット",
    brandLabel: "YUKIHARU",
    tagLine:
      "日本のペットオーナーに届くInstagramカード投稿とスライド動画を、1ステップずつ気持ちよく組み立てる制作キットです。",
    chooseLanguage: "言語を選んでスタート",
    languageLocked: "制作を始めると途中で言語は変更できません。",
    start: "はじめる",
    startDescription:
      "最初に必要なのは言語選択だけです。選んだらすぐに企画づくりへ進めます。",
    fixedAssetsHint:
      "ブランドのウォーターマークと最後の固定ブランド画像は自動で反映されます。",
    mockModeLabel: "デモモード",
    choosePetKind: "まず対象を選んでください",
    chooseContentType: "つづいてコンテンツの目的を選んでください",
    stepOneTitle: "コンテンツの企画方向を決めましょう",
    stepOneDescription:
      "犬・猫・共通のどれかを選び、そのあとに目的を選ぶと、AIが使える企画案を提案します。",
    continueToTopics: "AIテーマを受け取る",
    topicSuggestions: "AIテーマ 3案",
    pickOneTopic:
      "どの切り口がいちばん反応を取りやすいか、理由ごと比較しながら選べます。",
    regenerate: "再生成",
    regenerateAll: "全体を再生成",
    topicInputLabel: "最終テーマ",
    topicDescriptionLabel: "テーマの詳細説明",
    topicTaglineLabel: "ひとことタグライン",
    whyInterestingLabel: "この企画が刺さる理由",
    seasonalTrendLabel: "季節・トレンドの接点",
    confirmTopic: "このテーマで進む",
    scenarioSuggestions: "シナリオ 3案",
    scenarioInputLabel: "スライド文",
    editScenario: "シナリオを整える",
    generateAssets: "画像を生成する",
    reviewAssets: "最終チェック",
    caption: "キャプション",
    hashtags: "ハッシュタグ",
    prompt: "画像プロンプト",
    promptHint:
      "選択中のスライドだけを大きく確認しながら、プロンプト・キャプション・ハッシュタグを整えられます。",
    changeImage: "この画像を再生成",
    saveEdits: "変更を保存",
    instagramPreview: "Instagram",
    previewHandle: "yukiharu.pet",
    previewSubline: "preview",
    previewPlaceholder: "プレビューエリア",
    makeVideo: "スライド動画を作る",
    slideDuration: "スライドの表示時間",
    renderVideo: "動画を生成",
    videoReady: "動画の準備ができました",
    downloadVideo: "MP4をダウンロード",
    downloadImage: "画像を保存",
    copyAction: "コピー",
    saveAction: "保存",
    finalCongrats: "完成です。Instagram投稿前の最終データとしてそのまま使えます。",
    progress: "進行",
    score: "スコア",
    step: "STEP",
    back: "戻る",
    startOver: "最初から",
    trackLabel: "Progress Track",
    loadingTitle: "コンテンツを準備しています",
    loadingTopics:
      "日本の季節感と海外SNSの空気感を見ながら、保存されやすいテーマを探しています。",
    loadingScenarios:
      "1枚目で止まりたくなる導線と、最後までめくりたくなる流れを組み立てています。",
    loadingAssets:
      "画像、キャプション、ハッシュタグをまとめて整えています。ブランドの固定要素も反映します。",
    renderingVideo: "スライドをつなげて動画を書き出しています。",
    stepTitles: {
      0: "開始",
      1: "方向設定",
      2: "テーマ選択",
      3: "テーマ確定",
      4: "シナリオ",
      5: "シナリオ編集",
      6: "画像生成",
      7: "最終確認",
      8: "動画化",
      9: "完了",
    },
    petKinds: {
      dog: "犬",
      cat: "猫",
      common: "共通",
    },
    contentTypes: {
      fun: "おもしろ系",
      info: "情報系",
      empathy: "共感系",
      health: "健康管理",
      productPromo: "商品紹介",
      anniversary: "記念日",
    },
    hookTypes: {
      question: "質問型",
      impact: "インパクト型",
      scrollStop: "スクロール停止型",
    },
  },
  ko: {
    appName: "유키하루 SNS콘텐츠 제작 킷",
    brandLabel: "YUKIHARU",
    tagLine:
      "일본 반려동물 보호자에게 잘 먹히는 인스타그램 카드뉴스와 슬라이드 영상을, 한 단계씩 빠르게 완성하는 제작 도구입니다.",
    chooseLanguage: "언어를 선택하고 시작하세요",
    languageLocked: "제작을 시작하면 언어는 중간에 바꿀 수 없습니다.",
    start: "시작하기",
    startDescription:
      "처음에는 언어만 고르면 됩니다. 선택이 끝나면 바로 콘텐츠 기획 단계로 넘어갑니다.",
    fixedAssetsHint:
      "브랜드 워터마크와 마지막 고정 브랜드 이미지는 자동으로 적용됩니다.",
    mockModeLabel: "데모 모드",
    choosePetKind: "먼저 대상을 선택하세요",
    chooseContentType: "이제 콘텐츠 목적을 선택하세요",
    stepOneTitle: "콘텐츠 주제 아이디어를 정해보세요",
    stepOneDescription:
      "강아지, 고양이, 공통 중 하나를 고른 뒤 목적을 선택하면 AI가 바로 사용할 수 있는 기획안을 제안합니다.",
    continueToTopics: "AI 주제 받기",
    topicSuggestions: "AI 주제 3안",
    pickOneTopic:
      "어떤 방향이 더 흥미롭고 저장 가치가 높은지, 이유까지 보면서 비교해보세요.",
    regenerate: "재생성",
    regenerateAll: "전체 재생성",
    topicInputLabel: "최종 주제",
    topicDescriptionLabel: "주제 상세 설명",
    topicTaglineLabel: "한 줄 태그라인",
    whyInterestingLabel: "왜 이 주제가 먹히는지",
    seasonalTrendLabel: "계절/트렌드 포인트",
    confirmTopic: "이 주제로 진행",
    scenarioSuggestions: "시나리오 3안",
    scenarioInputLabel: "슬라이드 문구",
    editScenario: "시나리오 다듬기",
    generateAssets: "이미지 생성하기",
    reviewAssets: "최종 검수",
    caption: "캡션",
    hashtags: "해시태그",
    prompt: "이미지 프롬프트",
    promptHint:
      "선택한 슬라이드를 크게 보면서 프롬프트, 캡션, 해시태그를 업로드 직전처럼 정리할 수 있습니다.",
    changeImage: "이 이미지 재생성",
    saveEdits: "변경 저장",
    instagramPreview: "Instagram",
    previewHandle: "yukiharu.pet",
    previewSubline: "preview",
    previewPlaceholder: "미리보기 영역",
    makeVideo: "슬라이드 영상 만들기",
    slideDuration: "슬라이드 재생 시간",
    renderVideo: "영상 생성",
    videoReady: "영상이 준비되었습니다",
    downloadVideo: "MP4 다운로드",
    downloadImage: "이미지 저장",
    copyAction: "복사",
    saveAction: "저장",
    finalCongrats: "완성되었습니다. 인스타그램 업로드 전 최종본으로 바로 사용할 수 있습니다.",
    progress: "진행",
    score: "점수",
    step: "STEP",
    back: "이전",
    startOver: "처음부터",
    trackLabel: "Progress Track",
    loadingTitle: "콘텐츠를 준비하고 있습니다",
    loadingTopics:
      "일본의 계절감과 해외 펫 SNS 흐름을 같이 보면서, 저장과 공유를 유도할 주제를 고르고 있습니다.",
    loadingScenarios:
      "첫 장에서 멈추게 하고 끝까지 넘겨보게 만드는 카드뉴스 흐름을 설계하고 있습니다.",
    loadingAssets:
      "이미지, 캡션, 해시태그를 함께 정리하고 있습니다. 브랜드 고정 요소도 같이 반영합니다.",
    renderingVideo: "슬라이드를 이어 붙여 영상으로 렌더링하고 있습니다.",
    stepTitles: {
      0: "시작",
      1: "방향 설정",
      2: "주제 선택",
      3: "주제 확정",
      4: "시나리오",
      5: "시나리오 편집",
      6: "이미지 생성",
      7: "최종 검수",
      8: "영상 제작",
      9: "완료",
    },
    petKinds: {
      dog: "강아지",
      cat: "고양이",
      common: "공통",
    },
    contentTypes: {
      fun: "재미형",
      info: "정보형",
      empathy: "공감형",
      health: "건강관리",
      productPromo: "제품홍보",
      anniversary: "기념일",
    },
    hookTypes: {
      question: "질문형",
      impact: "임팩트형",
      scrollStop: "스크롤 정지형",
    },
  },
  en: {
    appName: "Yukiharu SNS Content Kit",
    brandLabel: "YUKIHARU",
    tagLine:
      "A compact creator for Instagram card posts and slide videos designed for Japanese pet-owner audiences.",
    chooseLanguage: "Choose a language and begin",
    languageLocked: "The language is locked once creation starts.",
    start: "Start",
    startDescription:
      "You only need to choose a language first. After that, you move straight into planning.",
    fixedAssetsHint:
      "The brand watermark and final fixed brand slide are applied automatically.",
    mockModeLabel: "Demo mode",
    choosePetKind: "Choose the subject first",
    chooseContentType: "Now choose the content goal",
    stepOneTitle: "Set your content topic direction",
    stepOneDescription:
      "Pick dog, cat, or both first, then choose the goal to unlock AI topic ideas.",
    continueToTopics: "Get AI topics",
    topicSuggestions: "3 AI topic ideas",
    pickOneTopic:
      "Compare which angle feels more interesting, more save-worthy, and more usable right now.",
    regenerate: "Regenerate",
    regenerateAll: "Regenerate all",
    topicInputLabel: "Final topic",
    topicDescriptionLabel: "Detailed topic description",
    topicTaglineLabel: "Short tagline",
    whyInterestingLabel: "Why it works",
    seasonalTrendLabel: "Seasonal or trend point",
    confirmTopic: "Continue with this topic",
    scenarioSuggestions: "3 scenario options",
    scenarioInputLabel: "Slide line",
    editScenario: "Refine scenario",
    generateAssets: "Generate images",
    reviewAssets: "Final review",
    caption: "Caption",
    hashtags: "Hashtags",
    prompt: "Image prompt",
    promptHint:
      "Review one selected slide at a time and polish the prompt, caption, and hashtags like a pre-upload check.",
    changeImage: "Regenerate this image",
    saveEdits: "Save changes",
    instagramPreview: "Instagram",
    previewHandle: "yukiharu.pet",
    previewSubline: "preview",
    previewPlaceholder: "Preview area",
    makeVideo: "Create slide video",
    slideDuration: "Slide duration",
    renderVideo: "Render video",
    videoReady: "Your video is ready",
    downloadVideo: "Download MP4",
    downloadImage: "Save image",
    copyAction: "Copy",
    saveAction: "Save",
    finalCongrats: "Done. Your result is ready to use as a final Instagram draft.",
    progress: "Progress",
    score: "Score",
    step: "STEP",
    back: "Back",
    startOver: "Start over",
    trackLabel: "Progress Track",
    loadingTitle: "Preparing your content",
    loadingTopics:
      "Reviewing Japanese seasonal context and global pet-social patterns to find stronger topic angles.",
    loadingScenarios:
      "Building a carousel flow with a stronger first-slide hook and clearer swipe momentum.",
    loadingAssets:
      "Generating the images, caption, and hashtags together while applying the brand fixed assets.",
    renderingVideo: "Rendering your slides into a video.",
    stepTitles: {
      0: "Start",
      1: "Direction",
      2: "Topics",
      3: "Topic lock",
      4: "Scenarios",
      5: "Scenario edit",
      6: "Images",
      7: "Review",
      8: "Video",
      9: "Done",
    },
    petKinds: {
      dog: "Dog",
      cat: "Cat",
      common: "Both",
    },
    contentTypes: {
      fun: "Fun",
      info: "Informative",
      empathy: "Empathy",
      health: "Health care",
      productPromo: "Product promo",
      anniversary: "Anniversary",
    },
    hookTypes: {
      question: "Question",
      impact: "Impact",
      scrollStop: "Scroll-stop",
    },
  },
};

export const languageOptions: Array<{ value: Language; label: string }> = [
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
];

export function getDictionary(language: Language | null) {
  return dictionaries[language ?? "ko"];
}
