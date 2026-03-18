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
    tagLine: "ペットブランド向けInstagram投稿を、やさしく一歩ずつ仕上げる制作ウィザード。",
    chooseLanguage: "言語を選んで始めましょう",
    languageLocked: "制作開始後は言語を変更できません。",
    start: "はじめる",
    startDescription: "最初に必要なのは言語選択だけです。選んだらすぐ次へ進めます。",
    fixedAssetsHint: "ブランドの透かしと最後の固定スライドは自動で適用されます。",
    mockModeLabel: "デモモード",
    choosePetKind: "まず対象を選択してください",
    chooseContentType: "つづいてコンテンツの目的を選択してください",
    stepOneTitle: "コンテンツのテーマ案を決めましょう",
    stepOneDescription:
      "犬・猫・共通のどれかを選び、そのあと目的を選ぶとAIのテーマ提案が開きます。",
    continueToTopics: "AIテーマを受け取る",
    topicSuggestions: "AIテーマ 5案",
    pickOneTopic: "今つくりたい方向にいちばん近いテーマを選んでください。",
    regenerate: "再生成",
    regenerateAll: "すべて再生成",
    topicInputLabel: "確定テーマ",
    topicDescriptionLabel: "テーマの説明",
    confirmTopic: "このテーマで進む",
    scenarioSuggestions: "シナリオ 3案",
    scenarioInputLabel: "スライド文言",
    editScenario: "シナリオを整える",
    generateAssets: "画像を生成する",
    reviewAssets: "結果を確認する",
    caption: "キャプション",
    hashtags: "ハッシュタグ",
    prompt: "プロンプト",
    promptHint: "この画面でプロンプト、キャプション、ハッシュタグをそのまま編集できます。",
    changeImage: "この画像を再生成",
    saveEdits: "変更を保存",
    instagramPreview: "Instagramプレビュー",
    previewHandle: "yukiharu.pet",
    previewSubline: "preview",
    previewPlaceholder: "プレビューエリア",
    makeVideo: "スライド動画を作る",
    slideDuration: "スライドの表示時間",
    renderVideo: "動画を生成する",
    videoReady: "動画の準備ができました",
    downloadVideo: "MP4をダウンロード",
    downloadImage: "画像を保存",
    copyAction: "コピー",
    saveAction: "保存",
    finalCongrats: "完成です。Instagramですぐ使える投稿素材になりました。",
    progress: "進行状況",
    score: "スコア",
    step: "STEP",
    back: "戻る",
    startOver: "最初から",
    trackLabel: "Progress Track",
    loadingTitle: "コンテンツを準備しています",
    loadingTopics: "日本と海外のペットトレンドを見ながら、使いやすいテーマを探しています。",
    loadingScenarios: "最初の1枚で止まる流れを考えながら、シナリオを組み立てています。",
    loadingAssets: "画像、キャプション、ハッシュタグをまとめて生成しています。",
    renderingVideo: "画像をつないでスライド動画を書き出しています。",
    stepTitles: {
      0: "開始",
      1: "方向設定",
      2: "テーマ提案",
      3: "テーマ確定",
      4: "シナリオ",
      5: "シナリオ編集",
      6: "画像生成",
      7: "確認",
      8: "動画",
      9: "完了",
    },
    petKinds: {
      dog: "犬",
      cat: "猫",
      common: "共通",
    },
    contentTypes: {
      fun: "楽しい",
      info: "情報",
      empathy: "共感",
      health: "健康管理",
    },
    hookTypes: {
      question: "質問型",
      impact: "インパクト型",
      scrollStop: "スクロール停止型",
    },
  },
  ko: {
    appName: "유키하루 SNS 콘텐츠 제작 킷",
    brandLabel: "YUKIHARU",
    tagLine: "펫 브랜드용 인스타그램 콘텐츠를 한 단계씩 빠르게 완성하는 제작 위저드입니다.",
    chooseLanguage: "언어를 고르고 시작하세요",
    languageLocked: "제작을 시작하면 언어는 고정됩니다.",
    start: "시작하기",
    startDescription: "처음에는 언어만 선택하면 됩니다. 고른 뒤 바로 다음 단계로 넘어갈 수 있습니다.",
    fixedAssetsHint: "브랜드 워터마크와 마지막 고정 슬라이드는 자동으로 적용됩니다.",
    mockModeLabel: "데모 모드",
    choosePetKind: "먼저 대상을 선택하세요",
    chooseContentType: "이제 콘텐츠 목적을 선택하세요",
    stepOneTitle: "콘텐츠 주제 아이디어를 정해보세요",
    stepOneDescription:
      "강아지, 고양이, 공통 중 하나를 고른 뒤 목적을 선택하면 AI 주제 제안이 열립니다.",
    continueToTopics: "AI 주제 받기",
    topicSuggestions: "AI 주제 5개",
    pickOneTopic: "지금 만들고 싶은 방향에 가장 가까운 주제를 골라주세요.",
    regenerate: "재생성",
    regenerateAll: "전체 재생성",
    topicInputLabel: "최종 주제",
    topicDescriptionLabel: "주제 설명",
    confirmTopic: "이 주제로 진행",
    scenarioSuggestions: "시나리오 3안",
    scenarioInputLabel: "슬라이드 문구",
    editScenario: "시나리오 다듬기",
    generateAssets: "이미지 생성하기",
    reviewAssets: "결과 확인하기",
    caption: "캡션",
    hashtags: "해시태그",
    prompt: "프롬프트",
    promptHint: "이 화면에서 프롬프트, 캡션, 해시태그를 바로 수정할 수 있습니다.",
    changeImage: "이 이미지 재생성",
    saveEdits: "변경 저장",
    instagramPreview: "인스타그램 미리보기",
    previewHandle: "yukiharu.pet",
    previewSubline: "preview",
    previewPlaceholder: "미리보기 영역",
    makeVideo: "슬라이드 영상 만들기",
    slideDuration: "슬라이드 재생 시간",
    renderVideo: "영상 생성",
    videoReady: "영상 준비가 끝났습니다",
    downloadVideo: "MP4 다운로드",
    downloadImage: "이미지 저장",
    copyAction: "복사",
    saveAction: "저장",
    finalCongrats: "완성되었습니다. 인스타그램용 결과물로 바로 사용할 수 있습니다.",
    progress: "진행 상태",
    score: "점수",
    step: "STEP",
    back: "이전",
    startOver: "처음부터",
    trackLabel: "Progress Track",
    loadingTitle: "콘텐츠를 준비하고 있습니다",
    loadingTopics: "일본과 해외의 펫 트렌드를 살펴보며 쓸 만한 주제를 찾고 있습니다.",
    loadingScenarios: "첫 장에서 시선을 멈추게 하는 흐름으로 시나리오를 구성하고 있습니다.",
    loadingAssets: "이미지, 캡션, 해시태그를 한 번에 생성하고 있습니다.",
    renderingVideo: "이미지를 이어 붙여 슬라이드 영상을 렌더링하고 있습니다.",
    stepTitles: {
      0: "시작",
      1: "방향 선택",
      2: "주제 제안",
      3: "주제 확정",
      4: "시나리오",
      5: "시나리오 편집",
      6: "이미지",
      7: "검토",
      8: "영상",
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
    tagLine: "A compact step-by-step creator for pet-brand Instagram posts and slide videos.",
    chooseLanguage: "Choose a language and begin",
    languageLocked: "The language is locked after you start.",
    start: "Start",
    startDescription: "You only need to pick a language first. After that, you can move straight to the next step.",
    fixedAssetsHint: "The brand watermark and final fixed slide are applied automatically.",
    mockModeLabel: "Demo mode",
    choosePetKind: "Choose the subject first",
    chooseContentType: "Now choose the content goal",
    stepOneTitle: "Set your content topic idea",
    stepOneDescription:
      "Pick dog, cat, or both first, then choose the goal to open AI topic ideas.",
    continueToTopics: "Get AI topics",
    topicSuggestions: "5 AI topic ideas",
    pickOneTopic: "Choose the topic that feels closest to what you want to make now.",
    regenerate: "Regenerate",
    regenerateAll: "Regenerate all",
    topicInputLabel: "Final topic",
    topicDescriptionLabel: "Topic description",
    confirmTopic: "Continue with this topic",
    scenarioSuggestions: "3 scenario options",
    scenarioInputLabel: "Slide copy",
    editScenario: "Refine scenario",
    generateAssets: "Generate images",
    reviewAssets: "Review results",
    caption: "Caption",
    hashtags: "Hashtags",
    prompt: "Prompt",
    promptHint: "You can edit prompts, caption, and hashtags directly on this screen.",
    changeImage: "Regenerate image",
    saveEdits: "Save changes",
    instagramPreview: "Instagram preview",
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
    finalCongrats: "Done. Your result is ready to use on Instagram.",
    progress: "Progress",
    score: "Score",
    step: "STEP",
    back: "Back",
    startOver: "Start over",
    trackLabel: "Progress Track",
    loadingTitle: "Preparing your content",
    loadingTopics: "Checking Japanese and global pet trends to find usable topic ideas.",
    loadingScenarios: "Building a swipe-stopping flow for the first slide.",
    loadingAssets: "Generating images, caption, and hashtags together.",
    renderingVideo: "Rendering the slideshow into a video.",
    stepTitles: {
      0: "Start",
      1: "Direction",
      2: "Topics",
      3: "Topic Lock",
      4: "Scenarios",
      5: "Scenario Edit",
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
      health: "Health",
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
