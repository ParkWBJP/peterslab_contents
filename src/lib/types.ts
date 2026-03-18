export type Language = "ja" | "ko" | "en";

export type PetKind = "dog" | "cat" | "common";

export type ContentType =
  | "fun"
  | "info"
  | "empathy"
  | "health"
  | "productPromo"
  | "anniversary";

export type WizardStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type ScenarioHook = "question" | "impact" | "scrollStop";

export interface BrandAssets {
  watermark: string;
  finalSlide: string;
}

export interface TopicSuggestion {
  id: string;
  title: string;
  shortTagline: string;
  detailedDescription: string;
  whyInteresting: string;
  seasonalOrTrendPoint: string;
  categoryTag: string;
}

export interface ScenarioSlide {
  id: string;
  text: string;
}

export interface ScenarioOption {
  id: string;
  title: string;
  hook: ScenarioHook;
  slides: ScenarioSlide[];
}

export interface GeneratedSlideAsset {
  id: string;
  slideId: string;
  text: string;
  prompt: string;
  imageUrl: string;
  composedUrl: string;
  isFinal: boolean;
}

export interface RenderedVideo {
  dataUrl: string;
  mimeType: string;
  fileName: string;
}

export interface ProjectState {
  language: Language | null;
  activeStep: WizardStep;
  petKind: PetKind | null;
  contentType: ContentType | null;
  topics: TopicSuggestion[];
  topicHistory: TopicSuggestion[][];
  selectedTopicId: string | null;
  topicDraft: string;
  topicDescriptionDraft: string;
  scenarios: ScenarioOption[];
  scenarioHistory: ScenarioOption[][];
  selectedScenarioId: string | null;
  generatedAssets: GeneratedSlideAsset[];
  caption: string;
  hashtags: string[];
  brandAssets: BrandAssets;
  slideDuration: number;
  video: RenderedVideo | null;
}

export interface TopicsRequest {
  language: Language;
  petKind: PetKind;
  contentType: ContentType;
  avoidTitles?: string[];
}

export interface TopicsResponse {
  topics: TopicSuggestion[];
  usedFallback: boolean;
}

export interface ScenariosRequest {
  language: Language;
  petKind: PetKind;
  contentType: ContentType;
  topic: string;
  topicDescription?: string;
  avoidScenarioTitles?: string[];
}

export interface ScenariosResponse {
  scenarios: ScenarioOption[];
  usedFallback: boolean;
}

export interface AssetsRequest {
  language: Language;
  petKind: PetKind;
  contentType: ContentType;
  topic: string;
  scenarioTitle: string;
  slides: ScenarioSlide[];
  promptOverrides?: string[];
  regenerateIndex?: number;
}

export interface AssetsResponse {
  slides: Array<{
    slideId: string;
    text: string;
    prompt: string;
    imageUrl: string;
    isFinal: boolean;
  }>;
  caption: string;
  hashtags: string[];
  usedFallback: boolean;
}

export interface RenderVideoRequest {
  frames: string[];
  slideDuration: number;
}
