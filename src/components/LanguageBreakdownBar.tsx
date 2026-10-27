"use client";

import React from "react";
import { LanguageStat } from "@/lib/github";

interface LanguageBreakdownBarProps {
  languages: LanguageStat[];
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

export function LanguageBreakdownBar({
  languages,
  selectedLanguage,
  onSelectLanguage,
}: LanguageBreakdownBarProps) {
  if (!languages || languages.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5">
      <div className="flex items-center justify-between pb-3.5">
        <h3 className="text-sm font-semibold text-[#E8ECE8]">
          Language Distribution
        </h3>
        {selectedLanguage !== "ALL" && (
          <button
            type="button"
            onClick={() => onSelectLanguage("ALL")}
            className="text-xs font-mono text-[#B7FF3C] hover:underline"
          >
            Reset Filter ({selectedLanguage})
          </button>
        )}
      </div>

      {/* Horizontal Stacked Proportion Bar */}
      <div
        className="flex h-3 w-full overflow-hidden rounded-full bg-[#0B0D0C] border border-[#262B27]"
        role="progressbar"
        aria-label="Language distribution bar"
      >
        {languages.map((item, idx) => (
          <div
            key={idx}
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.color,
            }}
            className="h-full transition-all hover:opacity-80"
            title={`${item.language}: ${item.percentage}% (${item.count} repos)`}
          />
        ))}
      </div>

      {/* Language Pills / Interactive Legend */}
      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => onSelectLanguage("ALL")}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
            selectedLanguage === "ALL"
              ? "border border-[#B7FF3C] bg-[#B7FF3C]/10 text-[#B7FF3C] glow-lime-sm"
              : "border border-[#262B27] bg-[#0B0D0C] text-[#9BA39B] hover:border-[#3A423C] hover:text-[#E8ECE8]"
          }`}
        >
          <span>All Languages</span>
        </button>

        {languages.map((item, idx) => {
          const isSelected = selectedLanguage === item.language;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectLanguage(isSelected ? "ALL" : item.language)}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                isSelected
                  ? "border border-[#B7FF3C] bg-[#B7FF3C]/10 text-[#B7FF3C] glow-lime-sm"
                  : "border border-[#262B27] bg-[#0B0D0C] text-[#9BA39B] hover:border-[#3A423C] hover:text-[#E8ECE8]"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="font-semibold text-[#E8ECE8]">{item.language}</span>
              <span className="text-[11px] font-mono text-[#9BA39B]">
                {item.percentage}% ({item.count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
