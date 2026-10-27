"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Star, GitFork, Users, AlertCircle } from "lucide-react";
import { GitHubProfile, GitHubStatsSummary } from "@/lib/github";
import { GithubIcon } from "@/components/icons/GithubIcon";

export function GitHubStatsLive() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [summary, setSummary] = useState<GitHubStatsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch("/api/github/profile/JOD-X8"),
          fetch("/api/github/repos/JOD-X8"),
        ]);

        const profileData = await profileRes.json();
        const reposData = await reposRes.json();

        if (!isMounted) return;

        if (profileRes.ok && profileData.profile) {
          setProfile(profileData.profile);
        } else if (!profileRes.ok) {
          throw new Error(profileData.error || "Failed to load GitHub profile.");
        }

        if (reposRes.ok && reposData.summary) {
          setSummary(reposData.summary);
        } else if (!reposRes.ok) {
          throw new Error(reposData.error || "Failed to load GitHub statistics.");
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : "Unable to load live GitHub statistics.";
        setError(msg);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-14 sm:py-20 border-t border-[#262B27]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B7FF3C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B7FF3C]" />
              Live GitHub Data
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#E8ECE8] sm:text-3xl">
              Real-Time GitHub Activity Summary
            </h2>
            <p className="mt-3 text-sm text-[#9BA39B] sm:text-base">
              Directly queried metrics from the official GitHub REST API for profile{" "}
              <strong className="text-[#E8ECE8] font-mono">@JOD-X8</strong>.
            </p>
          </div>

          {/* Live Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#B7FF3C]/40 bg-[#171A18] px-3.5 py-2 text-xs font-mono text-[#B7FF3C] self-start md:self-auto glow-lime-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B7FF3C] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B7FF3C]" />
            </span>
            <span>LIVE REST API (v3)</span>
          </div>
        </div>

        {/* Error Fallback */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/20 p-4 text-xs text-red-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <Link href="/explorer" className="underline hover:no-underline font-medium text-[#B7FF3C]">
              Open Explorer
            </Link>
          </div>
        )}

        {/* Live Metrics Cards Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Public Repositories */}
          <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5 transition-all hover:border-[#B7FF3C]/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#9BA39B]">Public Repos</span>
              <BookOpen className="h-4 w-4 text-[#B7FF3C]" />
            </div>
            <div className="mt-3">
              {isLoading ? (
                <div className="h-8 w-16 rounded bg-[#0B0D0C] animate-pulse" />
              ) : (
                <div className="font-mono text-3xl font-extrabold text-[#E8ECE8]">
                  {profile ? profile.public_repos : summary ? summary.publicRepos : 0}
                </div>
              )}
              <p className="mt-1 text-[11px] font-mono text-[#9BA39B]">
                Active public repositories
              </p>
            </div>
          </div>

          {/* Total Stars */}
          <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5 transition-all hover:border-[#B7FF3C]/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#9BA39B]">Total Stars</span>
              <Star className="h-4 w-4 text-[#B7FF3C]" />
            </div>
            <div className="mt-3">
              {isLoading ? (
                <div className="h-8 w-16 rounded bg-[#0B0D0C] animate-pulse" />
              ) : (
                <div className="font-mono text-3xl font-extrabold text-[#E8ECE8]">
                  {summary ? summary.totalStars : 0}
                </div>
              )}
              <p className="mt-1 text-[11px] font-mono text-[#9BA39B]">
                Aggregate stars across repos
              </p>
            </div>
          </div>

          {/* Total Forks */}
          <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5 transition-all hover:border-[#B7FF3C]/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#9BA39B]">Total Forks</span>
              <GitFork className="h-4 w-4 text-[#B7FF3C]" />
            </div>
            <div className="mt-3">
              {isLoading ? (
                <div className="h-8 w-16 rounded bg-[#0B0D0C] animate-pulse" />
              ) : (
                <div className="font-mono text-3xl font-extrabold text-[#E8ECE8]">
                  {summary ? summary.totalForks : 0}
                </div>
              )}
              <p className="mt-1 text-[11px] font-mono text-[#9BA39B]">
                Aggregate forks received
              </p>
            </div>
          </div>

          {/* Followers */}
          <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5 transition-all hover:border-[#B7FF3C]/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#9BA39B]">Followers</span>
              <Users className="h-4 w-4 text-[#B7FF3C]" />
            </div>
            <div className="mt-3">
              {isLoading ? (
                <div className="h-8 w-16 rounded bg-[#0B0D0C] animate-pulse" />
              ) : (
                <div className="font-mono text-3xl font-extrabold text-[#E8ECE8]">
                  {profile ? profile.followers : 0}
                </div>
              )}
              <p className="mt-1 text-[11px] font-mono text-[#9BA39B]">
                Community followers
              </p>
            </div>
          </div>
        </div>

        {/* Top Detected Languages Bar */}
        {summary && summary.languages.length > 0 && (
          <div className="mt-5 rounded-xl border border-[#262B27] bg-[#171A18] p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-semibold text-[#E8ECE8]">
                Top Primary Languages in Repositories:
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {summary.languages.slice(0, 5).map((l, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#262B27] bg-[#0B0D0C] px-2.5 py-1 text-xs"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: l.color }}
                      aria-hidden="true"
                    />
                    <span className="text-[#E8ECE8] font-medium">{l.language}</span>
                    <span className="text-[10px] font-mono text-[#9BA39B]">{l.percentage}%</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Explorer Callout Container */}
        <div className="mt-6 rounded-xl border border-[#262B27] bg-[#171A18] p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2">
                <GithubIcon className="h-5 w-5 text-[#B7FF3C]" />
                <h3 className="text-base font-bold text-[#E8ECE8]">
                  Explore JOD-X8&apos;s Public Repositories
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#9BA39B] sm:text-sm">
                Search repositories by name or description, filter by programming language, sort by stars or recent updates, and view detailed metrics in the interactive GitHub Explorer.
              </p>
            </div>

            <Link
              href="/explorer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#B7FF3C] px-5 py-2.5 text-xs font-semibold text-[#0B0D0C] hover:bg-[#a6ec31] hover:glow-lime-sm transition-all shrink-0"
            >
              <span>Launch GitHub Explorer</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
