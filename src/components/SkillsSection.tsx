import React from "react";
import { Terminal, Layers, Server, Wrench } from "lucide-react";

export function SkillsSection() {
  const skillCategories = [
    {
      title: "Core Languages",
      icon: <Terminal className="h-4 w-4 text-[#B7FF3C]" />,
      skills: ["TypeScript", "JavaScript (ESNext)", "SQL", "HTML5", "CSS3 / Modern CSS"],
    },
    {
      title: "Frontend & UI",
      icon: <Layers className="h-4 w-4 text-[#B7FF3C]" />,
      skills: ["Next.js (App Router)", "React 19", "Tailwind CSS", "Responsive Design", "Accessible UI (WCAG)"],
    },
    {
      title: "Backend & Persistence",
      icon: <Server className="h-4 w-4 text-[#B7FF3C]" />,
      skills: ["PostgreSQL 18", "Prisma ORM", "REST API Design", "Server Components", "Data Modeling"],
    },
    {
      title: "DevOps & Tooling",
      icon: <Wrench className="h-4 w-4 text-[#B7FF3C]" />,
      skills: ["Git & GitHub", "Vercel Deployment", "ESLint & TypeScript Tooling", "PowerShell", "VS Code"],
    },
  ];

  return (
    <section id="skills" className="py-14 sm:py-20 border-t border-[#262B27]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B7FF3C]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B7FF3C]" />
            Technical Proficiency
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#E8ECE8] sm:text-3xl">
            Modern toolchain built for reliability and scale.
          </h2>
          <p className="mt-3 text-sm text-[#9BA39B] sm:text-base">
            Categorized skills across the full application lifecycle. No arbitrary progress percentages—just practical, production-ready competencies.
          </p>
        </div>

        {/* Skill Matrix Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-xl border border-[#262B27] bg-[#171A18] p-5 transition-all hover:border-[#B7FF3C]/30"
            >
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#262B27]">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#262B27] bg-[#0B0D0C]">
                  {category.icon}
                </div>
                <h3 className="text-sm font-semibold text-[#E8ECE8]">
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                {category.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center rounded-md border border-[#262B27] bg-[#0B0D0C] px-2.5 py-1 text-xs font-medium text-[#E8ECE8] hover:border-[#B7FF3C]/40 hover:text-[#B7FF3C] transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
