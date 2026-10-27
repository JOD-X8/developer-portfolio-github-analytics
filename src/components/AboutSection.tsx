import React from "react";
import { Code2, Database, ShieldCheck, Zap } from "lucide-react";

export function AboutSection() {
  const principles = [
    {
      icon: <Code2 className="h-5 w-5 text-[#B7FF3C]" />,
      title: "Clean, Strict Architecture",
      description:
        "Building maintainable applications with strict TypeScript typing, reusable React components, and scalable directory conventions.",
    },
    {
      icon: <Database className="h-5 w-5 text-[#B7FF3C]" />,
      title: "Verifiable Data Persistence",
      description:
        "Dedicated to data integrity. In analytics tracking, historical statistics begin at collection and are never retrospectively fabricated.",
    },
    {
      icon: <Zap className="h-5 w-5 text-[#B7FF3C]" />,
      title: "Performance & Responsiveness",
      description:
        "Zero layout shifts with dedicated skeleton loaders, fast server-rendered components, and mobile-first fluid responsive layouts.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-[#B7FF3C]" />,
      title: "Accessibility & Security First",
      description:
        "High-contrast dark theme exceeding WCAG AA standards, semantic HTML, and zero secret leakage to client bundles.",
    },
  ];

  return (
    <section id="about" className="py-14 sm:py-20 border-t border-[#262B27]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B7FF3C]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B7FF3C]" />
            About Me
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#E8ECE8] sm:text-3xl">
            Engineering with focus, precision, and verifiable metrics.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#9BA39B] sm:text-base">
            I am a software engineer focused on modern web platforms, API integrations, and developer tooling. 
            I prioritize clarity in implementation, high-performance user interfaces, and verifiable data integrity over arbitrary claims.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((item, index) => (
            <div
              key={index}
              className="group rounded-xl border border-[#262B27] bg-[#171A18] p-5 transition-all hover:border-[#B7FF3C]/40 hover:glow-lime-sm"
            >
              <div className="mb-3.5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#262B27] bg-[#0B0D0C] group-hover:border-[#B7FF3C]/30 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-base font-semibold text-[#E8ECE8] group-hover:text-[#B7FF3C] transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#9BA39B] sm:text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
