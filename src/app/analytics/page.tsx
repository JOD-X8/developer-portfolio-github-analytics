import React from "react";
import Link from "next/link";
import { BarChart3, Database, ArrowLeft, Calendar, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Historical Analytics | JOD-X8",
  description: "Longitudinal GitHub statistics and snapshot analytics for JOD-X8",
};

export default function AnalyticsPage() {
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
            <BarChart3 className="h-4 w-4" />
            Historical Analytics
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#E8ECE8] sm:text-4xl">
            Longitudinal Snapshot Analytics
          </h1>
          <p className="mt-2 text-sm text-[#9BA39B] max-w-2xl">
            Verifiable star, fork, and repository trajectory captured across scheduled snapshots and persisted in PostgreSQL 18.
          </p>
        </div>

        {/* Milestone Badge */}
        <div className="inline-flex items-center gap-2 rounded-lg border border-[#B7FF3C]/30 bg-[#171A18] px-3.5 py-2 text-xs font-mono text-[#B7FF3C] self-start md:self-auto">
          <Database className="h-4 w-4" />
          <span>SCHEDULED FOR MILESTONE 5</span>
        </div>
      </div>

      {/* Architectural Overview Card */}
      <div className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B7FF3C]">
              <Database className="h-4 w-4" />
              <span>Persistence Engine</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-[#E8ECE8]">PostgreSQL 18 & Prisma</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#9BA39B]">
              Structured relational schema utilizing <code className="text-[#E8ECE8]">TrackedProfile</code> and <code className="text-[#E8ECE8]">StatsSnapshot</code> entities with cascade referential integrity.
            </p>
          </div>

          <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B7FF3C]">
              <Calendar className="h-4 w-4" />
              <span>Daily Deduplication</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-[#E8ECE8]">At Most 1 Snapshot / Day</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#9BA39B]">
              Enforced at the database level using normalized calendar date <code className="text-[#E8ECE8]">YYYY-MM-DD</code> to prevent duplicate records from multiple runs.
            </p>
          </div>

          <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B7FF3C]">
              <ShieldCheck className="h-4 w-4" />
              <span>Strict Data Integrity</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-[#E8ECE8]">Zero Past Data Fabrication</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#9BA39B]">
              Historical tracking strictly starts on the date collection begins. Uncollected past data is never backfilled or estimated.
            </p>
          </div>
        </div>

        {/* Main Placeholder Container */}
        <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#262B27] bg-[#0B0D0C] text-[#B7FF3C]">
            <BarChart3 className="h-6 w-6" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-[#E8ECE8]">
            Milestone 5: Database Schema & Snapshot Service Planned
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-[#9BA39B] sm:text-sm">
            Once Prisma migrations are executed against PostgreSQL in Milestone 5, this view will feature interactive line charts, date range filtering (7d, 30d, 90d, All), and a snapshot audit table for profile{" "}
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
              href="/explorer"
              className="rounded-lg border border-[#262B27] bg-[#0B0D0C] px-4 py-2 text-xs font-semibold text-[#E8ECE8] hover:border-[#B7FF3C]/50 transition-colors"
            >
              View GitHub Explorer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
