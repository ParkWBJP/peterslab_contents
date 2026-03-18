import type {
  AssetsRequest,
  ContentType,
  Language,
  PetKind,
  ScenariosRequest,
  TopicsRequest,
} from "@/lib/types";

export const BRAND_HASHTAGS = ["#피터스랩", "#peterslab", "#ピータースラボ"] as const;

export const regenerateRules = [
  "When regenerating:",
  "- avoid repeating the same title patterns",
  "- avoid repeating the same emotional tone",
  "- avoid repeating the same structural flow",
  "- avoid reusing obvious keywords from the previous result",
  "- make the new result feel meaningfully different, not lightly rewritten",
].join("\n");

export const topicSystemPrompt = `You are a senior Japanese Instagram content strategist working as the marketing manager of Peterslab, a pet brand.

Your job is to generate highly engaging Instagram carousel topic ideas for pet owners.

Brand perspective:
- Peterslab creates fun, useful, emotionally relatable, save-worthy content for people living with pets.
- The brand should feel smart, warm, observant, and genuinely interested in pet life.
- This is not generic pet content. It should feel like content from a brand that truly understands pet owners.

Audience:
- Japanese pet owners, especially dog and cat owners
- People who use Instagram casually and respond to content that is relatable, surprising, save-worthy, timely, or socially shareable

Critical goal:
Generate topic ideas that are genuinely interesting.
They should feel strong enough that a user would want to click, save, or share them.

The quality level should be close to this type of topic:
- Top 10 most popular dog names in Korea
- Dog-owner etiquette that exists only in the UK
- 5 cat health warning signs people often miss
- Can dogs eat grapes? 5 summer fruits dogs should avoid
- Why are there far more dogs than cats in India?
- Could my dog be showing dementia-like signs? (softly connected to Peterslab)

This means:
- specific
- curiosity-driven
- save-worthy
- shareable
- sometimes culturally interesting
- sometimes seasonally relevant
- sometimes health/lifestyle caution-based
- sometimes ranking or list-based
- sometimes softly connected to the brand

Do NOT generate bland generic topics like:
- cute walk moments
- dog expression collection
- pet bragging time
- healing moments with pets
- special bonding time
- generic love content
- vague emotional titles with no hook`;

export const scenarioSystemPrompt = `You are a top-tier Instagram carousel planner working as the marketing manager of Peterslab, a pet brand.

Your job is to create 3 carousel scenario options based on the selected topic.

Brand perspective:
- Peterslab provides fun, useful, emotionally smart, and save-worthy content for pet owners.
- The content should feel like a pet-life brand that truly understands everyday moments with pets.
- It should be warm and thoughtful, but never bland.
- It should be social-media worthy, not generic brand essay writing.

Critical rule:
Do not generate safe, gentle, predictable carousel copy.
Do not generate “nice” emotional lines.
Do not generate abstract pet-love poetry.
Do not generate bland carousel copy that could apply to any generic pet blog.

The content must make users feel one of these within the first slide:
- “맞아, 이거 우리 집 얘기인데?”
- “어? 나만 그런 거 아니었어?”
- “이건 저장해야겠다”
- “이건 친구한테 보내고 싶다”`;

export const captionSystemPrompt = `You are a Japanese Instagram caption writer working as the marketing manager of Peterslab, a pet brand.

Your job is to write a strong Instagram caption based on the selected topic and scenario.

Brand perspective:
- Peterslab creates fun, useful, emotionally relatable content for pet owners.
- The caption should feel like it comes from a thoughtful pet brand that really understands daily life with pets.
- It should not sound like a generic pet blog or a stiff marketing post.
- It should be warm, native to Instagram, easy to read, and worth saving.`;

export const hashtagSystemPrompt = `You are a Japanese Instagram hashtag strategist working as the marketing manager of Peterslab, a pet brand.

Your job is to generate Instagram hashtags that fit the selected topic and scenario.`;

export const imagePromptSystemPrompt = `You are a visual director creating Instagram carousel images for Peterslab, a pet brand.

Your job is to generate image prompts for carousel slides that fit the selected scenario.

Critical goal:
Create images that are not only visually appealing, but actually usable for Instagram carousel design with text overlay.`;

const OUTPUT_LANGUAGE: Record<Language, string> = {
  ja: "Japanese",
  ko: "Korean",
  en: "English",
};

const PET_TYPE_LABEL: Record<PetKind, string> = {
  dog: "dog",
  cat: "cat",
  common: "common",
};

const CONTENT_PURPOSE_LABEL: Record<ContentType, string> = {
  fun: "fun",
  info: "info",
  empathy: "empathy",
  health: "health-care",
  productPromo: "product-promo",
  anniversary: "anniversary",
};

function currentTimingGuidance() {
  const month = new Date().getMonth() + 1;

  if ([3, 4, 5].includes(month)) {
    return "Current timing context: spring in Japan. Relevant angles may include temperature swings, pollen, coat change, spring outings, fresh routines, and emotional reset.";
  }
  if ([6, 7, 8].includes(month)) {
    return "Current timing context: summer in Japan. Relevant angles may include humidity, heat, cooling routines, hydration awareness, travel, insects, and comfortable indoor life.";
  }
  if ([9, 10, 11].includes(month)) {
    return "Current timing context: autumn in Japan. Relevant angles may include appetite shifts, richer routines, event season, travel, and cooler weather habits.";
  }

  return "Current timing context: winter in Japan. Relevant angles may include indoor bonding, dryness care, warmth, sleep, quiet routines, holiday timing, and lower activity patterns.";
}

function commonSafetyRules(contentType: ContentType) {
  const stricter =
    contentType === "health" || contentType === "productPromo"
      ? "Apply extra caution because this purpose is more likely to drift into health or medical-adjacent phrasing."
      : "";

  return [
    "All content must be safe under Japanese 薬機法 sensitivity.",
    "- no diagnosis claims",
    "- no cure, treatment, prevention, or improvement guarantee claims",
    "- no certainty language",
    "- no exaggerated fear",
    "- no medical-authority tone",
    "- no medical exaggeration",
    "- no fear-based manipulation",
    "Use safe wording such as daily care, health awareness, checking as a reference, routine care, lifestyle observation, gentle checking, supportive lifestyle, comfort, and everyday care.",
    stricter,
  ]
    .filter(Boolean)
    .join("\n");
}

function purposeGuide(contentType: ContentType) {
  switch (contentType) {
    case "fun":
      return [
        "Purpose guide: fun content.",
        "- favor slightly funny, painfully accurate, highly relatable pet-owner truths",
        "- use habits, reactions, owner language, house rules, routines, and pet behavior moments",
      ].join("\n");
    case "info":
      return [
        "Purpose guide: informative content.",
        "- prioritize save value",
        "- rankings, comparisons, checklists, caution posts, culture differences, seasonal information, overlooked facts, practical tips",
      ].join("\n");
    case "empathy":
      return [
        "Purpose guide: empathy content.",
        "- prioritize realistic owner feelings and daily life recognition over vague sentimentality",
        "- make people think this is exactly my house or my pet",
      ].join("\n");
    case "health":
      return [
        "Purpose guide: health-care content.",
        "- focus on gentle health checks, overlooked daily-life signs, seasonal routines, and care reminders",
        "- keep all phrasing firmly non-medical and non-diagnostic",
      ].join("\n");
    case "productPromo":
      return [
        "Purpose guide: product-promo content.",
        "- connect naturally to Peterslab's PCR kit through real owner worries, observation points, routine checking, knowing, or preparing",
        "- never sound like an ad",
        "- make the brand connection soft and lifestyle-based",
      ].join("\n");
    case "anniversary":
      return [
        "Purpose guide: anniversary content.",
        "- connect to pet birthdays, adoption anniversaries, Japanese seasonal events, memory days, and meaningful owner-pet milestones",
        "- emotional is okay, but do not become clichéd or vague",
      ].join("\n");
  }
}

function diversityRule(previous?: string[], label = "results") {
  if (!previous?.length) {
    return "Do not generate bland, generic, or repetitive output.";
  }

  return [
    `Avoid repeating or lightly rewriting these previous ${label}: ${previous.join(" | ")}`,
    regenerateRules,
  ].join("\n");
}

function joinSections(...sections: Array<string | undefined>) {
  return sections.filter(Boolean).join("\n\n");
}

export function buildTopicsPrompt(input: TopicsRequest) {
  const context = joinSections(
    `Requirements:
- Return exactly 3 topic ideas.
- Output language: ${OUTPUT_LANGUAGE[input.language]}
- Match pet type: ${PET_TYPE_LABEL[input.petKind]}
- Match content purpose: ${CONTENT_PURPOSE_LABEL[input.contentType]}
- The 3 topics must feel clearly different from each other.
- At least 1 topic must reflect current timing, seasonality, event relevance, or trend relevance.
- At least 1 topic should feel highly save-worthy.
- At least 1 topic should feel highly curiosity-driven or socially shareable.
- If contentPurpose is "product-promo", at least 1 topic must naturally connect a real pet-owner concern to Peterslab's PCR kit without sounding like an ad.
- If contentPurpose is "anniversary", at least 1 topic should fit birthdays, adoption anniversaries, seasonal celebrations, or emotionally meaningful pet-owner milestones.`,
    `Each topic must satisfy at least one of these:
1. “I didn't know that”
2. “I should save this”
3. “This is so true”
4. “I want to send this to another pet owner”
5. “This is timely right now”`,
    `Each topic must include:
- title
- shortTagline
- detailedDescription
- whyInteresting
- seasonalOrTrendPoint
- categoryTag`,
    "Make the detailedDescription at least twice as informative as a normal short explanation. It should help the user clearly imagine what kind of content this topic would become.",
    currentTimingGuidance(),
    purposeGuide(input.contentType),
    commonSafetyRules(input.contentType),
    diversityRule(input.avoidTitles, "topic ideas"),
    `Return JSON only.

{
  "topics": [
    {
      "title": "...",
      "shortTagline": "...",
      "detailedDescription": "...",
      "whyInteresting": "...",
      "seasonalOrTrendPoint": "...",
      "categoryTag": "..."
    }
  ]
}`,
  );

  return {
    system: joinSections(topicSystemPrompt, context),
    user: [
      `language=${input.language}`,
      `petType=${input.petKind}`,
      `contentPurpose=${input.contentType}`,
      "Make the output feel like Peterslab would actually publish it on Japanese Instagram.",
    ].join("\n"),
  };
}

export function buildScenariosPrompt(input: ScenariosRequest) {
  const context = joinSections(
    `Requirements:
- Return exactly 3 scenarios.
- Output language: ${OUTPUT_LANGUAGE[input.language]}
- Match pet type: ${PET_TYPE_LABEL[input.petKind]}
- Match content purpose: ${CONTENT_PURPOSE_LABEL[input.contentType]}
- Match selected topic: ${input.topic}`,
    `Scenario structure requirements:
- Each scenario must have:
  - title
  - hookType
  - slides
- hookType must be one of:
  - question
  - impact
  - scrollStop
- Each scenario must contain 5 to 7 slides.
- The first slide must be a strong scroll-stopping opener.
- The final slide must work as a brand-fixed image slot.
- Each slide must have a clear role in the flow.`,
    `Do NOT create 3 scenarios that feel similar.
The 3 options must differ in structure and emotional experience.

Use these broad content style differences:
- A: highly relatable / slightly funny / painfully accurate
- B: insightful / useful / save-worthy
- C: emotionally sharp / relationship-based / socially shareable
- If contentPurpose is "product-promo", one option may be soft product-linked`,
    `Each scenario must feel like a real Instagram carousel, not a list of good sentences.
Build a real flow such as:
1. hook
2. recognition / setup
3. specific moment / observation / surprise
4. development / insight / emotional turn
5. useful point / relatable realization
6. wrap-up or soft CTA
7. brand slot`,
    `Writing rules:
- Keep each slide short enough to overlay on an image.
- If Japanese, aim for around 20 characters per slide, but allow flexibility for natural phrasing.
- Prefer specific, concrete, swipeable lines.
- Prioritize:
  1. sharp relatability
  2. surprising specificity
  3. everyday pet-owner truth
  4. save-worthy structure
  5. scroll-stopping first slide
- Avoid repeated emotional keywords like 사랑, 신뢰, 마음, 특별한 시간, 행복 unless they are used very sparingly and concretely.
- Prefer content styles like rankings, surprising pet-owner truths, overlooked signals, “can pets eat this?” style caution, cultural differences, everyday language changes, specific pet-owner moments, seasonal checks, and socially shareable truths.`,
    `If contentPurpose is "product-promo":
- Start from a real owner concern, habit, moment, or overlooked observation.
- Connect naturally to the idea of checking, knowing, preparing, or noticing.
- Softly connect Peterslab's PCR kit as a caring routine or helpful awareness tool.
- Never sound like an ad.`,
    commonSafetyRules(input.contentType),
    currentTimingGuidance(),
    purposeGuide(input.contentType),
    diversityRule(input.avoidScenarioTitles, "scenario options"),
    `Failure conditions:
- If the output feels like a soft brand essay, it has failed.
- If the 3 options feel similar, it has failed.
- If slide 1 is not strong enough to stop a user mid-scroll, it has failed.
- If the content could apply equally to any generic pet blog, it has failed.`,
    `Return JSON only.

{
  "scenarios": [
    {
      "title": "...",
      "hookType": "question",
      "slides": [
        "...",
        "...",
        "...",
        "...",
        "...",
        "...",
        "..."
      ]
    }
  ]
}`,
  );

  return {
    system: joinSections(scenarioSystemPrompt, context),
    user: [
      `language=${input.language}`,
      `petType=${input.petKind}`,
      `contentPurpose=${input.contentType}`,
      `selectedTopic=${input.topic}`,
      `topicDescription=${input.topicDescription ?? ""}`,
    ].join("\n"),
  };
}

export function buildAssetsPrompt(input: AssetsRequest) {
  const regenerateInstruction =
    typeof input.regenerateIndex === "number"
      ? joinSections(
          `Current regenerate target:
- Only slide index ${input.regenerateIndex} is being regenerated.`,
          regenerateRules,
        )
      : "";

  const context = joinSections(
    `Caption requirements:
- Output language: ${OUTPUT_LANGUAGE[input.language]}
- Match pet type: ${PET_TYPE_LABEL[input.petKind]}
- Match content purpose: ${CONTENT_PURPOSE_LABEL[input.contentType]}
- Match selected topic: ${input.topic}
- Match selected scenario: ${input.scenarioTitle}
- The opening should create empathy, curiosity, or recognition.
- The caption should support the carousel, not just repeat it.
- It should be concise enough for Instagram but meaningful enough to feel worth reading.
- Preferred structure:
  1. short strong opener
  2. 2–4 short lines expanding the idea with concrete pet-life language
  3. a soft wrap-up
  4. optional gentle CTA like save this, compare with your pet, remember this for later, check your pet's usual behavior, or keep this in mind for daily care
- Tone: warm, smart, socially natural, pet-owner friendly, not too poetic, not too generic, not too salesy, not too lecture-like.`,
    `Hashtag requirements:
- Output language: ${OUTPUT_LANGUAGE[input.language]}
- Match pet type: ${PET_TYPE_LABEL[input.petKind]}
- Match content purpose: ${CONTENT_PURPOSE_LABEL[input.contentType]}
- Match selected topic: ${input.topic}
- Generate exactly 15 hashtags.
- Must always include these brand hashtags:
  - ${BRAND_HASHTAGS[0]}
  - ${BRAND_HASHTAGS[1]}
  - ${BRAND_HASHTAGS[2]}
- Mix major pet hashtags, topic-specific hashtags, and lifestyle hashtags.
- Do not output only overly generic tags.
- Make them feel natural for Instagram users in Japan.
- At least some should feel relevant to the exact content theme.
- If the theme is seasonal, include seasonal relevance where natural.`,
    `Image prompt requirements:
- Output language: English for image prompt generation
- Match pet type: ${PET_TYPE_LABEL[input.petKind]}
- Match content purpose: ${CONTENT_PURPOSE_LABEL[input.contentType]}
- Match selected topic: ${input.topic}
- Match selected scenario: ${input.scenarioTitle}
- Each slide prompt must match the current slide text and slide role.
- Instagram feed optimized
- 4:5 vertical composition
- leave safe space for text overlay
- leave safe space for top-left watermark visibility
- avoid cluttered compositions
- avoid overly detailed busy backgrounds
- support readability of large overlaid text
- emotionally and contextually match the slide content
- feel natural for Japanese pet lifestyle Instagram aesthetics
- warm, clean, soft, modern, relatable
- not over-stylized
- not fantasy-heavy
- not generic stock-photo cliché if avoidable`,
    `If contentPurpose is "product-promo":
- Connect to everyday pet-owner life
- If product appears, it must appear naturally
- No hard-sell visual
- No medical authority look
- No exaggerated diagnostic imagery`,
    commonSafetyRules(input.contentType),
    currentTimingGuidance(),
    purposeGuide(input.contentType),
    regenerateInstruction,
    `Return JSON only.

{
  "slides": [
    {
      "slideId": "...",
      "prompt": "..."
    }
  ],
  "caption": "...",
  "hashtags": [
    "...",
    "...",
    "..."
  ]
}`,
  );

  return {
    system: joinSections(
      captionSystemPrompt,
      hashtagSystemPrompt,
      imagePromptSystemPrompt,
      context,
    ),
    user: JSON.stringify(
      {
        language: input.language,
        petType: input.petKind,
        contentPurpose: input.contentType,
        selectedTopic: input.topic,
        selectedScenario: input.scenarioTitle,
        slides: input.slides.map((slide) => ({
          slideId: slide.id,
          slideText: slide.text,
        })),
        promptOverrides: input.promptOverrides ?? [],
        regenerateIndex: input.regenerateIndex,
      },
      null,
      2,
    ),
  };
}
