"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Database,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  AlertCircle,
  TrendingUp,
  GitFork,
  Star,
  BookOpen,
  Info,
} from "lucide-react";
import { AnalyticsTrendChart, SnapshotPoint } from "@/components/AnalyticsTrendChart";

interface AnalyticsDataState {
  configuredUsername: string;
  isConfigured: boolean;
  trackedProfile: {
    id: string;
    username: string;
    canonicalName: string;
    profileUrl: string;
    createdAt: string;
    lastSnapshotAt: string | null;
  } | null;
  snapshots: SnapshotPoint[];
  totalSnapshots: number;
  databaseAvailable: boolean;
  message?: string;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsDataState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollecting, setIsCollecting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [selectedRange, setSelectedRange] = useState<number | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadAnalytics() {
      try {
        const query = selectedRange ? `?days=${selectedRange}` : "";
        const res = await fetch(`/api/analytics/snapshots${query}`);
        const result = (await res.json()) as AnalyticsDataState;

        if (!isMounted) return;
        setData(result);
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : "Failed to load historical analytics.";
        setData({
          configuredUsername: "JOD-X8",
          isConfigured: true,
          trackedProfile: null,
          snapshots: [],
          totalSnapshots: 0,
          databaseAvailable: false,
          message: msg,
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, [selectedRange, refreshTrigger]);

  const handleCollectSnapshot = async () => {
    setIsCollecting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/analytics/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || `Collection failed with status ${res.status}`);
      }

      setFeedback({
        type: "success",
        message: result.message || "Daily snapshot successfully recorded!",
      });
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to capture snapshot.";
      setFeedback({
        type: "error",
        message: msg,
      });
    } finally {
      setIsCollecting(false);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  const snapshots = data?.snapshots || [];
  const latestSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  const firstSnapshot = snapshots.length > 0 ? snapshots[0] : null;

  const starGrowth = latestSnapshot && firstSnapshot ? latestSnapshot.totalStars - firstSnapshot.totalStars : 0;
  const repoGrowth = latestSnapshot && firstSnapshot ? latestSnapshot.publicRepoCount - firstSnapshot.publicRepoCount : 0;
  const forkGrowth = latestSnapshot && firstSnapshot ? latestSnapshot.totalForks - firstSnapshot.totalForks : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Top Breadcrumb & Page Header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9BA39B] hover:text-[#B7FF3C] transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Portfolio Home</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-[#262B27]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B7FF3C]">
              <BarChart3 className="h-4 w-4" />
              <span>Historical Analytics</span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#E8ECE8] sm:text-4xl">
              Longitudinal PostgreSQL Snapshots
            </h1>
            <p className="mt-2 text-sm text-[#9BA39B] max-w-2xl">
              Verifiable star, fork, and repository evolution recorded in PostgreSQL 18. Strict daily deduplication prevents duplicate records on the same calendar day.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading || isCollecting}
              className="inline-flex items-center gap-2 rounded-lg border border-[#262B27] bg-[#171A18] px-3.5 py-2 text-xs font-semibold text-[#E8ECE8] hover:border-[#B7FF3C]/50 hover:text-[#B7FF3C] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-[#B7FF3C]" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleCollectSnapshot}
              disabled={isLoading || isCollecting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#B7FF3C] px-4 py-2 text-xs font-semibold text-[#0B0D0C] hover:bg-[#a6ec31] hover:glow-lime-sm transition-all disabled:opacity-50"
            >
              <PlusCircle className={`h-3.5 w-3.5 ${isCollecting ? "animate-spin" : ""}`} />
              <span>{isCollecting ? "Capturing..." : "Record Today's Snapshot"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Database Engine Architecture Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B7FF3C]">
            <Database className="h-4 w-4" />
            <span>Target Profile</span>
          </div>
          <div className="mt-2 font-mono text-base font-bold text-[#E8ECE8]">
            @{data?.configuredUsername || "JOD-X8"}
          </div>
          <p className="mt-1 text-[11px] text-[#9BA39B]">
            Restricted via <code className="text-[#B7FF3C]">GITHUB_TRACKED_USERNAME</code>
          </p>
        </div>

        <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B7FF3C]">
            <Calendar className="h-4 w-4" />
            <span>Daily Deduplication</span>
          </div>
          <div className="mt-2 font-mono text-base font-bold text-[#E8ECE8]">
            1 Snapshot / Day
          </div>
          <p className="mt-1 text-[11px] text-[#9BA39B]">
            Unique constraint on <code className="text-[#B7FF3C]">(profileId, snapshotDate)</code>
          </p>
        </div>

        <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B7FF3C]">
            <ShieldCheck className="h-4 w-4" />
            <span>Data Integrity</span>
          </div>
          <div className="mt-2 font-mono text-base font-bold text-[#E8ECE8]">
            Zero Fabrication
          </div>
          <p className="mt-1 text-[11px] text-[#9BA39B]">
            History begins exclusively from the first recorded collection
          </p>
        </div>
      </div>

      {/* User Feedback Alert */}
      {feedback && (
        <div
          role="alert"
          className={`rounded-xl border p-4 text-xs ${
            feedback.type === "success"
              ? "border-[#B7FF3C]/50 bg-[#B7FF3C]/10 text-[#E8ECE8]"
              : "border-red-500/50 bg-red-950/20 text-red-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {feedback.type === "success" ? (
                <ShieldCheck className="h-4 w-4 text-[#B7FF3C]" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="font-mono text-xs hover:underline opacity-80"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Database Connection Notice if unavailable */}
      {!isLoading && data && !data.databaseAvailable && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-5 text-xs text-amber-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-sm">PostgreSQL Setup Status:</strong>
              <p className="mt-1 leading-relaxed opacity-90">
                The database connection is awaiting local credentials. To enable real persistence:
              </p>
              <ol className="mt-2 list-decimal list-inside space-y-1 font-mono text-[11px] opacity-90">
                <li>Create a <code className="bg-black/40 px-1 py-0.5 rounded text-[#B7FF3C]">.env.local</code> file based on <code className="bg-black/40 px-1 py-0.5 rounded">.env.example</code>.</li>
                <li>Set your local password in <code className="bg-black/40 px-1 py-0.5 rounded">DATABASE_URL=&quot;postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/developer_analytics?schema=public&quot;</code>.</li>
                <li>Run <code className="bg-black/40 px-1 py-0.5 rounded text-[#B7FF3C]">npx prisma migrate dev</code> to apply the initial migration.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-8 animate-pulse text-center">
          <div className="mx-auto h-8 w-8 rounded-full bg-[#0B0D0C]" />
          <div className="mt-3 h-4 w-48 mx-auto rounded bg-[#0B0D0C]" />
          <div className="mt-2 h-3 w-64 mx-auto rounded bg-[#0B0D0C]" />
        </div>
      ) : snapshots.length > 0 ? (
        <div className="space-y-8">
          {/* Key Metrics Trend Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5">
              <div className="flex items-center justify-between text-xs text-[#9BA39B]">
                <span>Total Stars</span>
                <Star className="h-4 w-4 text-[#B7FF3C]" />
              </div>
              <div className="mt-3 font-mono text-3xl font-extrabold text-[#E8ECE8]">
                {latestSnapshot?.totalStars ?? 0}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-mono">
                <TrendingUp className="h-3 w-3 text-[#B7FF3C]" />
                <span className="text-[#B7FF3C]">+{starGrowth}</span>
                <span className="text-[#9BA39B]">since first snapshot</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5">
              <div className="flex items-center justify-between text-xs text-[#9BA39B]">
                <span>Public Repos</span>
                <BookOpen className="h-4 w-4 text-[#B7FF3C]" />
              </div>
              <div className="mt-3 font-mono text-3xl font-extrabold text-[#E8ECE8]">
                {latestSnapshot?.publicRepoCount ?? 0}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-mono">
                <span className="text-[#9BA39B]">{repoGrowth >= 0 ? `+${repoGrowth}` : repoGrowth} net change</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5">
              <div className="flex items-center justify-between text-xs text-[#9BA39B]">
                <span>Total Forks</span>
                <GitFork className="h-4 w-4 text-[#B7FF3C]" />
              </div>
              <div className="mt-3 font-mono text-3xl font-extrabold text-[#E8ECE8]">
                {latestSnapshot?.totalForks ?? 0}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-mono">
                <span className="text-[#9BA39B]">{forkGrowth >= 0 ? `+${forkGrowth}` : forkGrowth} net change</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5">
              <div className="flex items-center justify-between text-xs text-[#9BA39B]">
                <span>Recorded Days</span>
                <Calendar className="h-4 w-4 text-[#B7FF3C]" />
              </div>
              <div className="mt-3 font-mono text-3xl font-extrabold text-[#B7FF3C]">
                {snapshots.length}
              </div>
              <div className="mt-1 text-[11px] font-mono text-[#9BA39B]">
                Last: {latestSnapshot?.snapshotDate}
              </div>
            </div>
          </div>

          {/* Date Range Selector Toolbar */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-[#262B27] bg-[#171A18] p-3.5">
            <span className="text-xs font-semibold text-[#E8ECE8]">Historical Snapshot Window:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedRange(7)}
                className={`rounded-md px-3 py-1 text-xs font-mono transition-all ${
                  selectedRange === 7
                    ? "bg-[#B7FF3C] text-[#0B0D0C] font-semibold"
                    : "text-[#9BA39B] hover:text-[#E8ECE8] bg-[#0B0D0C] border border-[#262B27]"
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setSelectedRange(30)}
                className={`rounded-md px-3 py-1 text-xs font-mono transition-all ${
                  selectedRange === 30
                    ? "bg-[#B7FF3C] text-[#0B0D0C] font-semibold"
                    : "text-[#9BA39B] hover:text-[#E8ECE8] bg-[#0B0D0C] border border-[#262B27]"
                }`}
              >
                30 Days
              </button>
              <button
                type="button"
                onClick={() => setSelectedRange(undefined)}
                className={`rounded-md px-3 py-1 text-xs font-mono transition-all ${
                  selectedRange === undefined
                    ? "bg-[#B7FF3C] text-[#0B0D0C] font-semibold"
                    : "text-[#9BA39B] hover:text-[#E8ECE8] bg-[#0B0D0C] border border-[#262B27]"
                }`}
              >
                All History
              </button>
            </div>
          </div>

          {/* SVG Trend Chart */}
          <AnalyticsTrendChart snapshots={snapshots} />

          {/* Snapshot History Table */}
          <div className="rounded-xl border border-[#262B27] bg-[#171A18] overflow-hidden">
            <div className="p-5 border-b border-[#262B27]">
              <h3 className="text-sm font-semibold text-[#E8ECE8]">
                Snapshot Audit Log
              </h3>
              <p className="mt-0.5 text-xs text-[#9BA39B]">
                Timestamped daily records stored in PostgreSQL
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#262B27] bg-[#0B0D0C] text-[#9BA39B] font-mono uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Snapshot Date</th>
                    <th className="px-5 py-3">Public Repos</th>
                    <th className="px-5 py-3">Total Stars</th>
                    <th className="px-5 py-3">Total Forks</th>
                    <th className="px-5 py-3">Followers</th>
                    <th className="px-5 py-3">Captured At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262B27] font-mono text-[#E8ECE8]">
                  {[...snapshots].reverse().map((snap) => (
                    <tr key={snap.id} className="hover:bg-[#1E2320]/50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#B7FF3C]">
                        {snap.snapshotDate}
                      </td>
                      <td className="px-5 py-3.5">{snap.publicRepoCount}</td>
                      <td className="px-5 py-3.5 text-[#B7FF3C]">{snap.totalStars}</td>
                      <td className="px-5 py-3.5">{snap.totalForks}</td>
                      <td className="px-5 py-3.5">{snap.followers}</td>
                      <td className="px-5 py-3.5 text-[11px] text-[#9BA39B]">
                        {new Date(snap.capturedAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State: No Snapshots Yet */
        <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#262B27] bg-[#0B0D0C] text-[#B7FF3C]">
            <BarChart3 className="h-7 w-7" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-[#E8ECE8]">
            No Historical Snapshots Recorded Yet
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-[#9BA39B] sm:text-sm">
            In accordance with our strict data integrity principle, statistics are never retroactively generated or estimated.
            Historical tracking begins on the calendar day collection starts.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleCollectSnapshot}
              disabled={isCollecting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#B7FF3C] px-5 py-2.5 text-xs font-semibold text-[#0B0D0C] hover:bg-[#a6ec31] hover:glow-lime-sm transition-all"
            >
              <PlusCircle className={`h-4 w-4 ${isCollecting ? "animate-spin" : ""}`} />
              <span>{isCollecting ? "Recording..." : "Record First Snapshot"}</span>
            </button>

            <Link
              href="/explorer"
              className="rounded-lg border border-[#262B27] bg-[#0B0D0C] px-4 py-2.5 text-xs font-semibold text-[#E8ECE8] hover:border-[#B7FF3C]/50 transition-colors"
            >
              Explore Live Repositories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
