import React from "react";
import { Star, GitFork, AlertCircle, Scale, ExternalLink, Calendar } from "lucide-react";
import { GitHubRepo, getLanguageColor } from "@/lib/github";

interface RepoCardProps {
  repo: GitHubRepo;
}

export function RepoCard({ repo }: RepoCardProps) {
  const languageColor = getLanguageColor(repo.language);

  const formattedDate = new Date(repo.updated_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="flex flex-col justify-between rounded-xl border border-[#262B27] bg-[#171A18] p-5 transition-all hover:border-[#B7FF3C]/50 hover:glow-lime-sm">
      <div>
        {/* Repo Header */}
        <div className="flex items-start justify-between gap-3">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-mono text-base font-bold text-[#E8ECE8] hover:text-[#B7FF3C] transition-colors break-all rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7FF3C]"
          >
            <span>{repo.name}</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden="true" />
          </a>

          {repo.fork && (
            <span className="rounded bg-[#0B0D0C] px-2 py-0.5 text-[10px] font-mono text-[#9BA39B] border border-[#262B27] shrink-0">
              Fork
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-2 text-xs leading-relaxed text-[#9BA39B] line-clamp-2">
          {repo.description || "No description provided."}
        </p>

        {/* Topics / Tags */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 4).map((topic, idx) => (
              <span
                key={idx}
                className="rounded-full bg-[#0B0D0C] px-2 py-0.5 text-[10px] font-mono text-[#B7FF3C] border border-[#262B27]"
              >
                #{topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-y-2 border-t border-[#262B27] pt-3 text-xs text-[#9BA39B]">
        {/* Language Badge */}
        <div className="flex items-center gap-1.5">
          {repo.language ? (
            <>
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: languageColor }}
                aria-hidden="true"
              />
              <span className="font-medium text-[#E8ECE8]">{repo.language}</span>
            </>
          ) : (
            <span className="text-[#9BA39B]">Plain Text</span>
          )}
        </div>

        {/* Counters & Metadata */}
        <div className="flex items-center gap-3">
          {/* Stars */}
          <span className="inline-flex items-center gap-1 hover:text-[#E8ECE8]" title="Stars">
            <Star className="h-3.5 w-3.5 text-[#B7FF3C]" />
            <span className="font-mono">{repo.stargazers_count}</span>
          </span>

          {/* Forks */}
          <span className="inline-flex items-center gap-1 hover:text-[#E8ECE8]" title="Forks">
            <GitFork className="h-3.5 w-3.5" />
            <span className="font-mono">{repo.forks_count}</span>
          </span>

          {/* Open Issues */}
          {repo.open_issues_count > 0 && (
            <span className="inline-flex items-center gap-1 hover:text-[#E8ECE8]" title="Open Issues">
              <AlertCircle className="h-3.5 w-3.5" />
              <span className="font-mono">{repo.open_issues_count}</span>
            </span>
          )}

          {/* License */}
          {repo.license && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px]" title={`License: ${repo.license.name}`}>
              <Scale className="h-3 w-3" />
              <span>{repo.license.spdx_id || repo.license.key}</span>
            </span>
          )}

          {/* Updated Date */}
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-[#9BA39B]" title="Last Updated">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
