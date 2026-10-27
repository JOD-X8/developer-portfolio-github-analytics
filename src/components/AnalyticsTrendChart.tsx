"use client";

import React, { useState } from "react";

export interface SnapshotPoint {
  id: string;
  snapshotDate: string; // YYYY-MM-DD
  capturedAt: string;
  publicRepoCount: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
}

interface AnalyticsTrendChartProps {
  snapshots: SnapshotPoint[];
}

export function AnalyticsTrendChart({ snapshots }: AnalyticsTrendChartProps) {
  const [activeMetric, setActiveMetric] = useState<"totalStars" | "publicRepoCount" | "totalForks">("totalStars");

  if (!snapshots || snapshots.length === 0) return null;

  // Single data point case
  if (snapshots.length === 1) {
    const point = snapshots[0];
    return (
      <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-6 text-center">
        <div className="text-xs font-mono text-[#B7FF3C] uppercase tracking-wider">
          Baseline Snapshot Captured
        </div>
        <h4 className="mt-2 text-lg font-bold text-[#E8ECE8]">
          First Data Point Recorded on {point.snapshotDate}
        </h4>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#9BA39B]">
          A trendline requires at least two separate snapshot dates. More data points will appear as daily snapshots are collected.
        </p>
        <div className="mt-4 inline-flex items-center gap-6 rounded-lg border border-[#262B27] bg-[#0B0D0C] px-5 py-2.5 font-mono text-xs">
          <div>
            <span className="text-[#9BA39B]">Repos: </span>
            <strong className="text-[#E8ECE8]">{point.publicRepoCount}</strong>
          </div>
          <div>
            <span className="text-[#9BA39B]">Stars: </span>
            <strong className="text-[#B7FF3C]">{point.totalStars}</strong>
          </div>
          <div>
            <span className="text-[#9BA39B]">Forks: </span>
            <strong className="text-[#E8ECE8]">{point.totalForks}</strong>
          </div>
        </div>
      </div>
    );
  }

  // Multi-point SVG chart
  const values = snapshots.map((s) => s[activeMetric]);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const chartWidth = 700;
  const chartHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  const points = snapshots.map((s, idx) => {
    const x = paddingX + (idx / (snapshots.length - 1)) * (chartWidth - paddingX * 2);
    const normalizedY = (s[activeMetric] - minVal) / range;
    const y = chartHeight - paddingY - normalizedY * (chartHeight - paddingY * 2);
    return { x, y, date: s.snapshotDate, value: s[activeMetric] };
  });

  const pathData = points.reduce((acc, curr, idx) => {
    return `${acc} ${idx === 0 ? "M" : "L"} ${curr.x} ${curr.y}`;
  }, "");

  // Gradient area fill
  const areaPath = `${pathData} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  const metricLabels = {
    totalStars: "Total Stars",
    publicRepoCount: "Public Repositories",
    totalForks: "Total Forks",
  };

  return (
    <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5 sm:p-6">
      {/* Chart Header & Metric Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262B27]">
        <div>
          <h3 className="text-sm font-semibold text-[#E8ECE8]">
            Historical Trajectory: {metricLabels[activeMetric]}
          </h3>
          <p className="mt-0.5 text-xs text-[#9BA39B]">
            Verifiable snapshots captured across {snapshots.length} recorded dates
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center gap-1.5 rounded-lg border border-[#262B27] bg-[#0B0D0C] p-1" role="group" aria-label="Select metric to display in chart">
          <button
            type="button"
            onClick={() => setActiveMetric("totalStars")}
            aria-pressed={activeMetric === "totalStars"}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7FF3C] ${
              activeMetric === "totalStars"
                ? "bg-[#B7FF3C] text-[#0B0D0C] font-semibold"
                : "text-[#9BA39B] hover:text-[#E8ECE8]"
            }`}
          >
            Stars
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("publicRepoCount")}
            aria-pressed={activeMetric === "publicRepoCount"}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7FF3C] ${
              activeMetric === "publicRepoCount"
                ? "bg-[#B7FF3C] text-[#0B0D0C] font-semibold"
                : "text-[#9BA39B] hover:text-[#E8ECE8]"
            }`}
          >
            Repos
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("totalForks")}
            aria-pressed={activeMetric === "totalForks"}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7FF3C] ${
              activeMetric === "totalForks"
                ? "bg-[#B7FF3C] text-[#0B0D0C] font-semibold"
                : "text-[#9BA39B] hover:text-[#E8ECE8]"
            }`}
          >
            Forks
          </button>
        </div>
      </div>

      {/* Screen-reader-only accessible data summary */}
      <div className="sr-only">
        <h4>{metricLabels[activeMetric]} Trend Summary</h4>
        <p>
          Historical progression across {snapshots.length} dates from {snapshots[0].snapshotDate} ({snapshots[0][activeMetric]}) to {snapshots[snapshots.length - 1].snapshotDate} ({snapshots[snapshots.length - 1][activeMetric]}).
        </p>
        <table>
          <caption>Recorded {metricLabels[activeMetric]} points</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">{metricLabels[activeMetric]}</th>
            </tr>
          </thead>
          <tbody>
            {snapshots.map((s) => (
              <tr key={s.id}>
                <td>{s.snapshotDate}</td>
                <td>{s[activeMetric]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SVG Responsive Chart */}
      <div className="mt-4 w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[320px]"
          role="img"
          aria-label={`Trend chart for ${metricLabels[activeMetric]} across ${snapshots.length} dates from ${snapshots[0].snapshotDate} to ${snapshots[snapshots.length - 1].snapshotDate}`}
        >
          <defs>
            <linearGradient id="limeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B7FF3C" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#B7FF3C" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={chartWidth - paddingX}
            y2={paddingY}
            stroke="#262B27"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={chartHeight - paddingY}
            x2={chartWidth - paddingX}
            y2={chartHeight - paddingY}
            stroke="#262B27"
          />

          {/* Y-axis labels */}
          <text x={paddingX - 8} y={paddingY + 4} fill="#9BA39B" fontSize="10" textAnchor="end" fontFamily="monospace">
            {maxVal}
          </text>
          <text x={paddingX - 8} y={chartHeight - paddingY + 3} fill="#9BA39B" fontSize="10" textAnchor="end" fontFamily="monospace">
            {minVal}
          </text>

          {/* Filled Area */}
          <path d={areaPath} fill="url(#limeGradient)" />

          {/* Trend Line */}
          <path d={pathData} fill="none" stroke="#B7FF3C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((p, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#0B0D0C"
                stroke="#B7FF3C"
                strokeWidth="2"
                className="transition-all hover:r-6 hover:fill-[#B7FF3C]"
              />
              <title>{`${p.date}: ${p.value} ${metricLabels[activeMetric]}`}</title>
            </g>
          ))}

          {/* X-axis date labels */}
          <text x={points[0].x} y={chartHeight - 8} fill="#9BA39B" fontSize="10" textAnchor="start" fontFamily="monospace">
            {points[0].date}
          </text>
          <text x={points[points.length - 1].x} y={chartHeight - 8} fill="#9BA39B" fontSize="10" textAnchor="end" fontFamily="monospace">
            {points[points.length - 1].date}
          </text>
        </svg>
      </div>
    </div>
  );
}
