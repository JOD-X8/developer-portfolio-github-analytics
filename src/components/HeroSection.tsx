import React from "react";
import Link from "next/link";
import { ArrowUpRight, Compass, BarChart2 } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Subtle background glow effect (restrained) */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-[#B7FF3C]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 lg:max-w-3xl">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#262B27] bg-[#171A18] px-3.5 py-1.5 text-xs font-medium text-[#E8ECE8]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B7FF3C] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B7FF3C]" />
            </span>
            <span className="text-[#9BA39B]">Building & Engineering</span>
            <span className="text-[#262B27]">|</span>
            <span className="text-[#B7FF3C] font-mono">@JOD-X8</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-[#E8ECE8] sm:text-5xl md:text-6xl">
            Developer Portfolio &{" "}
            <span className="text-[#B7FF3C] text-glow-lime">GitHub Analytics</span>
          </h1>

          {/* Bio Description */}
          <p className="text-base leading-relaxed text-[#9BA39B] sm:text-lg">
            Hi, I’m <strong className="text-[#E8ECE8] font-semibold">JOD-X8</strong>. 
            I build modern, scalable web applications with Next.js, TypeScript, and cloud databases. 
            This platform pairs my personal portfolio with a dedicated GitHub explorer and verifiable snapshot analytics.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/explorer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#B7FF3C] px-5 py-3 text-sm font-semibold text-[#0B0D0C] transition-all hover:bg-[#a6ec31] hover:glow-lime-sm"
            >
              <Compass className="h-4 w-4" />
              <span>Explore GitHub Repos</span>
            </Link>

            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 rounded-lg border border-[#262B27] bg-[#171A18] px-5 py-3 text-sm font-semibold text-[#E8ECE8] transition-all hover:border-[#B7FF3C]/50 hover:text-[#B7FF3C]"
            >
              <BarChart2 className="h-4 w-4 text-[#B7FF3C]" />
              <span>Historical Analytics</span>
            </Link>

            <a
              href="https://github.com/JOD-X8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[#262B27] bg-[#171A18] px-5 py-3 text-sm font-semibold text-[#9BA39B] transition-all hover:border-[#3A423C] hover:text-[#E8ECE8]"
            >
              <GithubIcon className="h-4 w-4" />
              <span>GitHub Profile</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#9BA39B]" />
            </a>
          </div>

          {/* Quick Meta Highlights */}
          <div className="grid grid-cols-2 gap-4 pt-6 sm:grid-cols-3">
            <div className="rounded-lg border border-[#262B27] bg-[#171A18] p-3.5">
              <div className="text-[11px] font-medium uppercase tracking-wider text-[#9BA39B]">
                Focus Stack
              </div>
              <div className="mt-1 text-sm font-semibold text-[#E8ECE8]">
                Next.js & TypeScript
              </div>
            </div>

            <div className="rounded-lg border border-[#262B27] bg-[#171A18] p-3.5">
              <div className="text-[11px] font-medium uppercase tracking-wider text-[#9BA39B]">
                Database Target
              </div>
              <div className="mt-1 text-sm font-semibold text-[#E8ECE8]">
                PostgreSQL & Prisma
              </div>
            </div>

            <div className="col-span-2 rounded-lg border border-[#262B27] bg-[#171A18] p-3.5 sm:col-span-1">
              <div className="text-[11px] font-medium uppercase tracking-wider text-[#9BA39B]">
                Design Aesthetic
              </div>
              <div className="mt-1 text-sm font-semibold text-[#B7FF3C]">
                Neon-Lime & Dark
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
