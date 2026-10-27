import React from "react";
import Link from "next/link";
import { BarChart3, Database, ArrowRight, Calendar, LineChart } from "lucide-react";

export function HistoricalAnalyticsPreview() {
  return (
    <section className="py-14 sm:py-20 border-t border-[#262B27]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B7FF3C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B7FF3C]" />
              Historical Analytics
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#E8ECE8] sm:text-3xl">
              PostgreSQL Snapshot Trends
            </h2>
            <p className="mt-3 text-sm text-[#9BA39B] sm:text-base">
              Verifiable star, fork, and repository trajectory tracked across scheduled snapshots.
            </p>
          </div>

          {/* Pending Integration Notice Badge */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#B7FF3C]/30 bg-[#171A18] px-3.5 py-2 text-xs font-mono text-[#B7FF3C] self-start md:self-auto">
            <Database className="h-4 w-4" />
            <span>AWAITING INTEGRATION (MILESTONE 5)</span>
          </div>
        </div>

        {/* Analytics Card Mockup / Skeleton Panel */}
        <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#262B27]">
            <div>
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-[#B7FF3C]" />
                <h3 className="text-base font-bold text-[#E8ECE8]">
                  Longitudinal Metric Snapshot Engine
                </h3>
              </div>
              <p className="mt-1 text-xs text-[#9BA39B] sm:text-sm">
                Target Profile: <span className="font-mono text-[#E8ECE8]">JOD-X8</span> | Engine: PostgreSQL 18.6 + Prisma ORM
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#9BA39B] bg-[#0B0D0C] px-3 py-1.5 rounded-lg border border-[#262B27]">
              <Calendar className="h-3.5 w-3.5 text-[#B7FF3C]" />
              <span>Deduplication: 1 snapshot / profile / day (YYYY-MM-DD)</span>
            </div>
          </div>

          {/* Simulated Chart Placeholder */}
          <div className="mt-6 rounded-lg border border-[#262B27] bg-[#0B0D0C] p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#262B27] bg-[#171A18] text-[#B7FF3C]">
              <BarChart3 className="h-6 w-6" />
            </div>

            <h4 className="mt-3 text-sm font-semibold text-[#E8ECE8]">
              Historical Tracking Begins At First Collection
            </h4>

            <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-[#9BA39B]">
              In accordance with our strict data integrity specification, past statistics will never be fabricated or backfilled. 
              Once the PostgreSQL database and snapshot cron/API route are implemented in <strong>Milestone 5</strong>, verifiable metrics will record daily snapshots.
            </p>

            <div className="mt-6 inline-flex">
              <Link
                href="/analytics"
                className="inline-flex items-center gap-2 rounded-lg border border-[#262B27] bg-[#171A18] px-4 py-2 text-xs font-semibold text-[#E8ECE8] hover:border-[#B7FF3C]/50 hover:text-[#B7FF3C] transition-all"
              >
                <span>View Analytics Architecture Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
