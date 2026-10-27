/**
 * GitHub API Client and Utility Functions
 *
 * Implements type definitions, input validation, repository filtering,
 * language breakdown calculations, and server-side fetch logic for GitHub REST API v3.
 */

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  topics: string[];
}

export interface LanguageStat {
  language: string;
  count: number;
  percentage: number;
  color: string;
}

export interface GitHubStatsSummary {
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  following: number;
  languages: LanguageStat[];
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  resetDate: string;
}

/**
 * Validates a GitHub username according to GitHub's naming conventions:
 * - 1 to 39 characters
 * - Alphanumeric and single hyphens
 * - Cannot begin or end with a hyphen
 * - Cannot contain consecutive hyphens
 */
export function validateGitHubUsername(username: string): { valid: boolean; error?: string } {
  if (!username || typeof username !== "string") {
    return { valid: false, error: "Username is required." };
  }

  const trimmed = username.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Username cannot be empty." };
  }

  if (trimmed.length > 39) {
    return { valid: false, error: "GitHub usernames cannot exceed 39 characters." };
  }

  if (trimmed.startsWith("-") || trimmed.endsWith("-")) {
    return { valid: false, error: "Username cannot start or end with a hyphen." };
  }

  if (trimmed.includes("--")) {
    return { valid: false, error: "Username cannot contain consecutive hyphens." };
  }

  const validPattern = /^[a-zA-Z0-9-]+$/;
  if (!validPattern.test(trimmed)) {
    return { valid: false, error: "Username can only contain alphanumeric characters and single hyphens." };
  }

  return { valid: true };
}

/**
 * Standard colors for prominent programming languages to provide consistent UI styling
 */
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Shell: "#89e051",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Dart: "#00B4AB",
  Other: "#9BA39B",
};

/**
 * Gets a consistent color hex code for a given programming language
 */
export function getLanguageColor(language: string | null): string {
  if (!language) return LANGUAGE_COLORS.Other;
  return LANGUAGE_COLORS[language] || "#B7FF3C";
}

/**
 * Computes language usage breakdown across a list of repositories
 */
export function computeLanguageBreakdown(repos: GitHubRepo[]): LanguageStat[] {
  if (!repos || repos.length === 0) {
    return [];
  }

  const counts: Record<string, number> = {};
  let totalWithLanguage = 0;

  for (const repo of repos) {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
      totalWithLanguage += 1;
    }
  }

  if (totalWithLanguage === 0) {
    return [];
  }

  const result: LanguageStat[] = Object.entries(counts).map(([lang, count]) => {
    const percentage = Math.round((count / totalWithLanguage) * 1000) / 10;
    return {
      language: lang,
      count,
      percentage,
      color: getLanguageColor(lang),
    };
  });

  // Sort descending by count, then by percentage
  return result.sort((a, b) => b.count - a.count);
}

export type SortOption = "stars" | "updated" | "name";

/**
 * Filters and sorts repositories by search query, language, and sorting criterion
 */
export function filterAndSortRepositories(
  repos: GitHubRepo[],
  options: {
    search?: string;
    language?: string;
    sortBy?: SortOption;
  }
): GitHubRepo[] {
  if (!repos) return [];

  let filtered = [...repos];

  // 1. Text Search Filter (name and description)
  if (options.search && options.search.trim().length > 0) {
    const term = options.search.trim().toLowerCase();
    filtered = filtered.filter((repo) => {
      const nameMatch = repo.name.toLowerCase().includes(term);
      const descMatch = repo.description ? repo.description.toLowerCase().includes(term) : false;
      const topicMatch = repo.topics && repo.topics.some((t) => t.toLowerCase().includes(term));
      return nameMatch || descMatch || topicMatch;
    });
  }

  // 2. Language Filter
  if (options.language && options.language !== "ALL") {
    filtered = filtered.filter((repo) => repo.language === options.language);
  }

  // 3. Sorting
  const sortBy = options.sortBy || "stars";
  filtered.sort((a, b) => {
    if (sortBy === "stars") {
      return b.stargazers_count - a.stargazers_count;
    }
    if (sortBy === "updated") {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
    if (sortBy === "name") {
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    }
    return 0;
  });

  return filtered;
}

/**
 * Extracts GitHub rate limit information from Response headers
 */
export function extractRateLimit(headers: Headers): RateLimitInfo {
  const limit = parseInt(headers.get("x-ratelimit-limit") || "60", 10);
  const remaining = parseInt(headers.get("x-ratelimit-remaining") || "60", 10);
  const resetUnix = parseInt(headers.get("x-ratelimit-reset") || "0", 10);

  const resetDate = resetUnix > 0 ? new Date(resetUnix * 1000).toISOString() : new Date().toISOString();

  return {
    limit,
    remaining,
    reset: resetUnix,
    resetDate,
  };
}

/**
 * Builds request headers for server-side GitHub API requests
 */
export function getGitHubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "DeveloperPortfolio-GitHubAnalytics",
  };

  // Optional token for higher rate limits (server-side only)
  const token = process.env.GITHUB_ACCESS_TOKEN || process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}
