import React from "react";
import { ArrowUpRight, FolderGit2 } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

export function ProjectsSection() {
  const projects = [
    {
      title: "Developer Portfolio & GitHub Analytics",
      status: "In Active Development",
      description:
        "A dual-purpose platform combining an engineer portfolio with a real-time public GitHub analytics explorer and longitudinal PostgreSQL metric snapshots.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL 18", "Prisma ORM", "GitHub REST API"],
      repoUrl: "https://github.com/JOD-X8",
      demoUrl: "/",
      featured: true,
    },
    {
      title: "Public GitHub Repository Explorer",
      status: "Milestone 4 Planned",
      description:
        "Interactive explorer module allowing live search, multi-criteria filtering by language, and sorting across repositories with real-time GitHub REST API integration.",
      tags: ["React 19", "GitHub REST API", "TypeScript", "Tailwind CSS", "Lucide"],
      repoUrl: "https://github.com/JOD-X8",
      demoUrl: "/explorer",
      featured: false,
    },
    {
      title: "Longitudinal Analytics & Snapshot Engine",
      status: "Milestone 5 Planned",
      description:
        "A periodic snapshot collection engine designed to track star growth, fork counts, and repository dynamics over time with deduplicated daily records in PostgreSQL.",
      tags: ["PostgreSQL 18", "Prisma", "Data Modeling", "Deduplication", "Analytics"],
      repoUrl: "https://github.com/JOD-X8",
      demoUrl: "/analytics",
      featured: false,
    },
  ];

  return (
    <section id="projects" className="py-14 sm:py-20 border-t border-[#262B27]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B7FF3C]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B7FF3C]" />
            Featured Work
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#E8ECE8] sm:text-3xl">
            Engineering projects & open source tools.
          </h2>
          <p className="mt-3 text-sm text-[#9BA39B] sm:text-base">
            Each project is built with clean architecture, verified requirements, and strict design specifications.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {projects.map((proj, idx) => (
            <article
              key={idx}
              className={`flex flex-col justify-between rounded-xl border bg-[#171A18] p-6 transition-all hover:glow-lime-sm ${
                proj.featured
                  ? "border-[#B7FF3C]/40 relative"
                  : "border-[#262B27] hover:border-[#3A423C]"
              }`}
            >
              {proj.featured && (
                <div className="absolute -top-2.5 right-4 rounded-full border border-[#B7FF3C]/40 bg-[#0B0D0C] px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#B7FF3C]">
                  Flagship
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#262B27] bg-[#0B0D0C] text-[#B7FF3C]">
                    <FolderGit2 className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-mono text-[#9BA39B] rounded bg-[#0B0D0C] px-2 py-0.5 border border-[#262B27]">
                    {proj.status}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#E8ECE8]">
                  {proj.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#9BA39B] sm:text-sm">
                  {proj.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {proj.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded bg-[#0B0D0C] px-2 py-0.5 text-[11px] font-medium text-[#E8ECE8] border border-[#262B27]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-[#262B27] pt-4">
                <a
                  href={proj.demoUrl}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B7FF3C] hover:underline"
                >
                  <span>Explore</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href={proj.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9BA39B] hover:text-[#E8ECE8]"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                  <span>GitHub</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
