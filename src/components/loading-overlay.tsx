"use client";

import { getDictionary } from "@/lib/i18n";
import type { Language } from "@/lib/types";

function WalkingCat({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-8 w-12 ${className}`}>
      <div className="absolute left-2 top-2 h-4 w-8 rounded-[999px] border-2 border-[#5f4a40] bg-[#fffaf5]" />
      <div className="absolute left-0 top-0 h-4 w-4 rotate-[-16deg] rounded-tl-[10px] rounded-br-[4px] border-2 border-[#5f4a40] bg-[#fffaf5]" />
      <div className="absolute left-5 top-0 h-4 w-4 rotate-[16deg] rounded-tr-[10px] rounded-bl-[4px] border-2 border-[#5f4a40] bg-[#fffaf5]" />
      <div className="absolute left-[9px] top-[11px] h-1 w-1 rounded-full bg-[#5f4a40] animate-cat-blink" />
      <div className="absolute left-[18px] top-[11px] h-1 w-1 rounded-full bg-[#5f4a40] animate-cat-blink" />
      <div className="absolute left-[13px] top-[14px] h-[5px] w-[7px] rounded-full border border-[#5f4a40] bg-[#ffb2b9]" />
      <div className="absolute right-0 top-[15px] h-[3px] w-5 rounded-full bg-[#ffcf7f] animate-tail-sway" />
    </div>
  );
}

function PawTrail() {
  return (
    <div className="pointer-events-none absolute inset-x-6 bottom-4 h-6 overflow-hidden">
      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          className="absolute bottom-0 text-[12px] text-[#d6946f] animate-paw-trail"
          style={{
            left: `${index * 20 + 10}%`,
            animationDelay: `${index * 180}ms`,
          }}
        >
          🐾
        </span>
      ))}
    </div>
  );
}

export function LoadingOverlay({
  open,
  label,
  language,
}: {
  open: boolean;
  label: string;
  language: Language | null;
}) {
  const copy = getDictionary(language);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#6d4c3d]/18 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-[1.8rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,246,239,0.98))] px-5 py-5 shadow-[0_26px_80px_rgba(97,58,41,0.18)]">
        <div className="relative mb-4 h-20 rounded-[1.4rem] border border-[#f3dfd3] bg-[linear-gradient(180deg,#fff8f2,#fff2ea)]">
          <div className="absolute inset-x-4 bottom-3 h-[6px] rounded-full bg-[#f3e2d4]" />
          <div className="absolute left-6 top-5 animate-cat-walk">
            <WalkingCat />
          </div>
          <div className="absolute left-14 top-8 animate-cat-walk-delayed opacity-80">
            <WalkingCat className="scale-[0.9]" />
          </div>
          <PawTrail />
        </div>

        <div className="space-y-2 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#c98a68]">
            {copy.loadingTitle}
          </p>
          <p className="text-base font-semibold leading-6 text-[#4f382c]">{label}</p>
          <p className="text-sm leading-6 text-[#83685b]">{copy.fixedAssetsHint}</p>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#fde7d7]">
          <div className="h-full w-2/3 animate-loading-bar rounded-full bg-[linear-gradient(90deg,#ff9a67,#ff7f90,#ffc974)]" />
        </div>
      </div>
    </div>
  );
}
