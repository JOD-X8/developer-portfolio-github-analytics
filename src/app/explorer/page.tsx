"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  Search,
  Filter,
  ArrowUpDown,
  ArrowLeft,
  RefreshCw,
  BookOpen,
  Calendar,
  MapPin,
  Building,
  Link as LinkIcon,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import {
  GitHubProfile,
  GitHubRepo,
  LanguageStat,
  RateLimitInfo,
  SortOption,
  validateGitHubUsername,
  filterAndSortRepositories,
} from "@/lib/github";
import { RepoCard } from "@/components/RepoCard";
import { LanguageBreakdownBar } from "@/components/LanguageBreakdownBar";
import { RateLimitBanner } from "@/components/RateLimitBanner";

export default function ExplorerPage() {
  const [usernameInput, setUsernameInput] = useState("JOD-X8");
  const [activeUsername, setActiveUsername] = useState("JOD-X8");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [languages, setLanguages] = useState<LanguageStat[]>([]);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("stars");

  // Fetch profile and repos for active username on mount or change
  useEffect(() => {
    let isMounted = true;

    async function loadGitHubData() {
      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch(`/api/github/profile/${encodeURIComponent(activeUsername)}`),
          fetch(`/api/github/repos/${encodeURIComponent(activeUsername)}`),
        ]);

        const profileData = await profileRes.json();
        const reposData = await reposRes.json();

        if (!isMounted) return;

        if (!profileRes.ok) {
          if (profileData.rateLimit) {
            setRateLimit(profileData.rateLimit);
          }
          throw new Error(profileData.error || `Failed to fetch profile (Status ${profileRes.status})`);
        }

        if (!reposRes.ok) {
          if (reposData.rateLimit) {
            setRateLimit(reposData.rateLimit);
          }
          throw new Error(reposData.error || `Failed to fetch repositories (Status ${reposRes.status})`);
        }

        setProfile(profileData.profile);
        setRepos(reposData.repos || []);
        setLanguages(reposData.summary?.languages || []);
        setErrorMessage(null);

        if (reposData.rateLimit) {
          setRateLimit(reposData.rateLimit);
        } else if (profileData.rateLimit) {
          setRateLimit(profileData.rateLimit);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : "An unexpected error occurred while fetching GitHub data.";
        setErrorMessage(msg);
        setProfile(null);
        setRepos([]);
        setLanguages([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadGitHubData();

    return () => {
      isMounted = false;
    };
  }, [activeUsername, refreshTrigger]);

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Handle username search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateGitHubUsername(usernameInput);

    if (!validation.valid) {
      setValidationError(validation.error || "Please enter a valid GitHub username.");
      return;
    }

    setValidationError(null);
    setSearchQuery("");
    setSelectedLanguage("ALL");
    setActiveUsername(usernameInput.trim());
  };

  // Filtered and sorted repositories
  const displayedRepos = filterAndSortRepositories(repos, {
    search: searchQuery,
    language: selectedLanguage,
    sortBy,
  });

  // Unique list of languages from the fetched repositories for the dropdown filter
  const uniqueLanguages = Array.from(
    new Set(repos.map((r) => r.language).filter(Boolean) as string[])
  ).sort();

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
              <Compass className="h-4 w-4" />
              <span>Public GitHub Explorer</span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#E8ECE8] sm:text-4xl">
              Inspect Repositories & Metrics
            </h1>
            <p className="mt-2 text-sm text-[#9BA39B] max-w-2xl">
              Live queries powered by the official GitHub REST API. Inspect any public profile, search repositories, and examine language distribution.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#262B27] bg-[#171A18] px-3.5 py-2 text-xs font-semibold text-[#E8ECE8] hover:border-[#B7FF3C]/50 hover:text-[#B7FF3C] transition-all disabled:opacity-50 self-start md:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-[#B7FF3C]" : ""}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Rate Limit Banner */}
      <RateLimitBanner rateLimit={rateLimit} />

      {/* Username Lookup Form */}
      <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-[#9BA39B]">
              @
            </span>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => {
                setUsernameInput(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Enter GitHub username (e.g. JOD-X8)..."
              className="w-full rounded-lg border border-[#262B27] bg-[#0B0D0C] py-2.5 pl-8 pr-4 font-mono text-xs text-[#E8ECE8] placeholder-[#9BA39B] focus:border-[#B7FF3C] focus:outline-none focus:glow-lime-sm"
              aria-label="GitHub username"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#B7FF3C] px-5 py-2.5 text-xs font-semibold text-[#0B0D0C] hover:bg-[#a6ec31] transition-all hover:glow-lime-sm disabled:opacity-50 shrink-0"
          >
            <Search className="h-4 w-4" />
            <span>Lookup Profile</span>
          </button>
        </form>

        {validationError && (
          <p className="mt-2.5 flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{validationError}</span>
          </p>
        )}
      </div>

      {/* Error Message Box */}
      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-950/20 p-5 text-sm text-red-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Lookup Failed:</strong> {errorMessage}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setUsernameInput("JOD-X8");
                    setActiveUsername("JOD-X8");
                  }}
                  className="text-xs font-medium text-[#B7FF3C] underline hover:no-underline"
                >
                  Reset to default profile (@JOD-X8)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Overview Card */}
      {isLoading ? (
        <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-6 animate-pulse">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-[#0B0D0C]" />
            <div className="flex-1 space-y-3 w-full">
              <div className="h-5 w-48 rounded bg-[#0B0D0C]" />
              <div className="h-4 w-32 rounded bg-[#0B0D0C]" />
              <div className="h-3 w-3/4 rounded bg-[#0B0D0C]" />
            </div>
          </div>
        </div>
      ) : profile ? (
        <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <Image
                src={profile.avatar_url}
                alt={`${profile.login}'s GitHub avatar`}
                width={80}
                height={80}
                unoptimized
                className="h-20 w-20 rounded-full border-2 border-[#B7FF3C]/50 bg-[#0B0D0C] object-cover glow-lime-sm"
              />

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-bold text-[#E8ECE8]">
                    {profile.name || profile.login}
                  </h2>
                  <span className="font-mono text-xs text-[#B7FF3C] bg-[#0B0D0C] px-2.5 py-0.5 rounded border border-[#262B27]">
                    @{profile.login}
                  </span>
                </div>

                {profile.bio && (
                  <p className="mt-2 text-xs leading-relaxed text-[#9BA39B] max-w-xl">
                    {profile.bio}
                  </p>
                )}

                {/* Metadata badges */}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#9BA39B]">
                  {profile.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#B7FF3C]" />
                      <span>{profile.location}</span>
                    </span>
                  )}
                  {profile.company && (
                    <span className="inline-flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-[#B7FF3C]" />
                      <span>{profile.company}</span>
                    </span>
                  )}
                  {profile.blog && (
                    <a
                      href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-[#B7FF3C] transition-colors"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      <span>Website</span>
                    </a>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Action & Stats Grid */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="rounded-lg border border-[#262B27] bg-[#0B0D0C] p-2.5">
                  <div className="font-mono text-base font-bold text-[#E8ECE8]">
                    {profile.public_repos}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#9BA39B]">
                    Repos
                  </div>
                </div>

                <div className="rounded-lg border border-[#262B27] bg-[#0B0D0C] p-2.5">
                  <div className="font-mono text-base font-bold text-[#E8ECE8]">
                    {profile.followers}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#9BA39B]">
                    Followers
                  </div>
                </div>

                <div className="rounded-lg border border-[#262B27] bg-[#0B0D0C] p-2.5">
                  <div className="font-mono text-base font-bold text-[#E8ECE8]">
                    {profile.following}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#9BA39B]">
                    Following
                  </div>
                </div>

                <div className="rounded-lg border border-[#262B27] bg-[#0B0D0C] p-2.5">
                  <div className="font-mono text-base font-bold text-[#E8ECE8]">
                    {profile.public_gists}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#9BA39B]">
                    Gists
                  </div>
                </div>
              </div>

              <a
                href={profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#262B27] bg-[#0B0D0C] px-4 py-2.5 text-xs font-semibold text-[#E8ECE8] hover:border-[#B7FF3C]/50 hover:text-[#B7FF3C] transition-all"
              >
                <GithubIcon className="h-4 w-4" />
                <span>View on GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      ) : null}

      {/* Language Breakdown Bar */}
      {!isLoading && languages.length > 0 && (
        <LanguageBreakdownBar
          languages={languages}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
        />
      )}

      {/* Search, Filter, and Sort Toolbar */}
      {!isLoading && profile && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-[#262B27] bg-[#171A18] p-4">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9BA39B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories by name, description, or topic..."
              className="w-full rounded-lg border border-[#262B27] bg-[#0B0D0C] py-2 pl-9 pr-4 text-xs text-[#E8ECE8] placeholder-[#9BA39B] focus:border-[#B7FF3C] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B7FF3C]"
              aria-label="Search repositories"
            />
          </div>

          {/* Controls: Language Filter & Sort */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Language Filter Dropdown */}
            <div className="flex flex-1 sm:flex-none items-center gap-1.5 rounded-lg border border-[#262B27] bg-[#0B0D0C] px-3 py-1.5 text-xs text-[#9BA39B] focus-within:border-[#B7FF3C]">
              <Filter className="h-3.5 w-3.5 text-[#B7FF3C] shrink-0" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-transparent text-[#E8ECE8] focus:outline-none cursor-pointer"
                aria-label="Filter repositories by language"
              >
                <option value="ALL" className="bg-[#171A18] text-[#E8ECE8]">
                  All Languages ({repos.length})
                </option>
                {uniqueLanguages.map((lang) => (
                  <option key={lang} value={lang} className="bg-[#171A18] text-[#E8ECE8]">
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex flex-1 sm:flex-none items-center gap-1.5 rounded-lg border border-[#262B27] bg-[#0B0D0C] px-3 py-1.5 text-xs text-[#9BA39B] focus-within:border-[#B7FF3C]">
              <ArrowUpDown className="h-3.5 w-3.5 text-[#B7FF3C] shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-transparent text-[#E8ECE8] focus:outline-none cursor-pointer"
                aria-label="Sort repositories"
              >
                <option value="stars" className="bg-[#171A18] text-[#E8ECE8]">
                  Sort by Stars
                </option>
                <option value="updated" className="bg-[#171A18] text-[#E8ECE8]">
                  Sort by Recently Updated
                </option>
                <option value="name" className="bg-[#171A18] text-[#E8ECE8]">
                  Sort by Name (A-Z)
                </option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Repositories Grid / Empty State */}
      <div>
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-sm font-semibold text-[#E8ECE8]">
            Repositories {profile ? `(${displayedRepos.length} of ${repos.length})` : ""}
          </h3>
          {(searchQuery || selectedLanguage !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedLanguage("ALL");
              }}
              className="text-xs font-mono text-[#B7FF3C] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-40 rounded-xl border border-[#262B27] bg-[#171A18] p-5 animate-pulse"
              >
                <div className="h-5 w-40 rounded bg-[#0B0D0C]" />
                <div className="mt-3 h-3 w-3/4 rounded bg-[#0B0D0C]" />
                <div className="mt-2 h-3 w-1/2 rounded bg-[#0B0D0C]" />
              </div>
            ))}
          </div>
        ) : displayedRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        ) : profile ? (
          <div className="rounded-xl border border-[#262B27] bg-[#171A18] p-10 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-[#9BA39B]" />
            <h4 className="mt-3 text-base font-semibold text-[#E8ECE8]">
              No repositories match your filter criteria
            </h4>
            <p className="mt-1 text-xs text-[#9BA39B]">
              Try clearing your search query or switching to &ldquo;All Languages&rdquo;.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLanguage("ALL");
                }}
                className="rounded-lg bg-[#B7FF3C] px-4 py-2 text-xs font-semibold text-[#0B0D0C] hover:bg-[#a6ec31]"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
