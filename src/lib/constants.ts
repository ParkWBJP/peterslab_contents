import type { BrandAssets, ProjectState, WizardStep } from "@/lib/types";

export const STEP_PROGRESS: Record<WizardStep, number> = {
  0: 0,
  1: 12,
  2: 24,
  3: 36,
  4: 54,
  5: 66,
  6: 78,
  7: 90,
  8: 96,
  9: 100,
};

export const STEP_SCORE: Record<WizardStep, number> = {
  0: 0,
  1: 150,
  2: 280,
  3: 400,
  4: 560,
  5: 690,
  6: 820,
  7: 920,
  8: 980,
  9: 1100,
};

export const STORAGE_KEY = "yukiharu-content-kit";

export const DEFAULT_BRAND_ASSETS: BrandAssets = {
  watermark: "/peterlab-logo.png",
  finalSlide: "/brand-slide.jpg",
};

export const DEFAULT_PROJECT_STATE: ProjectState = {
  language: null,
  activeStep: 0,
  petKind: null,
  contentType: null,
  topics: [],
  topicHistory: [],
  selectedTopicId: null,
  topicDraft: "",
  topicDescriptionDraft: "",
  scenarios: [],
  scenarioHistory: [],
  selectedScenarioId: null,
  generatedAssets: [],
  caption: "",
  hashtags: [],
  brandAssets: DEFAULT_BRAND_ASSETS,
  slideDuration: 1.5,
  video: null,
};

export const SLIDE_DURATION_OPTIONS = [1, 1.5, 2, 2.5, 3];
