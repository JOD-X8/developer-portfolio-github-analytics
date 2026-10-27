import React from "react";
import Link from "next/link";
import { Clock, ArrowRight, GitFork, Star, BookOpen, Users } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

export function GitHubStatsPlaceholder() {
  return (
    <section className="py-14 sm:py-20 border-t border-[#262B27]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B7FF3C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B7FF3C]" />
              Live GitHub Statistics
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#E8ECE8] sm:text-3xl">
              Public Profile & Repository Metrics
            </h2>
            <p className="mt-3 text-sm text-[#9BA39B] sm:text-base">
              Real-time activity counters directly queried from the official GitHub REST API.
            </p>
          </div>

          {/* Pending Integration Notice Badge */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#B7FF3C]/30 bg-[#171A18] px-3.5 py-2 text-xs font-mono text-[#B7FF3C] self-start md:self-auto">
            <Clock className="h-4 w-4" />
            <span>AWAITING INTEGRATION (MILESTONE 4)</span>
          </div>
        </div>

        {/* Placeholder Metrics Cards Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#9BA39B]">Public Repos</span>
              <BookOpen className="h-4 w-4 text-[#9BA39B]" />
            </div>
            <div className="mt-3">
              <div className="h-8 w-20 rounded bg-[#0B0D0C] animate-pulse" />
              <p className="mt-2 text-[11px] font-mono text-[#9BA39B]">
                Connecting in Milestone 4
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#9BA39B]">Total Stars</span>
              <Star className="h-4 w-4 text-[#9BA39B]" />
            </div>
            <div className="mt-3">
              <div className="h-8 w-20 rounded bg-[#0B0D0C] animate-pulse" />
              <p className="mt-2 text-[11px] font-mono text-[#9BA39B]">
                Connecting in Milestone 4
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#9BA39B]">Total Forks</span>
              <GitFork className="h-4 w-4 text-[#9BA39B]" />
            </div>
            <div className="mt-3">
              <div className="h-8 w-20 rounded bg-[#0B0D0C] animate-pulse" />
              <p className="mt-2 text-[11px] font-mono text-[#9BA39B]">
                Connecting in Milestone 4
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#9BA39B]">Followers</span>
              <Users className="h-4 w-4 text-[#9BA39B]" />
            </div>
            <div className="mt-3">
              <div className="h-8 w-20 rounded bg-[#0B0D0C] animate-pulse" />
              <p className="mt-2 text-[11px] font-mono text-[#9BA39B]">
                Connecting in Milestone 4
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Placeholder Container */}
        <div className="mt-6 rounded-xl border border-[#262B27] bg-[#171A18] p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2">
                <GithubIcon className="h-5 w-5 text-[#B7FF3C]" />
                <h3 className="text-base font-bold text-[#E8ECE8]">
                  Verified GitHub REST API Connection
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#9BA39B] sm:text-sm">
                Per the project integrity rule, statistics are never fabricated. Live data for{" "}
                <span className="font-mono text-[#E8ECE8]">https://github.com/JOD-X8</span> will replace this placeholder during{" "}
                <strong className="text-[#B7FF3C]">Milestone 4</strong>, including repository search, language breakdowns, and star metrics.
              </p>
            </div>

            <Link
              href="/explorer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#262B27] bg-[#0B0D0C] px-4 py-2.5 text-xs font-semibold text-[#E8ECE8] hover:border-[#B7FF3C]/50 hover:text-[#B7FF3C] transition-all"
            >
              <span>Preview GitHub Explorer Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
