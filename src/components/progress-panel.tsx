"use client";

import { useEffect, useMemo, useState } from "react";

import { STEP_PROGRESS, STEP_SCORE } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import type { Language, ProjectState } from "@/lib/types";

function useAnimatedNumber(value: number) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (!diff) {
      return;
    }

    const startedAt = performance.now();
    const duration = 380;
    let frame = 0;

    const tick = (timestamp: number) => {
      const elapsed = timestamp - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [display, value]);

  return display;
}

function TrackMascot({ progress }: { progress: number }) {
  return (
    <div
      className="absolute top-1/2 z-20 -translate-y-1/2 transition-[left] duration-500 ease-out"
      style={{ left: `calc(${progress}% - 13px)` }}
    >
      <div className="relative h-7 w-7 animate-track-hop">
        <div className="absolute inset-x-[5px] bottom-0 h-4 rounded-[999px] border-2 border-[#5f4a40] bg-[#fffaf5]" />
        <div className="absolute left-[1px] top-[1px] h-3 w-3 rotate-[-14deg] rounded-tl-[8px] rounded-br-[3px] border-2 border-[#5f4a40] bg-[#fffaf5]" />
        <div className="absolute right-[1px] top-[1px] h-3 w-3 rotate-[14deg] rounded-tr-[8px] rounded-bl-[3px] border-2 border-[#5f4a40] bg-[#fffaf5]" />
        <div className="absolute left-[9px] top-[10px] h-1 w-1 rounded-full bg-[#5f4a40]" />
        <div className="absolute right-[9px] top-[10px] h-1 w-1 rounded-full bg-[#5f4a40]" />
        <div className="absolute left-1/2 top-[13px] h-[5px] w-[7px] -translate-x-1/2 rounded-full border border-[#5f4a40] bg-[#ffb2b9]" />
        <div className="absolute -right-[5px] top-[14px] h-[3px] w-4 rounded-full bg-[#ffcf7f] animate-tail-sway" />
      </div>
    </div>
  );
}

function BurstEffects({ step }: { step: number }) {
  const pieces = [
    { left: "10%", top: "4px", char: "♥", color: "#ff8ca4", delay: "0ms" },
    { left: "22%", top: "-2px", char: "✦", color: "#ffbe5f", delay: "50ms" },
    { left: "82%", top: "-4px", char: "✦", color: "#ffc76e", delay: "100ms" },
    { left: "90%", top: "6px", char: "🐾", color: "#ce8b61", delay: "150ms" },
  ];

  return (
    <div key={step} className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={`${step}-${piece.left}-${piece.char}`}
          className="absolute animate-track-burst text-[11px]"
          style={{
            left: piece.left,
            top: piece.top,
            color: piece.color,
            animationDelay: piece.delay,
          }}
        >
          {piece.char}
        </span>
      ))}
      <span className="absolute right-2 top-[-10px] animate-score-burst rounded-full bg-[#fff4ec] px-2 py-0.5 text-[10px] font-bold text-[#d47a56] shadow-[0_6px_16px_rgba(255,141,95,0.18)]">
        +10
      </span>
    </div>
  );
}

export function ProgressPanel({
  project,
  language,
}: {
  project: ProjectState;
  language: Language | null;
}) {
  const copy = getDictionary(language);
  const progress = useAnimatedNumber(STEP_PROGRESS[project.activeStep]);
  const score = useAnimatedNumber(STEP_SCORE[project.activeStep]);
  const stepEntries = useMemo(
    () =>
      Object.entries(copy.stepTitles).map(([step, label]) => ({
        step: Number(step),
        label,
      })),
    [copy.stepTitles],
  );

  return (
    <section className="rounded-[1.4rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,254,251,0.96),rgba(255,246,239,0.96))] px-3 py-3 shadow-[0_12px_34px_rgba(99,65,48,0.07)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2 text-[#8d6a59]">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
            {copy.progress}
          </span>
          <span className="text-lg font-semibold text-[#4f382c]">{progress}%</span>
          <span className="rounded-full bg-[#fff2e8] px-2 py-0.5 text-[10px] font-semibold text-[#cd7a58]">
            {copy.score} {score}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#8e6f61]">
          <span>{copy.stepTitles[project.activeStep]}</span>
          <span className="rounded-full bg-[#fff7f1] px-2 py-0.5 font-semibold">
            {project.activeStep + 1}/10
          </span>
        </div>
      </div>

      <div className="relative mt-2.5 h-9">
        <div className="absolute left-2 right-2 top-1/2 h-[5px] -translate-y-1/2 rounded-full bg-[#f4e2d6]" />
        <div
          className="absolute left-2 top-1/2 h-[5px] -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,#ff9e70,#ff8b9a,#ffca79)] transition-[width] duration-500 ease-out"
          style={{ width: `calc(${progress}% - 8px)` }}
        />
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2">
          <div className="relative h-9">
            {stepEntries.map(({ step }) => {
              const offset = (step / 9) * 100;
              const isDone = project.activeStep > step;
              const isActive = project.activeStep === step;

              return (
                <span
                  key={step}
                  className={`absolute top-1/2 flex h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[8px] font-bold transition ${
                    isActive
                      ? "border-[#ff9465] bg-white text-[#ff9465] shadow-[0_0_0_4px_rgba(255,148,101,0.16)]"
                      : isDone
                        ? "border-[#ffc5a5] bg-[#ffe4d1] text-[#c97851]"
                        : "border-[#ead8cc] bg-white text-transparent"
                  }`}
                  style={{ left: `${offset}%` }}
                >
                  {isDone ? "🐾" : "•"}
                </span>
              );
            })}
            <TrackMascot progress={progress} />
            <BurstEffects step={project.activeStep} />
          </div>
        </div>
      </div>
    </section>
  );
}
