import { DEFAULT_PROJECT_STATE } from "@/lib/constants";
import type {
  GeneratedSlideAsset,
  Language,
  ProjectState,
  ScenarioOption,
  TopicSuggestion,
} from "@/lib/types";

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function safeParseProjectState(value: string | null): ProjectState {
  if (!value) {
    return DEFAULT_PROJECT_STATE;
  }

  try {
    const parsed = JSON.parse(value) as ProjectState;
    return {
      ...DEFAULT_PROJECT_STATE,
      ...parsed,
      brandAssets: {
        ...DEFAULT_PROJECT_STATE.brandAssets,
        ...parsed.brandAssets,
        watermark: DEFAULT_PROJECT_STATE.brandAssets.watermark,
        finalSlide: DEFAULT_PROJECT_STATE.brandAssets.finalSlide,
      },
    };
  } catch {
    return DEFAULT_PROJECT_STATE;
  }
}

export function serializeProjectState(state: ProjectState) {
  const lightweightAssets = state.generatedAssets.map((asset) => ({
    ...asset,
    imageUrl: "",
    composedUrl: "",
  }));

  return JSON.stringify({
    ...state,
    generatedAssets: lightweightAssets,
    video: null,
  });
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function findSelectedTopic(state: ProjectState): TopicSuggestion | null {
  return state.topics.find((topic) => topic.id === state.selectedTopicId) ?? null;
}

export function findSelectedScenario(state: ProjectState): ScenarioOption | null {
  return state.scenarios.find((scenario) => scenario.id === state.selectedScenarioId) ?? null;
}

export function slugifyFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function normalizeHashtags(value: string) {
  return value
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => (item.startsWith("#") ? item : `#${item}`));
}

export function buildSlideAssets(
  slides: Array<{
    slideId: string;
    text: string;
    prompt: string;
    imageUrl: string;
    isFinal: boolean;
  }>,
  composedUrls: string[],
): GeneratedSlideAsset[] {
  return slides.map((slide, index) => ({
    id: createId("asset"),
    slideId: slide.slideId,
    text: slide.text,
    prompt: slide.prompt,
    imageUrl: slide.imageUrl,
    composedUrl: composedUrls[index] ?? slide.imageUrl,
    isFinal: slide.isFinal,
  }));
}

export function replaceAssetAtIndex(
  assets: GeneratedSlideAsset[],
  index: number,
  next: GeneratedSlideAsset,
) {
  return assets.map((asset, assetIndex) => (assetIndex === index ? next : asset));
}

export function scenarioToSlides(scenario: ScenarioOption) {
  return scenario.slides.map((slide) => ({ ...slide }));
}

export function buildPromptOverrides(assets: GeneratedSlideAsset[]) {
  return assets.map((asset) => asset.prompt);
}

export function getApiModeLabel(usedFallback: boolean, language: Language) {
  switch (language) {
    case "ko":
      return usedFallback ? "데모 모드" : "OpenAI 연결";
    case "en":
      return usedFallback ? "Demo mode" : "OpenAI live";
    default:
      return usedFallback ? "デモモード" : "OpenAI接続";
  }
}
