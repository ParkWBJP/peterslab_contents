import type {
  AssetsRequest,
  ContentType,
  Language,
  PetKind,
  ScenariosRequest,
  TopicsRequest,
} from "@/lib/types";

export const BRAND_HASHTAGS = ["#피터스랩", "#peterslab", "#ピータースラボ"] as const;

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

const CATEGORY_TAG: Record<ContentType, string> = {
  fun: "fun-life",
  info: "save-worthy-info",
  empathy: "relatable-emotion",
  health: "gentle-care",
  productPromo: "soft-product-connection",
  anniversary: "milestone-story",
};

function currentTimingGuidance() {
  const month = new Date().getMonth() + 1;

  if ([3, 4, 5].includes(month)) {
    return "Current timing context: early spring in Japan. Seasonal hooks may include temperature swings, pollen, coat change, spring outings, fresh routines, and new-season emotional reset.";
  }
  if ([6, 7, 8].includes(month)) {
    return "Current timing context: summer in Japan. Seasonal hooks may include humidity, heat, cooling routines, hydration awareness, travel, and staying comfortable indoors.";
  }
  if ([9, 10, 11].includes(month)) {
    return "Current timing context: autumn in Japan. Seasonal hooks may include appetite shifts, comfort routines, event season, and richer outing patterns.";
  }

  return "Current timing context: winter in Japan. Seasonal hooks may include indoor bonding, dryness care, warmth, sleep, and quiet routines.";
}

function safeRules(contentType: ContentType) {
  const stricter =
    contentType === "health" || contentType === "productPromo"
      ? "Apply extra caution because this purpose can be interpreted as health-related."
      : "";

  return [
    "All wording must be safe under Japanese Yakujihou sensitivity.",
    "Do NOT write medical, diagnostic, therapeutic, preventive, guaranteed, or exaggerated claims.",
    "Avoid definitive disease-related claims.",
    "Do NOT make Peterslab sound like a medical authority.",
    "Do NOT imply diagnosis, treatment, prevention, cure, certainty, or medical superiority.",
    "Avoid fear-based exaggeration, panic language, or hard authority phrasing.",
    "Use safe expressions such as daily care, health awareness, life with pets, observation, gentle check, routine care, communication, comfort, and supportive lifestyle ideas.",
    stricter,
  ]
    .filter(Boolean)
    .join(" ");
}

function productPromoGuide(contentType: ContentType) {
  if (contentType !== "productPromo") {
    return "";
  }

  return [
    "When contentPurpose is product-promo, connect naturally to Peterslab's PCR test kit.",
    "Start from a real owner concern, routine, or observation.",
    "Then connect gently to checking, knowing, preparing, daily care, or health awareness.",
    "The PCR test kit may be introduced softly as part of a caring routine.",
    "Do not sound aggressive, sales-heavy, or like a hard advertisement.",
  ].join(" ");
}

function anniversaryGuide(contentType: ContentType) {
  if (contentType !== "anniversary") {
    return "";
  }

  return "When contentPurpose is anniversary, topics and scenarios should fit seasonal events, pet birthdays, adoption anniversaries, owner-pet memory days, or culturally relevant celebratory moments.";
}

function diversityRule(previous?: string[], label = "ideas") {
  if (!previous?.length) {
    return "Do NOT generate generic, repetitive, bland, or weak pet SNS ideas.";
  }

  return `Avoid repeating or closely echoing these previous ${label}: ${previous.join(" | ")}. Lower similarity in angle, structure, wording, and emotional payoff.`;
}

export function buildTopicsPrompt(input: TopicsRequest) {
  return {
    system: [
      "You are a senior Japanese SNS content strategist working as the marketing manager of Peterslab, a pet brand.",
      "Your job is to create highly interesting Instagram carousel topic ideas for pet owners, especially Japanese dog and cat owners, from the perspective of a friendly, smart, trustworthy pet brand that provides fun, useful, emotionally engaging information.",
      "Peterslab is not posting random pet content. Peterslab shares interesting, relatable, useful pet-life content that helps pet owners enjoy, understand, and care for their pets better.",
      "Even when the content is light and fun, it should still feel thoughtful, brand-safe, and valuable.",
      safeRules(input.contentType),
      currentTimingGuidance(),
      productPromoGuide(input.contentType),
      anniversaryGuide(input.contentType),
      diversityRule(input.avoidTitles, "topic ideas"),
      `Return exactly 3 topic ideas in ${OUTPUT_LANGUAGE[input.language]}.`,
      `Match pet type: ${PET_TYPE_LABEL[input.petKind]}.`,
      `Match content purpose: ${CONTENT_PURPOSE_LABEL[input.contentType]}.`,
      "The 3 topics must feel clearly different from each other.",
      "Avoid weak, overused ideas like simple walks, cute expressions only, pet bragging only, generic snack making, or vague love/healing topics with no hook.",
      "At least 1 topic must reflect current timing, seasonality, social behavior, or a trend relevant to when the content is being generated.",
      "Prioritize carousel ideas that feel save-worthy, relatable, scroll-stopping, easy to expand into 5 to 7 slides, and emotionally or informationally rewarding.",
      "Think like Japanese pet owners scrolling Instagram. They should feel: this is so true, I want to save this, I want to send this to another pet owner, and this brand gets pet life.",
      'Return JSON only with {"topics":[{"title":"","shortTagline":"","detailedDescription":"","whyInteresting":"","seasonalOrTrendPoint":"","categoryTag":""}]}',
      `Use categoryTag values that fit the purpose. Recommended category tag for this request: ${CATEGORY_TAG[input.contentType]}.`,
    ].join(" "),
    user: [
      `language=${input.language}`,
      `petType=${input.petKind}`,
      `contentPurpose=${input.contentType}`,
      "Make the topics feel like real Peterslab marketing ideas, not generic AI suggestions.",
    ].join("\n"),
  };
}

export function buildScenariosPrompt(input: ScenariosRequest) {
  return {
    system: [
      "You are a top-tier Instagram carousel planner for Peterslab, a pet brand marketing to Japanese pet owners.",
      "Your job is to create 3 strong carousel scenario options based on the selected topic.",
      "You are NOT writing generic good-sounding lines. You ARE designing carousel flows that make pet owners stop, swipe, relate, save, and remember the brand.",
      "Peterslab should feel helpful, warm, interesting, socially shareable, and trustworthy. The tone should feel like a thoughtful pet-life brand, not a lecture and not a medical ad.",
      safeRules(input.contentType),
      currentTimingGuidance(),
      productPromoGuide(input.contentType),
      anniversaryGuide(input.contentType),
      diversityRule(input.avoidScenarioTitles, "scenario options"),
      `Return exactly 3 scenarios in ${OUTPUT_LANGUAGE[input.language]}.`,
      "The 3 scenarios must feel meaningfully different in structure and emotional experience.",
      "The options should vary in style such as relatable or empathy-led, useful information-led, emotional bond-led, and product-connected soft marketing flow when relevant.",
      'Each scenario must contain "title", "hookType", and "slides".',
      'hookType must be one of: question, impact, scrollStop.',
      "Each scenario must contain 5 to 7 slides.",
      "The first slide must be a strong opener.",
      "Each slide must have a clear role in the carousel, not just a nice sentence.",
      "Build a real flow: hook, situation or recognition, insight or observation, deeper point or useful angle, payoff or save-worthy takeaway, optional soft CTA, and final slide that fits the brand-fixed image slot.",
      "Keep each slide short enough to overlay on an image. If the output language is Japanese, aim for around 20 characters per slide, flexible if needed but visually usable.",
      "Avoid abstract, empty emotional lines. Avoid repeated love, trust, heart, healing phrasing unless used very carefully.",
      "Prefer concrete pet-life moments, owner emotions, everyday scenes, observations, and save-worthy phrasing.",
      'Return JSON only with {"scenarios":[{"title":"","hookType":"question","slides":["","","","",""]}]}',
    ].join(" "),
    user: [
      `language=${input.language}`,
      `petType=${input.petKind}`,
      `contentPurpose=${input.contentType}`,
      `topic=${input.topic}`,
      `topicDescription=${input.topicDescription ?? ""}`,
      "Make the scenarios feel like something Japanese pet owners would actually want to swipe through.",
    ].join("\n"),
  };
}

export function buildAssetsPrompt(input: AssetsRequest) {
  const regenerateInstruction =
    typeof input.regenerateIndex === "number"
      ? `Only slide index ${input.regenerateIndex} is being regenerated. Keep the same slide role, but make the visual prompt meaningfully different from previous promptOverrides.`
      : "Generate a cohesive full-slide set.";

  return {
    system: [
      "You are a Japanese Instagram caption writer and visual prompt planner working as the marketing manager of Peterslab, a pet brand.",
      "Your job is to create image prompts, one Instagram caption, and hashtags for pet owners based on the selected topic and scenario.",
      "Peterslab shares fun, useful, thoughtful pet-life content for pet owners. The brand should feel caring, trustworthy, lifestyle-oriented, and emotionally intelligent.",
      "The output should not feel like random generic SNS text. It should feel like a brand that truly understands life with pets.",
      safeRules(input.contentType),
      currentTimingGuidance(),
      productPromoGuide(input.contentType),
      anniversaryGuide(input.contentType),
      regenerateInstruction,
      `Output language must be ${OUTPUT_LANGUAGE[input.language]}.`,
      'Return JSON only with keys "slides", "caption", and "hashtags".',
      'Each item inside "slides" must include "slideId" and "prompt".',
      "Image prompts must describe visuals only. Do not mention overlay text, watermark, UI, logo placement, typography, or captions.",
      "Prompts should produce vertical 4:5 Instagram editorial images with safe negative space for text overlays and strong first-slide readability.",
      "Caption goals: warm, interesting, easy to read, naturally aligned with Peterslab's brand voice, emotionally natural, easy to skim, not too long, but long enough to feel meaningful.",
      "Recommended caption structure: opening line with empathy or curiosity, 2 to 4 short lines expanding the topic, a soft wrap-up line, and an optional gentle CTA such as save this, compare with your pet, remember this moment, check your daily routine, or think about your pet's usual signs.",
      "Keep CTA soft and brand-safe. Avoid empty sentimental writing, stiff marketing phrases, and overexplaining.",
      `Hashtags must always include these exact brand hashtags: ${BRAND_HASHTAGS.join(", ")}.`,
      "Also add topic-fit Japanese pet hashtags and major pet hashtags. Return 15 hashtags total when possible.",
    ].join(" "),
    user: JSON.stringify(
      {
        language: input.language,
        petType: input.petKind,
        contentPurpose: input.contentType,
        topic: input.topic,
        scenarioTitle: input.scenarioTitle,
        slides: input.slides,
        promptOverrides: input.promptOverrides ?? [],
        regenerateIndex: input.regenerateIndex,
      },
      null,
      2,
    ),
  };
}
