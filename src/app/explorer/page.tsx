import React from "react";
import Link from "next/link";
import { Compass, Clock, ArrowLeft, Search, Filter } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

export const metadata = {
  title: "GitHub Explorer | JOD-X8",
  description: "Public GitHub repository and profile explorer for JOD-X8",
};

export default function ExplorerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb / Back Link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9BA39B] hover:text-[#B7FF3C] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Portfolio Home</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-8 border-b border-[#262B27]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B7FF3C]">
            <Compass className="h-4 w-4" />
            GitHub Explorer
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#E8ECE8] sm:text-4xl">
            Public Repository Explorer
          </h1>
          <p className="mt-2 text-sm text-[#9BA39B] max-w-2xl">
            Live public profile lookup, repository search, language filters, and real-time metric cards powered by the GitHub REST API.
          </p>
        </div>

        {/* Milestone Badge */}
        <div className="inline-flex items-center gap-2 rounded-lg border border-[#B7FF3C]/30 bg-[#171A18] px-3.5 py-2 text-xs font-mono text-[#B7FF3C] self-start md:self-auto">
          <Clock className="h-4 w-4" />
          <span>SCHEDULED FOR MILESTONE 4</span>
        </div>
      </div>

      {/* Explorer Interface Preview / Scaffold */}
      <div className="mt-8 space-y-6">
        {/* Mock Search & Filter Bar (Disabled / Visual Preview) */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BA39B]" />
            <input
              type="text"
              disabled
              placeholder="Search repositories (Connecting in Milestone 4)..."
              className="w-full rounded-lg border border-[#262B27] bg-[#171A18] py-2.5 pl-10 pr-4 text-xs text-[#9BA39B] cursor-not-allowed"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#262B27] bg-[#171A18] px-3.5 py-2.5 text-xs text-[#9BA39B] cursor-not-allowed"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>All Languages</span>
            </button>

            <a
              href="https://github.com/JOD-X8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#262B27] bg-[#171A18] px-3.5 py-2.5 text-xs font-medium text-[#E8ECE8] hover:border-[#B7FF3C]/50 hover:text-[#B7FF3C] transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
              <span>View On GitHub</span>
            </a>
          </div>
        </div>

        {/* Informational Status Card */}
        <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#262B27] bg-[#0B0D0C] text-[#B7FF3C]">
            <Compass className="h-6 w-6" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-[#E8ECE8]">
            Milestone 4: GitHub API Integration Awaiting Launch
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-[#9BA39B] sm:text-sm">
            This module will connect directly to the official GitHub REST API (v3) to deliver live search, sorting by stars, update dates, language distribution charts, and repository metadata for profile{" "}
            <span className="font-mono text-[#B7FF3C]">JOD-X8</span>.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-lg bg-[#B7FF3C] px-4 py-2 text-xs font-semibold text-[#0B0D0C] hover:bg-[#a6ec31] transition-colors"
            >
              Return to Portfolio
            </Link>
            <Link
              href="/analytics"
              className="rounded-lg border border-[#262B27] bg-[#0B0D0C] px-4 py-2 text-xs font-semibold text-[#E8ECE8] hover:border-[#B7FF3C]/50 transition-colors"
            >
              View Analytics Roadmap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
