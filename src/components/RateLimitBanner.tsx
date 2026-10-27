import React from "react";
import { AlertTriangle, Clock, ShieldCheck } from "lucide-react";
import { RateLimitInfo } from "@/lib/github";

interface RateLimitBannerProps {
  rateLimit: RateLimitInfo | null;
}

export function RateLimitBanner({ rateLimit }: RateLimitBannerProps) {
  if (!rateLimit) return null;

  const isCritical = rateLimit.remaining === 0;
  const isLow = rateLimit.remaining > 0 && rateLimit.remaining <= 10;

  if (!isCritical && !isLow) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-[#262B27] bg-[#171A18] px-3.5 py-2 text-[11px] text-[#9BA39B]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-[#B7FF3C]" />
          <span>GitHub API Quota: <strong className="text-[#E8ECE8]">{rateLimit.remaining}</strong> / {rateLimit.limit} remaining</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <Clock className="h-3 w-3" />
          <span>Resets at {new Date(rateLimit.reset * 1000).toLocaleTimeString()}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={`rounded-xl border p-4 text-xs ${
        isCritical
          ? "border-red-500/50 bg-red-950/20 text-red-200"
          : "border-amber-500/50 bg-amber-950/20 text-amber-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className={`h-5 w-5 shrink-0 ${isCritical ? "text-red-400" : "text-amber-400"}`} />
        <div className="flex-1">
          <div className="font-semibold">
            {isCritical ? "GitHub API Rate Limit Reached" : "GitHub API Quota Low"}
          </div>
          <p className="mt-1 leading-relaxed opacity-90">
            {isCritical
              ? `The public unauthenticated rate limit (60 requests/hr) is currently exhausted. Requests will resume at ${new Date(
                  rateLimit.reset * 1000
                ).toLocaleTimeString()}.`
              : `Only ${rateLimit.remaining} of ${rateLimit.limit} requests remaining before quota reset at ${new Date(
                  rateLimit.reset * 1000
                ).toLocaleTimeString()}.`}
          </p>
          <div className="mt-2 text-[11px] opacity-75">
            Tip: Setting an optional <code className="font-mono bg-black/40 px-1 py-0.5 rounded">GITHUB_ACCESS_TOKEN</code> in <code className="font-mono bg-black/40 px-1 py-0.5 rounded">.env.local</code> expands the quota to 5,000 requests per hour.
          </div>
        </div>
      </div>
    </div>
  );
}
