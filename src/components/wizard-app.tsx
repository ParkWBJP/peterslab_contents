"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { LoadingOverlay } from "@/components/loading-overlay";
import { ProgressPanel } from "@/components/progress-panel";
import { renderVideoInBrowser } from "@/lib/browser-video";
import { composeSlideFrame } from "@/lib/compose";
import { DEFAULT_PROJECT_STATE, SLIDE_DURATION_OPTIONS, STORAGE_KEY } from "@/lib/constants";
import { getDictionary, languageOptions } from "@/lib/i18n";
import type {
  AssetsRequest,
  AssetsResponse,
  ContentType,
  GeneratedSlideAsset,
  Language,
  PetKind,
  ProjectState,
  RenderVideoRequest,
  ScenarioOption,
  ScenariosRequest,
  ScenariosResponse,
  TopicsRequest,
  TopicsResponse,
  WizardStep,
} from "@/lib/types";
import {
  buildPromptOverrides,
  buildSlideAssets,
  createId,
  findSelectedScenario,
  findSelectedTopic,
  getApiModeLabel,
  normalizeHashtags,
  replaceAssetAtIndex,
  safeParseProjectState,
  scenarioToSlides,
  serializeProjectState,
  slugifyFileName,
} from "@/lib/utils";

type BusyState = { label: string };

const PET_OPTIONS: PetKind[] = ["dog", "cat", "common"];
const CONTENT_OPTIONS: ContentType[] = [
  "fun",
  "info",
  "empathy",
  "health",
  "productPromo",
  "anniversary",
];

async function postJson<TResponse, TRequest>(url: string, body: TRequest) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed: ${response.status}`);
  }
  return (await response.json()) as TResponse;
}

function getActionErrorMessage(language: Language | null, type: "api" | "video") {
  if (language === "ja") {
    return type === "video"
      ? "動画の生成に失敗しました。もう一度お試しください。"
      : "AIの応答を読み込めませんでした。少しあとでもう一度お試しください。";
  }

  if (language === "en") {
    return type === "video"
      ? "Video rendering failed. Please try again."
      : "The AI response could not be loaded. Please try again in a moment.";
  }

  return type === "video"
    ? "영상 생성에 실패했습니다. 다시 시도해 주세요."
    : "AI 응답을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

function getVideoDownloadLabel(language: Language | null, mimeType: string) {
  const extension = mimeType.includes("mp4") ? "MP4" : "WEBM";

  if (language === "ja") {
    return `${extension}をダウンロード`;
  }

  if (language === "en") {
    return `Download ${extension}`;
  }

  return `${extension} 다운로드`;
}

function StepHeading({
  stepLabel,
  title,
  description,
}: {
  stepLabel: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#c48564]">
        {stepLabel}
      </p>
      <h2 className="max-w-3xl text-[1.7rem] leading-[1.08] text-[#4e3428] sm:text-[2rem]">
        {title}
      </h2>
      <p className="max-w-3xl text-sm leading-6 text-[#7a6358]">{description}</p>
    </div>
  );
}

function PillButton({
  active,
  label,
  onClick,
  disabled,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative overflow-hidden rounded-full border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(99,65,48,0.08)] active:translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? "border-[#ff9968] bg-[#ff8e61] text-white shadow-[0_12px_28px_rgba(255,142,97,0.25)]"
          : "border-[#ecd1c1] bg-white text-[#674d3e] hover:border-[#efb18e] hover:bg-[#fff8f3]"
      }`}
    >
      <span className="absolute right-3 top-2 h-1.5 w-1.5 rounded-full bg-white/60 transition group-hover:scale-125" />
      <span className="relative">{label}</span>
    </button>
  );
}

function ActionButton({
  label,
  onClick,
  variant = "primary",
  disabled,
}: {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
        variant === "primary"
          ? "bg-[#ff8d5f] text-white shadow-[0_14px_30px_rgba(255,141,95,0.24)] hover:bg-[#ff7e4a]"
          : "border border-[#e7cabc] bg-white text-[#604839] hover:border-[#d59b7a] hover:bg-[#fff9f4]"
      }`}
    >
      <span className="absolute left-3 top-2 text-[10px] text-white/60 transition group-hover:scale-125 group-hover:rotate-12">
        *
      </span>
      <span className="relative">{label}</span>
    </button>
  );
}

function StepShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[1.8rem] border border-[#f0ddd0] bg-white/88 p-4 sm:p-5 ${className}`}>
      {children}
    </div>
  );
}

function PhonePreview({
  asset,
  caption,
  hashtags,
  language,
  size = "compact",
}: {
  asset: GeneratedSlideAsset | null;
  caption: string;
  hashtags: string[];
  language: Language | null;
  size?: "compact" | "large";
}) {
  const copy = getDictionary(language);
  const shellClass =
    size === "large"
      ? "rounded-[2rem] border border-[#f0d8cf] bg-[linear-gradient(180deg,#fffefc,#fff6f0)] p-4 shadow-[0_20px_48px_rgba(97,58,41,0.14)]"
      : "rounded-[1.7rem] border border-[#f0d8cf] bg-[linear-gradient(180deg,#fffefc,#fff6f0)] p-3 shadow-[0_18px_40px_rgba(97,58,41,0.12)]";
  const phoneClass =
    size === "large"
      ? "mx-auto max-w-[360px] rounded-[2rem] border-[2px] border-[#ff6bb0] bg-white p-4"
      : "mx-auto max-w-[256px] rounded-[1.8rem] border-[2px] border-[#ff6bb0] bg-white p-3";

  return (
    <div className={shellClass}>
      <div className={phoneClass}>
        <div className="flex items-center justify-between text-[11px] text-[#5a463d]">
          <span>9:41</span>
          <span>{copy.instagramPreview}</span>
          <span>...</span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-[linear-gradient(135deg,#ffc886,#ff8f7f)]" />
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-[#3d2b23]">{copy.previewHandle}</p>
            <p className="text-[10px] text-[#9d7f70]">{copy.previewSubline}</p>
          </div>
        </div>
        <div className="mt-2.5 overflow-hidden rounded-[1rem] border border-[#eddad3] bg-[#f9efe8]">
          {asset?.composedUrl ? (
            <img src={asset.composedUrl} alt={copy.instagramPreview} className="aspect-[4/5] w-full object-cover" />
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center px-4 text-center text-sm text-[#907264]">
              {copy.previewPlaceholder}
            </div>
          )}
        </div>
        <div className="mt-2.5 flex items-center gap-3 text-[#4d372c]">
          <span>o</span>
          <span>@</span>
          <span>[]</span>
        </div>
        <div className="mt-2.5 space-y-2">
          <p className="line-clamp-4 text-[11px] leading-5 text-[#5a4338]">{caption}</p>
          <p className="line-clamp-3 text-[10px] leading-4 text-[#b06b86]">{hashtags.join(" ")}</p>
        </div>
      </div>
    </div>
  );
}

function ReviewImageCard({
  asset,
  language,
  onPromptChange,
  onRegenerate,
}: {
  asset: GeneratedSlideAsset;
  language: Language | null;
  onPromptChange: (value: string) => void;
  onRegenerate: () => void;
}) {
  const copy = getDictionary(language);

  return (
    <article className="flex h-full flex-col rounded-[1.5rem] border border-[#ead8cd] bg-white p-4">
      <div className="mt-2 flex-1 rounded-[1rem] bg-[#fff8f1] p-2.5">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#b48061]">{copy.prompt}</p>
        <textarea
          value={asset.prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          rows={11}
          disabled={asset.isFinal}
          className="min-h-[320px] w-full resize-none rounded-[0.95rem] border border-[#ecd8cb] bg-white px-3 py-2 text-sm leading-5 outline-none focus:border-[#ff9a67] disabled:bg-[#faf2eb] disabled:text-[#9c8578]"
        />
      </div>
      <div className="mt-2 flex gap-2">
        {!asset.isFinal ? <ActionButton label={copy.changeImage} onClick={onRegenerate} /> : null}
        <a
          href={asset.composedUrl}
          download={`${asset.slideId || "slide"}.png`}
          className="inline-flex items-center rounded-full border border-[#e7c8b3] bg-white px-4 py-2.5 text-sm font-semibold text-[#62493b] transition hover:-translate-y-0.5 hover:border-[#d59b7a] active:translate-y-0.5"
        >
          {copy.downloadImage}
        </a>
      </div>
    </article>
  );
}

function ReviewEditor({
  label,
  value,
  language,
  onChange,
  onCopy,
  onSave,
}: {
  label: string;
  value: string;
  language: Language | null;
  onChange: (value: string) => void;
  onCopy: () => void;
  onSave: () => void;
}) {
  const copy = getDictionary(language);

  return (
    <section className="rounded-[1.5rem] border border-[#ead8cd] bg-white p-4">
      <p className="text-sm font-semibold text-[#583f34]">{label}</p>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={9}
        className="mt-3 min-h-[220px] w-full rounded-[1rem] border border-[#ecd8cb] bg-[#fffdfa] px-4 py-3 text-sm leading-6 outline-none focus:border-[#ff9a67]"
      />
      <div className="mt-3 flex gap-2">
        <ActionButton label={copy.copyAction} variant="secondary" onClick={onCopy} />
        <ActionButton label={copy.saveAction} onClick={onSave} />
      </div>
    </section>
  );
}

export function WizardApp() {
  const [project, setProject] = useState<ProjectState>(DEFAULT_PROJECT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState<BusyState | null>(null);
  const [apiMode, setApiMode] = useState("");
  const [reviewIndex, setReviewIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setProject(safeParseProjectState(window.localStorage.getItem(STORAGE_KEY)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, serializeProjectState(project));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [hydrated, project]);

  const displayLanguage = project.language ?? "ko";
  const copy = getDictionary(displayLanguage);
  const selectedTopic = useMemo(() => findSelectedTopic(project), [project]);
  const selectedScenario = useMemo(() => findSelectedScenario(project), [project]);
  const previewAsset = project.generatedAssets[reviewIndex] ?? project.generatedAssets[0] ?? null;
  const modeLabel = apiMode || copy.mockModeLabel;

  const updateProject = (updater: (current: ProjectState) => ProjectState) => {
    setProject((current) => updater(current));
  };

  const setStep = (step: WizardStep) => updateProject((current) => ({ ...current, activeStep: step }));

  const composeAssets = async (
    slides: AssetsResponse["slides"],
    scenario: ScenarioOption,
    watermarkUrl: string,
    finalSlideUrl: string,
  ) =>
    Promise.all(
      slides.map((slide, index) =>
        composeSlideFrame({
          imageUrl: slide.isFinal ? finalSlideUrl : slide.imageUrl,
          text: scenario.slides[index]?.text ?? slide.text,
          watermarkUrl,
          isFinal: slide.isFinal,
        }),
      ),
    );

  const handleGenerateTopics = async () => {
    if (!project.language || !project.petKind || !project.contentType) return;
    setBusy({ label: copy.loadingTopics });
    setErrorMessage("");
    try {
      const response = await postJson<TopicsResponse, TopicsRequest>("/api/generate/topics", {
        language: project.language,
        petKind: project.petKind,
        contentType: project.contentType,
        avoidTitles: project.topicHistory.flat().map((topic) => topic.title),
      });
      setApiMode(getApiModeLabel(response.usedFallback, project.language));
      setReviewIndex(0);
      updateProject((current) => ({
        ...current,
        topics: response.topics,
        topicHistory: [...current.topicHistory, response.topics],
        selectedTopicId: response.topics[0]?.id ?? null,
        topicDraft: response.topics[0]?.title ?? "",
        topicDescriptionDraft: response.topics[0]?.detailedDescription ?? "",
        scenarios: [],
        selectedScenarioId: null,
        generatedAssets: [],
        caption: "",
        hashtags: [],
        video: null,
        activeStep: 2,
      }));
    } catch (error) {
      console.error(error);
      setErrorMessage(getActionErrorMessage(project.language, "api"));
    } finally {
      setBusy(null);
    }
  };

  const handleGenerateScenarios = async () => {
    if (!project.language || !project.petKind || !project.contentType || !project.topicDraft) return;
    setBusy({ label: copy.loadingScenarios });
    setErrorMessage("");
    try {
      const response = await postJson<ScenariosResponse, ScenariosRequest>("/api/generate/scenarios", {
        language: project.language,
        petKind: project.petKind,
        contentType: project.contentType,
        topic: project.topicDraft,
        topicDescription: project.topicDescriptionDraft,
        avoidScenarioTitles: project.scenarioHistory.flat().map((scenario) => scenario.title),
      });
      setApiMode(getApiModeLabel(response.usedFallback, project.language));
      updateProject((current) => ({
        ...current,
        scenarios: response.scenarios,
        scenarioHistory: [...current.scenarioHistory, response.scenarios],
        selectedScenarioId: response.scenarios[0]?.id ?? null,
        generatedAssets: [],
        video: null,
        activeStep: 4,
      }));
    } catch (error) {
      console.error(error);
      setErrorMessage(getActionErrorMessage(project.language, "api"));
    } finally {
      setBusy(null);
    }
  };

  const handleGenerateAssets = async () => {
    if (!project.language || !project.petKind || !project.contentType || !selectedScenario) return;
    setBusy({ label: copy.loadingAssets });
    setErrorMessage("");
    try {
      const response = await postJson<AssetsResponse, AssetsRequest>("/api/generate/assets", {
        language: project.language,
        petKind: project.petKind,
        contentType: project.contentType,
        topic: project.topicDraft,
        scenarioTitle: selectedScenario.title,
        slides: scenarioToSlides(selectedScenario),
        promptOverrides: project.generatedAssets.length > 0 ? buildPromptOverrides(project.generatedAssets) : undefined,
      });
      const composedUrls = await composeAssets(
        response.slides,
        selectedScenario,
        project.brandAssets.watermark,
        project.brandAssets.finalSlide,
      );
      setApiMode(getApiModeLabel(response.usedFallback, project.language));
      setReviewIndex(0);
      updateProject((current) => ({
        ...current,
        generatedAssets: buildSlideAssets(response.slides, composedUrls),
        caption: response.caption,
        hashtags: response.hashtags,
        video: null,
        activeStep: 7,
      }));
    } catch (error) {
      console.error(error);
      setErrorMessage(getActionErrorMessage(project.language, "api"));
    } finally {
      setBusy(null);
    }
  };

  const handleRegenerateSingle = async (index: number) => {
    if (!project.language || !project.petKind || !project.contentType || !selectedScenario || !project.generatedAssets[index] || project.generatedAssets[index]?.isFinal) return;
    setBusy({ label: copy.loadingAssets });
    setErrorMessage("");
    try {
      const response = await postJson<AssetsResponse, AssetsRequest>("/api/generate/assets", {
        language: project.language,
        petKind: project.petKind,
        contentType: project.contentType,
        topic: project.topicDraft,
        scenarioTitle: selectedScenario.title,
        slides: scenarioToSlides(selectedScenario),
        promptOverrides: buildPromptOverrides(project.generatedAssets),
        regenerateIndex: index,
      });
      const slide = response.slides[index];
      const composedUrl = await composeSlideFrame({
        imageUrl: slide.isFinal ? project.brandAssets.finalSlide : slide.imageUrl,
        text: selectedScenario.slides[index]?.text ?? slide.text,
        watermarkUrl: project.brandAssets.watermark,
        isFinal: slide.isFinal,
      });
      setApiMode(getApiModeLabel(response.usedFallback, project.language));
      updateProject((current) => ({
        ...current,
        generatedAssets: replaceAssetAtIndex(current.generatedAssets, index, {
          id: createId("asset"),
          slideId: slide.slideId,
          text: slide.text,
          prompt: slide.prompt,
          imageUrl: slide.imageUrl,
          composedUrl,
          isFinal: slide.isFinal,
        }),
        caption: response.caption,
        hashtags: response.hashtags,
      }));
    } catch (error) {
      console.error(error);
      setErrorMessage(getActionErrorMessage(project.language, "api"));
    } finally {
      setBusy(null);
    }
  };

  const handleRenderVideo = async () => {
    if (!project.generatedAssets.length) return;
    setBusy({ label: copy.renderingVideo });
    setErrorMessage("");
    try {
      const requestBody: RenderVideoRequest = {
        frames: project.generatedAssets.map((asset) => asset.composedUrl),
        slideDuration: project.slideDuration,
      };
      let response;

      try {
        response = await postJson<{ dataUrl: string; mimeType: string; fileName: string }, RenderVideoRequest>(
          "/api/render-video",
          requestBody,
        );
      } catch (serverError) {
        console.error(serverError);
        response = await renderVideoInBrowser(
          requestBody,
          project.topicDraft || selectedScenario?.title || "yukiharu-slideshow",
        );
      }

      updateProject((current) => ({ ...current, video: response, activeStep: 9 }));
    } catch (error) {
      console.error(error);
      setErrorMessage(getActionErrorMessage(project.language, "video"));
    } finally {
      setBusy(null);
    }
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
  };

  if (!hydrated) return <div className="min-h-screen bg-[#fff8ee]" />;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff7ea,transparent_34%),radial-gradient(circle_at_bottom_right,#ffe6ef,transparent_28%),linear-gradient(180deg,#fff8ee,#fff4ea_42%,#fdf1e6)] px-3 py-3 text-[#4a3429] sm:px-4 lg:px-5">
      <LoadingOverlay open={Boolean(busy)} label={busy?.label ?? ""} language={project.language} />
      <div className="mx-auto max-w-[1140px] space-y-3">
        <ProgressPanel project={project} language={project.language} />
        <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,248,242,0.94))] p-4 shadow-[0_22px_70px_rgba(97,58,41,0.09)] sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#c18463]">{copy.brandLabel}</p>
              <h1 className="text-[1.7rem] leading-[1.08] text-[#52362a] sm:text-[2rem]">{copy.appName}</h1>
              <p className="max-w-2xl text-sm leading-6 text-[#7b6459]">{copy.tagLine}</p>
            </div>
            {project.activeStep > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#fff4eb] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#c57e56]">{modeLabel}</span>
                <ActionButton
                  label={copy.startOver}
                  variant="secondary"
                  onClick={() => {
                    window.localStorage.removeItem(STORAGE_KEY);
                    setProject(DEFAULT_PROJECT_STATE);
                    setReviewIndex(0);
                    setApiMode("");
                    setErrorMessage("");
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className="mt-4">
            {errorMessage ? (
              <div className="mb-4 rounded-[1.2rem] border border-[#f0c8bd] bg-[#fff4ef] px-4 py-3 text-sm text-[#8a4b39] shadow-[0_10px_24px_rgba(138,75,57,0.08)]">
                {errorMessage}
              </div>
            ) : null}

            {project.activeStep === 0 ? (
              <div className="mx-auto max-w-[760px]">
                <StepShell className="bg-[linear-gradient(180deg,#fffaf4,#fff4ed)]">
                  <div className="flex flex-col items-center text-center">
                    <span className="rounded-full border border-[#eed4c2] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#b67859]">
                      {copy.step} 0
                    </span>
                    <div className="mt-3 space-y-1">
                      <h2 className="text-[1.55rem] leading-tight text-[#4d3429] sm:text-[1.75rem]">{copy.chooseLanguage}</h2>
                      <p className="text-sm leading-6 text-[#7a6358]">{copy.startDescription}</p>
                    </div>
                    <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                      {languageOptions.map((option) => (
                        <PillButton
                          key={option.value}
                          active={project.language === option.value}
                          label={option.label}
                          onClick={() =>
                            setProject((current) =>
                              current.activeStep > 0 ? current : { ...current, language: option.value },
                            )
                          }
                        />
                      ))}
                    </div>
                    <div className="mt-5">
                      <ActionButton
                        label={copy.start}
                        onClick={() =>
                          setProject((current) => (current.language ? { ...current, activeStep: 1 } : current))
                        }
                        disabled={!project.language}
                      />
                    </div>
                    <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-[#8d7061]">
                      <span className="rounded-full bg-white px-3 py-1.5">{copy.languageLocked}</span>
                      <span className="rounded-full bg-white px-3 py-1.5">{modeLabel}</span>
                    </div>
                    <details className="mt-4 w-full rounded-[1rem] border border-[#efd8ca] bg-white/80 px-4 py-3 text-left text-sm text-[#7a6258]">
                      <summary className="cursor-pointer list-none font-semibold text-[#5f4336]">{copy.fixedAssetsHint}</summary>
                      <p className="mt-2 leading-6">{copy.fixedAssetsHint}</p>
                    </details>
                  </div>
                </StepShell>
              </div>
            ) : null}

            {project.activeStep === 1 ? (
              <StepShell>
                <div className="space-y-5">
                  <StepHeading stepLabel={`${copy.step} 1`} title={copy.stepOneTitle} description={copy.stepOneDescription} />
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-[#6d5245]">{copy.choosePetKind}</p>
                    <div className="flex flex-wrap gap-2.5">
                      {PET_OPTIONS.map((pet) => (
                        <PillButton
                          key={pet}
                          active={project.petKind === pet}
                          label={copy.petKinds[pet]}
                          onClick={() =>
                            updateProject((current) => ({
                              ...current,
                              petKind: pet,
                              contentType: current.petKind === pet ? current.contentType : null,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {project.petKind ? (
                    <div className="rounded-[1.3rem] border border-[#f0dacd] bg-[#fff9f5] p-4">
                      <p className="text-sm font-semibold text-[#7b6258]">{copy.chooseContentType}</p>
                      <div className="mt-3 flex flex-wrap gap-2.5">
                        {CONTENT_OPTIONS.map((type) => (
                          <PillButton
                            key={type}
                            active={project.contentType === type}
                            label={copy.contentTypes[type]}
                            onClick={() => updateProject((current) => ({ ...current, contentType: type }))}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2.5">
                    <ActionButton label={copy.back} variant="secondary" onClick={() => setStep(0)} />
                    <ActionButton
                      label={copy.continueToTopics}
                      onClick={() => void handleGenerateTopics()}
                      disabled={!project.petKind || !project.contentType || Boolean(busy)}
                    />
                  </div>
                </div>
              </StepShell>
            ) : null}

            {project.activeStep === 2 ? (
              <StepShell>
                <div className="space-y-5">
                  <StepHeading stepLabel={`${copy.step} 2`} title={copy.topicSuggestions} description={copy.pickOneTopic} />
                  <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                    {project.topics.map((topic) => {
                      const active = project.selectedTopicId === topic.id;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() =>
                            updateProject((current) => ({
                              ...current,
                              selectedTopicId: topic.id,
                              topicDraft: topic.title,
                              topicDescriptionDraft: topic.detailedDescription,
                            }))
                          }
                          className={`rounded-[1.3rem] border p-4 text-left transition hover:-translate-y-0.5 ${
                            active
                              ? "border-[#ff9a67] bg-[#fff2e9] shadow-[0_14px_30px_rgba(255,141,95,0.14)]"
                              : "border-[#ead8cd] bg-white hover:border-[#efb18f]"
                          }`}
                        >
                          <span className="inline-flex rounded-full bg-[#fff7ef] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#c07d59]">
                            {topic.categoryTag}
                          </span>
                          <p className="mt-3 text-base font-semibold text-[#51382d]">{topic.title}</p>
                          <p className="mt-2 text-sm font-semibold text-[#c07d59]">{topic.shortTagline}</p>
                          <p className="mt-2 text-sm leading-6 text-[#7a6258]">{topic.detailedDescription}</p>
                          <div className="mt-3 space-y-2 text-[13px] leading-5 text-[#6d5448]">
                            <p>
                              <span className="font-semibold text-[#51382d]">{copy.whyInterestingLabel}: </span>
                              {topic.whyInteresting}
                            </p>
                            <p>
                              <span className="font-semibold text-[#51382d]">{copy.seasonalTrendLabel}: </span>
                              {topic.seasonalOrTrendPoint}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <ActionButton label={copy.back} variant="secondary" onClick={() => setStep(1)} />
                    <ActionButton label={copy.regenerate} variant="secondary" onClick={() => void handleGenerateTopics()} />
                    <ActionButton label={copy.confirmTopic} onClick={() => setStep(3)} disabled={!project.selectedTopicId} />
                  </div>
                </div>
              </StepShell>
            ) : null}

            {project.activeStep === 3 ? (
              <StepShell>
                <div className="space-y-5">
                  <StepHeading stepLabel={`${copy.step} 3`} title={copy.topicInputLabel} description={copy.topicDescriptionLabel} />
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[#5f4336]">{copy.topicInputLabel}</span>
                    <textarea
                      value={project.topicDraft}
                      onChange={(event) => updateProject((current) => ({ ...current, topicDraft: event.target.value }))}
                      rows={2}
                      className="w-full rounded-[1.1rem] border border-[#ecd8cb] bg-white px-4 py-3 text-base outline-none focus:border-[#ff9a67]"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[#5f4336]">{copy.topicDescriptionLabel}</span>
                    <textarea
                      value={project.topicDescriptionDraft}
                      onChange={(event) => updateProject((current) => ({ ...current, topicDescriptionDraft: event.target.value }))}
                      rows={4}
                      className="w-full rounded-[1.1rem] border border-[#ecd8cb] bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#ff9a67]"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    <ActionButton label={copy.back} variant="secondary" onClick={() => setStep(2)} />
                    <ActionButton label={copy.scenarioSuggestions} onClick={() => void handleGenerateScenarios()} disabled={!project.topicDraft.trim()} />
                  </div>
                </div>
              </StepShell>
            ) : null}

            {project.activeStep === 4 ? (
              <StepShell>
                <div className="space-y-5">
                  <StepHeading stepLabel={`${copy.step} 4`} title={copy.scenarioSuggestions} description={selectedTopic?.title ?? project.topicDraft} />
                  <div className="grid gap-3 xl:grid-cols-3">
                    {project.scenarios.map((scenario) => (
                      <article
                        key={scenario.id}
                        className={`rounded-[1.35rem] border p-4 ${
                          scenario.id === project.selectedScenarioId ? "border-[#ff9a67] bg-[#fff2e9]" : "border-[#ead8cd] bg-white"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => updateProject((current) => ({ ...current, selectedScenarioId: scenario.id }))}
                          className="w-full text-left"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-base font-semibold text-[#51382d]">{scenario.title}</p>
                            <span className="rounded-full bg-[#fff7ef] px-3 py-1 text-[11px] font-bold text-[#c07d59]">
                              {copy.hookTypes[scenario.hook]}
                            </span>
                          </div>
                          <ol className="mt-3 space-y-2">
                            {scenario.slides.map((slide, index) => (
                              <li key={slide.id} className="rounded-[0.95rem] bg-[#fffaf6] px-3 py-2 text-sm text-[#6e564b]">
                                {index + 1}. {slide.text}
                              </li>
                            ))}
                          </ol>
                        </button>
                      </article>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <ActionButton label={copy.back} variant="secondary" onClick={() => setStep(3)} />
                    <ActionButton label={copy.regenerateAll} variant="secondary" onClick={() => void handleGenerateScenarios()} />
                    <ActionButton label={copy.editScenario} variant="secondary" onClick={() => setStep(5)} disabled={!project.selectedScenarioId} />
                    <ActionButton label={copy.generateAssets} onClick={() => void handleGenerateAssets()} disabled={!project.selectedScenarioId} />
                  </div>
                </div>
              </StepShell>
            ) : null}

            {project.activeStep === 5 && selectedScenario ? (
              <StepShell>
                <div className="space-y-5">
                  <StepHeading stepLabel={`${copy.step} 5`} title={copy.editScenario} description={selectedScenario.title} />
                  <div className="grid gap-3 lg:grid-cols-2">
                    {selectedScenario.slides.map((slide, index) => (
                      <label key={slide.id} className="block space-y-2">
                        <span className="text-sm font-semibold text-[#5f4336]">{copy.scenarioInputLabel} {index + 1}</span>
                        <input
                          value={slide.text}
                          onChange={(event) =>
                            updateProject((current) => ({
                              ...current,
                              scenarios: current.scenarios.map((scenario) =>
                                scenario.id === current.selectedScenarioId
                                  ? {
                                      ...scenario,
                                      slides: scenario.slides.map((item) =>
                                        item.id === slide.id ? { ...item, text: event.target.value } : item,
                                      ),
                                    }
                                  : scenario,
                              ),
                            }))
                          }
                          className="w-full rounded-[1rem] border border-[#ecd8cb] bg-white px-4 py-3 text-sm outline-none focus:border-[#ff9a67]"
                        />
                      </label>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <ActionButton label={copy.back} variant="secondary" onClick={() => setStep(4)} />
                    <ActionButton label={copy.regenerateAll} variant="secondary" onClick={() => void handleGenerateScenarios()} />
                    <ActionButton label={copy.generateAssets} onClick={() => void handleGenerateAssets()} />
                  </div>
                </div>
              </StepShell>
            ) : null}

            {project.activeStep === 7 ? (
              <StepShell>
                <div className="space-y-5">
                  <StepHeading stepLabel={`${copy.step} 7`} title={copy.reviewAssets} description={copy.promptHint} />
                  <div className="space-y-4">
                    <div className="rounded-[1.7rem] border border-[#efd7ca] bg-[linear-gradient(180deg,#fffaf6,#fff5ee)] p-4">
                      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-stretch">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#6b5143]">
                              {reviewIndex + 1} / {project.generatedAssets.length}
                            </div>
                          </div>

                          <div className="relative flex justify-center">
                            <button
                              type="button"
                              onClick={() => setReviewIndex((current) => Math.max(0, current - 1))}
                              disabled={reviewIndex === 0}
                              className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#e6d2c6] bg-white/95 text-lg font-bold text-[#6a5142] shadow-[0_12px_24px_rgba(97,58,41,0.12)] transition hover:-translate-y-[52%] disabled:cursor-not-allowed disabled:opacity-35"
                              aria-label="previous slide"
                            >
                              ‹
                            </button>

                            <div className="mx-12">
                              <PhonePreview
                                asset={previewAsset}
                                caption={project.caption}
                                hashtags={project.hashtags}
                                language={project.language}
                                size="large"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setReviewIndex((current) =>
                                  Math.min(project.generatedAssets.length - 1, current + 1),
                                )
                              }
                              disabled={reviewIndex === project.generatedAssets.length - 1}
                              className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#e6d2c6] bg-white/95 text-lg font-bold text-[#6a5142] shadow-[0_12px_24px_rgba(97,58,41,0.12)] transition hover:-translate-y-[52%] disabled:cursor-not-allowed disabled:opacity-35"
                              aria-label="next slide"
                            >
                              ›
                            </button>
                          </div>

                          <div className="flex flex-wrap justify-center gap-2">
                            {project.generatedAssets.map((asset, index) => (
                              <button
                                key={asset.id}
                                type="button"
                                onClick={() => setReviewIndex(index)}
                                className={`h-2.5 rounded-full transition ${
                                  reviewIndex === index
                                    ? "w-8 bg-[#ff8d5f]"
                                    : "w-2.5 bg-[#e7cfc2] hover:bg-[#d9b9a5]"
                                }`}
                                aria-label={`slide-${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>

                        {previewAsset ? (
                          <ReviewImageCard
                            asset={previewAsset}
                            language={project.language}
                            onPromptChange={(value) =>
                              updateProject((current) => ({
                                ...current,
                                generatedAssets: current.generatedAssets.map((item, itemIndex) =>
                                  itemIndex === reviewIndex ? { ...item, prompt: value } : item,
                                ),
                              }))
                            }
                            onRegenerate={() => void handleRegenerateSingle(reviewIndex)}
                          />
                        ) : null}
                      </div>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2">
                      <ReviewEditor
                        label={copy.caption}
                        value={project.caption}
                          language={project.language}
                          onChange={(value) => updateProject((current) => ({ ...current, caption: value }))}
                          onCopy={() => void copyToClipboard(project.caption)}
                          onSave={() => void 0}
                        />
                        <ReviewEditor
                          label={copy.hashtags}
                          value={project.hashtags.join(" ")}
                          language={project.language}
                          onChange={(value) =>
                            updateProject((current) => ({ ...current, hashtags: normalizeHashtags(value) }))
                          }
                          onCopy={() => void copyToClipboard(project.hashtags.join(" "))}
                          onSave={() => void 0}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      <ActionButton label={copy.regenerateAll} variant="secondary" onClick={() => void handleGenerateAssets()} />
                      <ActionButton label={copy.makeVideo} onClick={() => setStep(8)} />
                    </div>
                  </div>
                </div>
              </StepShell>
            ) : null}

            {project.activeStep === 8 ? (
              <StepShell>
                <div className="space-y-5">
                  <StepHeading stepLabel={`${copy.step} 8`} title={copy.makeVideo} description={copy.slideDuration} />
                  <div className="flex flex-wrap gap-2.5">
                    {SLIDE_DURATION_OPTIONS.map((duration) => (
                      <PillButton
                        key={duration}
                        active={project.slideDuration === duration}
                        label={`${duration}s`}
                        onClick={() => updateProject((current) => ({ ...current, slideDuration: duration }))}
                      />
                    ))}
                  </div>
                  <div className="max-w-[320px]">
                    <PhonePreview asset={previewAsset} caption={project.caption} hashtags={project.hashtags} language={project.language} />
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <ActionButton label={copy.back} variant="secondary" onClick={() => setStep(7)} />
                    <ActionButton label={copy.renderVideo} onClick={() => void handleRenderVideo()} />
                  </div>
                </div>
              </StepShell>
            ) : null}

            {project.activeStep === 9 ? (
              <StepShell>
                <div className="space-y-5">
                  <StepHeading stepLabel={`${copy.step} 9`} title={copy.videoReady} description={copy.finalCongrats} />
                  {project.video ? (
                    <div className="mx-auto max-w-[420px] space-y-4">
                      <video
                        src={project.video.dataUrl}
                        controls
                        className="aspect-[4/5] w-full rounded-[1.5rem] bg-[#2f2018] shadow-[0_18px_40px_rgba(47,32,24,0.18)]"
                      />
                      <div className="flex justify-center">
                        <a
                          href={project.video.dataUrl}
                          download={project.video.fileName || `${slugifyFileName(project.topicDraft || "yukiharu")}.mp4`}
                          className="inline-flex rounded-full bg-[#ff8d5f] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(255,141,95,0.24)] transition hover:-translate-y-0.5 active:translate-y-0.5"
                        >
                          {getVideoDownloadLabel(project.language, project.video.mimeType)}
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              </StepShell>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
