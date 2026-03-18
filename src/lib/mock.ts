import { BRAND_HASHTAGS, buildAssetsPrompt } from "@/lib/prompts";
import type {
  AssetsRequest,
  AssetsResponse,
  ContentType,
  Language,
  ScenarioHook,
  ScenarioOption,
  ScenariosRequest,
  ScenariosResponse,
  TopicSuggestion,
  TopicsRequest,
  TopicsResponse,
} from "@/lib/types";
import { createId } from "@/lib/utils";

type TopicSeed = Omit<TopicSuggestion, "id">;

const seasons: Record<Language, string> = {
  ja: "今の季節感や生活リズムの変化とつながる切り口です。",
  ko: "지금 시기의 계절감과 생활 리듬 변화에 자연스럽게 연결됩니다.",
  en: "This angle connects naturally to current seasonal and lifestyle timing.",
};

function t<T>(language: Language, values: Record<Language, T>) {
  return values[language];
}

function topic(
  language: Language,
  values: {
    title: Record<Language, string>;
    shortTagline: Record<Language, string>;
    detailedDescription: Record<Language, string>;
    whyInteresting: Record<Language, string>;
    categoryTag: string;
  },
): TopicSeed {
  return {
    title: t(language, values.title),
    shortTagline: t(language, values.shortTagline),
    detailedDescription: t(language, values.detailedDescription),
    whyInteresting: t(language, values.whyInteresting),
    seasonalOrTrendPoint: seasons[language],
    categoryTag: values.categoryTag,
  };
}

function topicSeeds(language: Language, contentType: ContentType): TopicSeed[] {
  const groups: Record<ContentType, TopicSeed[]> = {
    fun: [
      topic(language, {
        title: { ja: "外出前3秒でわかる本音", ko: "외출 직전 3초에 드러나는 속마음", en: "The 3 seconds before going out say everything" },
        shortTagline: { ja: "玄関前の反応だけで性格が見える", ko: "현관 앞 반응만 봐도 성격이 보입니다", en: "Pre-outing reactions reveal the whole personality" },
        detailedDescription: { ja: "外出前の表情や待ち方に絞ったテーマで、1枚ずつ反応を読み解くカルーセルにしやすいです。", ko: "외출 직전 표정과 기다리는 방식에 집중해 한 장씩 반응을 읽는 카드뉴스로 만들기 좋습니다.", en: "This angle turns tiny pre-outing reactions into a swipeable carousel where each slide decodes one behavior." },
        whyInteresting: { ja: "かわいさだけでなく、うちの子あるあるとして保存や共有につながりやすいからです。", ko: "귀여움만이 아니라 우리 집 이야기처럼 느껴져 저장과 공유로 이어지기 쉽기 때문입니다.", en: "It is cute, specific, and easy for owners to save or send to another pet owner." },
        categoryTag: "fun-life",
      }),
      topic(language, {
        title: { ja: "家のルールはもう向こうが決めている", ko: "집 안의 규칙은 이미 정해져 있다", en: "Pets already decided the house rules" },
        shortTagline: { ja: "生活動線の主導権はペットにある", ko: "생활 동선의 주도권은 반려동물이 쥡니다", en: "The pet clearly owns the routine" },
        detailedDescription: { ja: "家の中の暗黙ルールをペット目線で整理するテーマで、生活感の強い保存형 콘텐츠に向きます。", ko: "집 안의 암묵적인 규칙을 반려동물 기준으로 풀어내는 주제로 생활감 있는 저장형 콘텐츠에 맞습니다.", en: "This topic frames ordinary home life through hidden pet-made rules, which makes it sharper and more save-worthy." },
        whyInteresting: { ja: "飼い主が自分の家のルールを思い出してコメントしたくなるからです。", ko: "보호자가 자기 집 규칙을 바로 떠올려 댓글을 남기고 싶어지기 때문입니다.", en: "It invites immediate owner recognition and comment-worthy comparison." },
        categoryTag: "fun-life",
      }),
      topic(language, {
        title: { ja: "その顔、たぶん今それ違う", ko: "그 표정, 지금은 아니란 뜻", en: "That face means the timing is wrong" },
        shortTagline: { ja: "表情翻訳だけで最後まで見せる", ko: "표정 번역만으로도 끝까지 넘기게 됩니다", en: "Expression translation becomes the hook" },
        detailedDescription: { ja: "表情と本音のズレで見せるテーマで、1枚目のフックが強く、各スライドに小さなオチを置けます。", ko: "표정과 속마음의 어긋남으로 풀어내는 주제로 첫 장 후킹과 슬라이드별 리듬을 만들기 쉽습니다.", en: "This is a visual-first topic that can stop scrolling quickly and still build a full carousel flow." },
        whyInteresting: { ja: "海外SNSのミーム感を、日本の飼い主に合う温度で使いやすいからです。", ko: "해외 펫 밈 감각을 일본형 공감 톤으로 바꾸기 좋은 소재이기 때문입니다.", en: "It combines strong visual humor with a warmer, brand-safe pet-life angle." },
        categoryTag: "fun-life",
      }),
    ],
    info: [
      topic(language, {
        title: { ja: "先に見たい小さな生活変化", ko: "먼저 보고 싶은 작은 생활 변화", en: "Small routine changes worth noticing first" },
        shortTagline: { ja: "日常観察を保存向き情報に変える", ko: "일상 관찰을 저장용 정보로 바꿉니다", en: "Useful observation without sounding heavy" },
        detailedDescription: { ja: "食欲や動きなどの小さな変化を整理し、日常ケアの参考として見返しやすいテーマです。", ko: "식욕과 움직임 같은 작은 변화를 정리해 일상 케어 참고용으로 저장하기 좋은 주제입니다.", en: "This topic organizes appetite, movement, and rest into a calm, saveable daily-care reference." },
        whyInteresting: { ja: "重すぎず実用的で、後から使える情報として残るからです。", ko: "무겁지 않고 실용적이어서 나중에도 다시 볼 가치가 남기 때문입니다.", en: "It feels practical enough to save without becoming overly clinical." },
        categoryTag: "save-worthy-info",
      }),
      topic(language, {
        title: { ja: "夜の習慣を見直す順番", ko: "밤 루틴을 다시 보는 순서", en: "Night habits to review before rhythm feels off" },
        shortTagline: { ja: "今日から動ける情報にする", ko: "오늘부터 바꿔볼 수 있는 정보", en: "A routine-reset angle owners can use tonight" },
        detailedDescription: { ja: "夜の過ごし方を具体的な順番で見せるので、5〜7枚の情報カルーセルにしやすいです。", ko: "밤 시간을 구체적인 순서로 정리할 수 있어 5~7장의 정보형 카드뉴스로 만들기 쉽습니다.", en: "This topic translates vague care advice into concrete evening scenes that work well in carousel form." },
        whyInteresting: { ja: "読んだあとにすぐ試せるので保存率が上がりやすいからです。", ko: "읽고 바로 시도해볼 수 있어 저장률이 높아지기 쉽기 때문입니다.", en: "It turns reading into immediate action, which increases save value." },
        categoryTag: "save-worthy-info",
      }),
      topic(language, {
        title: { ja: "写真フォルダが教えてくれること", ko: "사진 폴더가 알려주는 생활 리듬", en: "What the camera roll already tells owners" },
        shortTagline: { ja: "記録が苦手でも始めやすい", ko: "기록이 어려운 사람에게 맞는 관찰법", en: "A low-friction observation method hidden in photos" },
        detailedDescription: { ja: "スマホ写真を使って日常の表情やリズムを見返すテーマで、情報型でも入りやすい構成にできます。", ko: "휴대폰 사진으로 표정과 리듬을 돌아보는 주제로 정보형이지만 진입장벽이 낮습니다.", en: "This topic uses ordinary phone photos as a lighter way to notice mood and routine patterns." },
        whyInteresting: { ja: "すでに持っている素材から始められるので試しやすいからです。", ko: "이미 있는 자료로 시작할 수 있어 부담 없이 따라 해보기 쉽기 때문입니다.", en: "It feels clever and practical because it starts from something owners already have." },
        categoryTag: "save-worthy-info",
      }),
    ],
    empathy: [
      topic(language, {
        title: { ja: "何も言わずについてくる日", ko: "말없이 따라오는 날", en: "The days pets follow without asking for anything" },
        shortTagline: { ja: "静かな距離感に関係が出る", ko: "조용한 거리감에서 관계가 보입니다", en: "Quiet closeness beats loud affection" },
        detailedDescription: { ja: "小さな付き添い行動を通して、飼い主が感じる安心や関係の深まりを見せるテーマです。", ko: "작은 따라옴과 동행 장면을 통해 보호자가 느끼는 안심과 관계의 깊이를 보여주는 주제입니다.", en: "This topic builds an emotional carousel through subtle companionship instead of dramatic moments." },
        whyInteresting: { ja: "『うちもそう』の反応が出やすく、共感コメントが深くなりやすいからです。", ko: "‘우리 집도 그래’라는 반응이 나오기 쉬워 공감 댓글이 깊어지기 때문입니다.", en: "It triggers strong recognition without relying on generic sentimental writing." },
        categoryTag: "relatable-emotion",
      }),
      topic(language, {
        title: { ja: "少し静かな日に、余計に見えること", ko: "조금 조용한 날 더 잘 보이는 것", en: "What owners notice more on slightly quieter days" },
        shortTagline: { ja: "不安をあおらず感情を整理する", ko: "불안을 키우지 않고 감정을 정리합니다", en: "Emotion and observation without fear marketing" },
        detailedDescription: { ja: "普段より少し違う日の空気感を、観察と感情の両方から見せられるテーマです。", ko: "평소보다 조금 다른 날의 공기를 관찰과 감정 양쪽에서 풀어낼 수 있는 주제입니다.", en: "This topic keeps the tone calm while turning a subtle shift into a meaningful carousel flow." },
        whyInteresting: { ja: "守りたい気持ちと生活感の両方があり、保存価値が生まれやすいからです。", ko: "지켜보고 싶은 마음과 생활감이 함께 살아 저장 가치가 높아지기 때문입니다.", en: "It balances care and realism, which makes it more trustworthy and memorable." },
        categoryTag: "relatable-emotion",
      }),
      topic(language, {
        title: { ja: "小さいのに忘れにくい支え", ko: "작은데 오래 남는 위로", en: "Small memories that quietly hold owners together" },
        shortTagline: { ja: "派手じゃない瞬間の方が残る", ko: "큰 사건보다 작은 순간이 더 남습니다", en: "Small memories feel more real than big declarations" },
        detailedDescription: { ja: "朝や帰宅後などの小さな場面を通して、生活の中の支えを見せるテーマです。", ko: "아침이나 귀가 후 같은 작은 장면으로 생활 속 위로를 보여주는 주제입니다.", en: "This topic uses tiny everyday scenes to build a carousel with emotional precision and warmth." },
        whyInteresting: { ja: "詩的すぎず、ブランドが本当に生活をわかっている感じを出せるからです。", ko: "과장되지 않아 브랜드가 정말 펫 라이프를 이해한다는 느낌을 주기 쉽기 때문입니다.", en: "It feels more believable than abstract healing content and still leaves warmth." },
        categoryTag: "relatable-emotion",
      }),
    ],
    health: [
      topic(language, {
        title: { ja: "朝に見たい3つのやさしいチェック", ko: "아침에 보고 싶은 3가지 체크", en: "Three gentle morning checks for daily care" },
        shortTagline: { ja: "決めつけずに日常を見る", ko: "단정하지 않고 일상을 살핍니다", en: "Observation first, certainty never" },
        detailedDescription: { ja: "食べ方や動き方などを、日常ケアの参考として落ち着いて整理できるテーマです。", ko: "먹는 반응과 움직임 등을 일상 케어 참고용으로 차분히 정리할 수 있는 주제입니다.", en: "This topic gives a calm structure around appetite, movement, and rest without overclaiming." },
        whyInteresting: { ja: "何を見ればいいかが具体的で、薬機法に配慮しながらも実用性があるからです。", ko: "무엇을 봐야 하는지 구체적이어서 안전하면서도 실용적이기 때문입니다.", en: "It stays brand-safe while still feeling genuinely useful." },
        categoryTag: "gentle-care",
      }),
      topic(language, {
        title: { ja: "食欲メモを重くしない見方", ko: "식욕 메모를 보는 다른 기준", en: "A lighter way to read appetite notes" },
        shortTagline: { ja: "量だけでなく反応とリズムを見る", ko: "양보다 반응과 리듬을 봅니다", en: "Look at rhythm and response, not just amount" },
        detailedDescription: { ja: "食べた量だけでなく、反応や普段との違いをどう見るかを整理するテーマです。", ko: "먹은 양뿐 아니라 반응과 평소 패턴 차이를 어떻게 볼지 정리하는 주제입니다.", en: "This topic turns appetite-related concern into a calmer, easier-to-save observation frame." },
        whyInteresting: { ja: "不安を強めず、観察の軸を増やせるからです。", ko: "걱정을 키우지 않고 관찰 기준을 늘려주기 때문입니다.", en: "It helps owners organize concern instead of amplifying it." },
        categoryTag: "gentle-care",
      }),
      topic(language, {
        title: { ja: "『今日は少し違うかも』を整える", ko: "오늘은 조금 다른데?를 정리하는 법", en: "How to frame 'something feels a little different' calmly" },
        shortTagline: { ja: "結論より先に見る順番がある", ko: "결론보다 먼저 볼 순서가 있습니다", en: "A better structure for everyday observation" },
        detailedDescription: { ja: "違和感の場面から観察の順番へつなげるテーマで、感情だけで終わらない構成にできます。", ko: "막연한 위화감에서 관찰 순서로 이어지게 만드는 주제로 감정에서 끝나지 않게 할 수 있습니다.", en: "This topic moves from vague concern into a clear observation order that fits carousel structure well." },
        whyInteresting: { ja: "保存して後から見返したい『参考用』の投稿にしやすいからです。", ko: "저장해 두고 다시 보기 좋은 참고용 콘텐츠로 만들기 쉽기 때문입니다.", en: "It gives shape to uncertainty without sounding medical or cold." },
        categoryTag: "gentle-care",
      }),
    ],
    productPromo: [
      topic(language, {
        title: { ja: "気のせいで終わらせたくない日", ko: "그냥 넘기고 싶지 않은 날", en: "The days owners do not want to brush off" },
        shortTagline: { ja: "迷いからやさしく入る", ko: "일상의 망설임에서 부드럽게 시작합니다", en: "Start from hesitation, not from a sales pitch" },
        detailedDescription: { ja: "少し気になるけれど大ごとにはしたくない、そんな場面から始めてPeterslabのPCR検査キットへ自然につなぐテーマです。", ko: "조금 신경 쓰이지만 과하게 걱정하고 싶지 않은 순간에서 시작해 Peterslab PCR 검사 키트로 자연스럽게 연결하는 주제입니다.", en: "This topic starts from a real owner concern and lets the Peterslab PCR kit appear naturally inside a calm daily-care flow." },
        whyInteresting: { ja: "生活の悩みが先に見えるので、商品紹介でも広告っぽく見えにくいからです。", ko: "생활 고민이 먼저 보여서 제품 소개라도 광고처럼 느껴지지 않기 때문입니다.", en: "The product fits a believable moment instead of interrupting it like an ad." },
        categoryTag: "soft-product-connection",
      }),
      topic(language, {
        title: { ja: "迷う時間を準備に変える", ko: "망설이는 시간을 준비로 바꾸기", en: "Turn uncertain time into a caring routine" },
        shortTagline: { ja: "病院前の空白時間に寄り添う", ko: "병원 전 공백 시간에 필요한 흐름", en: "Useful before the next step feels clear" },
        detailedDescription: { ja: "何を見て、どう整理して、どこでやさしくチェックにつなげるかを見せるテーマです。", ko: "무엇을 보고 어떻게 정리할지, 그리고 어떤 gentle check로 이어질지를 보여주는 주제입니다.", en: "This topic focuses on the in-between time before an owner knows the next step and places the PCR kit inside that routine." },
        whyInteresting: { ja: "売り込みより安心感を優先した流れを作りやすいからです。", ko: "판매보다 안심감을 우선하는 흐름을 만들기 쉽기 때문입니다.", en: "It lowers resistance because it respects hesitation instead of exploiting it." },
        categoryTag: "soft-product-connection",
      }),
      topic(language, {
        title: { ja: "観察の次にあるやさしい一手", ko: "관찰 다음에 있는 부드러운 한 걸음", en: "A gentle next step after observation" },
        shortTagline: { ja: "メモだけで終わらせない", ko: "메모로 끝나지 않는 caring routine", en: "Show the kit as part of a caring routine" },
        detailedDescription: { ja: "観察ポイントだけで終わらせず、daily careの流れの中でPCR検査キットを見せるテーマです。", ko: "관찰 포인트만 던지고 끝내지 않고 daily care 흐름 안에서 PCR 검사 키트를 보여주는 주제입니다.", en: "This topic extends everyday observation into a softer next action and positions the PCR kit as a routine support tool." },
        whyInteresting: { ja: "商品が強く出すぎず、Peterslabのやさしいブランド感を守りやすいからです。", ko: "제품이 튀지 않아 Peterslab의 caring brand tone을 지키기 쉽기 때문입니다.", en: "It adds product relevance without losing trust or warmth." },
        categoryTag: "soft-product-connection",
      }),
    ],
    anniversary: [
      topic(language, {
        title: { ja: "去年と違う、今年のうれしさ", ko: "올해의 기쁨은 작년과 다르다", en: "What feels different about this year's anniversary" },
        shortTagline: { ja: "節目を関係の深さで見せる", ko: "기념일을 관계의 깊이로 보여줍니다", en: "Show the bond, not just the milestone" },
        detailedDescription: { ja: "誕生日やうちの子記念日を、関係の変化や生活の積み重ねで見せるテーマです。", ko: "생일이나 입양 기념일을 관계의 변화와 생활의 누적으로 보여주는 주제입니다.", en: "This topic treats an anniversary as a relationship checkpoint rather than just a celebration post." },
        whyInteresting: { ja: "自慢だけで終わらず、他の飼い主も共感しやすいからです。", ko: "자랑형 게시물에 그치지 않아 다른 보호자도 공감하기 쉽기 때문입니다.", en: "It feels more meaningful and more save-worthy than a generic celebration post." },
        categoryTag: "milestone-story",
      }),
      topic(language, {
        title: { ja: "迎えてから変わった小さなこと", ko: "함께 살며 달라진 작은 것들", en: "The small parts of home that changed after the pet arrived" },
        shortTagline: { ja: "暮らしの変化で記念日を語る", ko: "기념일을 생활의 변화로 풀어냅니다", en: "Tell the anniversary through daily life" },
        detailedDescription: { ja: "動線、写真フォルダ、帰宅後の流れなど、ペットと暮らして変わった日常を見せるテーマです。", ko: "동선, 사진 폴더, 귀가 루틴처럼 함께 살며 달라진 일상을 보여주는 주제입니다.", en: "This topic frames the anniversary through changes in routine, space, and family rhythm." },
        whyInteresting: { ja: "他の飼い主も自分の記念日投稿に置き換えやすいからです。", ko: "다른 보호자도 자신의 기념일 이야기로 바꾸기 쉽기 때문입니다.", en: "It invites strong self-recognition and easy adaptation." },
        categoryTag: "milestone-story",
      }),
      topic(language, {
        title: { ja: "完璧な写真より、いつもの顔", ko: "완벽한 사진보다 평소 얼굴", en: "Everyday expressions matter more than perfect anniversary photos" },
        shortTagline: { ja: "自然体の記念日がいちばん残る", ko: "자연스러운 기념일이 더 오래 남습니다", en: "A softer and more modern celebration angle" },
        detailedDescription: { ja: "特別な演出ではなく、普段の表情と関係性で記念日を見せるテーマです。", ko: "특별한 연출보다 평소 표정과 관계성으로 기념일을 보여주는 주제입니다.", en: "This topic shifts attention away from staged perfection and toward ordinary expressions that feel true." },
        whyInteresting: { ja: "真似しやすく、今っぽい自然さで共感を取りやすいからです。", ko: "따라 하기 쉽고 지금스러운 자연스러움으로 공감을 얻기 쉽기 때문입니다.", en: "It feels more believable and easier to recreate than a polished shoot." },
        categoryTag: "milestone-story",
      }),
    ],
  };

  return groups[contentType];
}

function scenario(language: Language, title: string, hookType: ScenarioHook, slides: string[]): ScenarioOption {
  return {
    id: createId("scenario"),
    title,
    hook: hookType,
    slides: slides.map((text) => ({ id: createId("slide"), text })),
  };
}

function scenarioSeeds(language: Language, contentType: ContentType, topic: string): ScenarioOption[] {
  if (contentType === "productPromo") {
    return [
      scenario(
        language,
        t(language, { ja: "共感から入る導線", ko: "공감으로 시작하는 흐름", en: "Empathy-led flow" }),
        "question",
        t(language, {
          ja: ["その違和感、気のせい？", "少しだけいつもと違う", "でも大ごとにはしたくない", "まずは日常を整理する", "PCRキットをやさしく知る", "ケアの参考にする", "最後はブランド固定スライド"],
          ko: ["이럴 때 그냥 넘기세요?", "평소와 조금 다르다", "그래도 과하게 걱정하긴 싫다", "먼저 일상을 정리한다", "PCR 검사 키트를 떠올린다", "케어 참고로 연결한다", "마지막은 브랜드 고정 슬라이드"],
          en: ["Do owners brush this off?", "Something feels slightly different", "But it still feels too early to overreact", "Daily changes get organized first", "Then the PCR kit appears softly", "As a calm care reference", "The last slide fits the fixed brand image"],
        }),
      ),
      scenario(
        language,
        t(language, { ja: "保存したくなる整理型", ko: "저장하고 싶은 정리형", en: "Save-worthy structure" }),
        "impact",
        t(language, {
          ja: ["迷う日に先に見る3つ", "食べ方の反応", "動きの入り方", "休み方の違い", "メモだけで終わらせない", "やさしい選択肢も知る", "最後はブランド固定スライド"],
          ko: ["애매한 날엔 이 3가지", "먹는 반응", "움직임의 리듬", "쉬는 방식의 차이", "메모만 하고 끝내지 않는다", "체크 선택지도 알아둔다", "마지막은 브랜드 고정 슬라이드"],
          en: ["Check these 3 first", "Eating response", "Movement rhythm", "Rest pattern", "Do not stop at vague notes", "Know the calm next option too", "The last slide fits the fixed brand image"],
        }),
      ),
      scenario(
        language,
        t(language, { ja: "やわらかい商品接続型", ko: "제품으로 이어지는 부드러운 흐름", en: "Soft product connection" }),
        "scrollStop",
        t(language, {
          ja: ["病院前の空白時間が長い", "何もしないのは不安", "でも断定もしたくない", "だから観察を一歩進める", "PCRキットを自然に接続", "日々のケアで締める", "最後はブランド固定スライド"],
          ko: ["병원 전 공백 시간이 길다", "아무것도 안 하긴 불안하다", "하지만 단정하긴 이르다", "그래서 관찰을 한 단계 더 본다", "PCR 검사 키트를 자연스럽게 연결한다", "일상 케어로 마무리한다", "마지막은 브랜드 고정 슬라이드"],
          en: ["The uncertain gap feels longest", "Doing nothing feels incomplete", "Jumping to certainty feels wrong", "So the story moves to observation", "The PCR kit enters naturally", "Frame it as caring routine support", "The last slide fits the fixed brand image"],
        }),
      ),
    ];
  }

  return [
    scenario(
      language,
      t(language, { ja: "共感から入る流れ", ko: "공감으로 시작하는 흐름", en: "Empathy-led flow" }),
      "question",
      t(language, {
        ja: [`${topic}、うちもそう？`, "最初は小さな場面", "飼い主はすぐ気づく", "そこに関係が出る", "共感ポイントを置く", "最後は静かな余韻"],
        ko: [`${topic}, 우리 집도 그래요?`, "처음은 아주 작은 장면", "보호자는 바로 눈치챈다", "여기서 관계가 드러난다", "공감 포인트를 찍는다", "마지막은 잔잔한 여운"],
        en: [`Have you seen this in ${topic.toLowerCase()}?`, "Start with one ordinary scene", "The owner notices it fast", "That is where the bond shows", "Place one strong empathy beat", "Close with a soft memory hook"],
      }),
    ),
    scenario(
      language,
      t(language, { ja: "保存したくなる整理型", ko: "저장하고 싶은 정리형", en: "Save-worthy structure" }),
      "impact",
      t(language, {
        ja: ["保存したいのはここ", "まず一つ目の観察点", "次に見る生活変化", "よくある思い込み", "今日から使える見方", "最後は短く締める"],
        ko: ["저장하려면 이 흐름", "첫 번째 관찰 포인트", "두 번째 생활 변화", "헷갈리기 쉬운 오해", "오늘부터 쓰는 기준", "마지막은 짧게 정리"],
        en: ["Save this angle", "Show one observation point", "Add the daily-life shift", "Break one easy misconception", "Turn it into a takeaway", "Close with a short reminder"],
      }),
    ),
    scenario(
      language,
      t(language, { ja: "関係性でめくる型", ko: "관계성으로 넘기게 하는 형식", en: "Relationship-led flow" }),
      "scrollStop",
      t(language, {
        ja: ["この一枚で止まる", "日常の場面を置く", "表情や動きを読む", "飼い主感情を重ねる", "少し意外な気づき", "最後は温かく着地"],
        ko: ["이 장면 하나면 멈춘다", "아주 평범한 일상에서 시작", "표정과 움직임을 읽는다", "보호자 감정을 겹친다", "중간에 의외성을 둔다", "마지막은 따뜻하게 닫기"],
        en: ["This one moment stops the scroll", "Open with a familiar scene", "Read the movement or expression", "Add the owner emotion", "Place one surprising insight", "End with warmth"],
      }),
    ),
  ];
}

function svgDataUrl(title: string, body: string, accent: string) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${accent}" />
        <stop offset="100%" stop-color="#f7f1ea" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1350" rx="36" fill="url(#g)" />
    <text x="88" y="110" fill="#513628" font-size="42" font-family="Arial">Peterslab Demo</text>
    <text x="88" y="720" fill="#281c17" font-size="56" font-weight="700" font-family="Arial">${escapeXml(title)}</text>
    <foreignObject x="88" y="790" width="860" height="290">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial; font-size: 28px; color: #4d3931; line-height: 1.45;">
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

function mockCaption(input: AssetsRequest) {
  if (input.contentType === "productPromo") {
    return t(input.language, {
      ja: "日常の気づきからやさしくケアへつなげる、Peterslab向けキャプション下書きです。観察、気づき、やさしいチェックの流れの中で、PCR検査キットも自然に結びつくように整えています。",
      ko: "일상의 작은 변화에서 차분한 케어 흐름으로 이어지는 Peterslab용 캡션 초안입니다. 관찰과 인식, gentle check의 흐름 안에서 PCR 검사 키트도 자연스럽게 연결되도록 맞췄습니다.",
      en: "This Peterslab caption draft connects a real owner concern to a calm daily-care flow and lets the PCR kit appear naturally as a gentle checking option.",
    });
  }

  return t(input.language, {
    ja: "『これ、うちもそう』と思いやすく、保存や共有につながりやすいように整えたPeterslab向けキャプション下書きです。",
    ko: "‘이거 우리 집 이야기 같아’라는 반응이 나오도록 정리한 Peterslab용 캡션 초안입니다.",
    en: "This Peterslab caption draft is shaped to feel relatable, save-worthy, and naturally shareable.",
  });
}

function mockHashtags(language: Language, contentType: ContentType) {
  const extra =
    language === "ja"
      ? ["#ペットとの暮らし", "#インスタペット", "#保存したい投稿", "#ペットブランド", "#カードニュース", contentType === "productPromo" ? "#健康チェック" : "#うちの子あるある", contentType === "anniversary" ? "#うちの子記念日" : "#飼い主目線", "#犬のいる暮らし", "#猫のいる暮らし", "#日本のペット暮らし", "#暮らしの記録", "#ペット観察"]
      : language === "ko"
        ? ["#반려생활", "#펫스타그램", "#저장각", "#펫브랜드", "#카드뉴스", contentType === "productPromo" ? "#건강체크" : "#반려일상", contentType === "anniversary" ? "#기념일콘텐츠" : "#보호자시점", "#강아지", "#고양이", "#일본펫라이프", "#인스타콘텐츠", "#관찰포인트"]
        : ["#petparents", "#petlovers", "#petinstagram", "#petbrand", "#carouselpost", contentType === "productPromo" ? "#healthcheck" : "#relatablepets", contentType === "anniversary" ? "#gotchaday" : "#petbond", "#dogsofinstagram", "#catsofinstagram", "#japanpet", "#saveworthy", "#petstory"];

  return [...new Set([...BRAND_HASHTAGS, ...extra])].slice(0, 15);
}

export function generateMockTopics(input: TopicsRequest): TopicsResponse {
  const seeds = topicSeeds(input.language, input.contentType);
  const avoid = new Set((input.avoidTitles ?? []).map((item) => item.trim().toLowerCase()));
  const ordered = [...seeds.filter((item) => !avoid.has(item.title.toLowerCase())), ...seeds.filter((item) => avoid.has(item.title.toLowerCase()))];
  return {
    topics: ordered.slice(0, 3).map((item) => ({ id: createId("topic"), ...item })),
    usedFallback: true,
  };
}

export function generateMockScenarios(input: ScenariosRequest): ScenariosResponse {
  const seeds = scenarioSeeds(input.language, input.contentType, input.topic);
  const avoid = new Set((input.avoidScenarioTitles ?? []).map((item) => item.trim().toLowerCase()));
  const ordered = [...seeds.filter((item) => !avoid.has(item.title.toLowerCase())), ...seeds.filter((item) => avoid.has(item.title.toLowerCase()))];
  return { scenarios: ordered.slice(0, 3), usedFallback: true };
}

export function generateMockAssets(input: AssetsRequest): AssetsResponse {
  const promptMeta = buildAssetsPrompt(input);
  const slides = input.slides.map((slide, index) => {
    const isFinal = index === input.slides.length - 1;
    const prompt =
      input.promptOverrides?.[index] ||
      `Instagram editorial visual for "${slide.text}", vertical 4:5, clean negative space for text overlay, expressive pet moment, warm natural light, Peterslab brand feel.`;

    return {
      slideId: slide.id,
      text: slide.text,
      prompt,
      imageUrl: svgDataUrl(
        slide.text,
        isFinal ? "Final brand slide is fixed outside the generator." : promptMeta.system,
        ["#ead0c2", "#dfe8d7", "#eadfc7", "#d8e1ef"][index % 4],
      ),
      isFinal,
    };
  });

  return {
    slides,
    caption: mockCaption(input),
    hashtags: mockHashtags(input.language, input.contentType),
    usedFallback: true,
  };
}
