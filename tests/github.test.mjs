import test from "node:test";
import assert from "node:assert/strict";

import {
  validateGitHubUsername,
  computeLanguageBreakdown,
  filterAndSortRepositories,
  extractRateLimit,
} from "../src/lib/github.ts";

test("validateGitHubUsername - accepts valid usernames", () => {
  assert.equal(validateGitHubUsername("JOD-X8").valid, true);
  assert.equal(validateGitHubUsername("octocat").valid, true);
  assert.equal(validateGitHubUsername("john-doe").valid, true);
  assert.equal(validateGitHubUsername("a").valid, true);
  assert.equal(validateGitHubUsername("developer123").valid, true);
});

test("validateGitHubUsername - rejects invalid usernames", () => {
  // Empty or whitespace
  assert.equal(validateGitHubUsername("").valid, false);
  assert.equal(validateGitHubUsername("   ").valid, false);

  // Hyphen at start or end
  assert.equal(validateGitHubUsername("-user").valid, false);
  assert.equal(validateGitHubUsername("user-").valid, false);

  // Consecutive hyphens
  assert.equal(validateGitHubUsername("user--name").valid, false);

  // Disallowed characters
  assert.equal(validateGitHubUsername("user@domain").valid, false);
  assert.equal(validateGitHubUsername("user name").valid, false);
  assert.equal(validateGitHubUsername("user.name").valid, false);
  assert.equal(validateGitHubUsername("user!").valid, false);

  // Length > 39 characters
  const tooLong = "a".repeat(40);
  assert.equal(validateGitHubUsername(tooLong).valid, false);
});

const sampleRepos = [
  {
    id: 1,
    name: "alpha-repo",
    full_name: "test/alpha-repo",
    html_url: "https://github.com/test/alpha-repo",
    description: "A great TypeScript web application",
    fork: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    pushed_at: "2024-06-01T00:00:00Z",
    homepage: null,
    size: 100,
    stargazers_count: 45,
    watchers_count: 45,
    language: "TypeScript",
    forks_count: 5,
    open_issues_count: 1,
    license: { key: "mit", name: "MIT", spdx_id: "MIT" },
    topics: ["frontend", "react"],
  },
  {
    id: 2,
    name: "beta-service",
    full_name: "test/beta-service",
    html_url: "https://github.com/test/beta-service",
    description: "Backend microservice in Python",
    fork: false,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-09-01T00:00:00Z",
    pushed_at: "2024-09-01T00:00:00Z",
    homepage: null,
    size: 200,
    stargazers_count: 120,
    watchers_count: 120,
    language: "Python",
    forks_count: 20,
    open_issues_count: 0,
    license: null,
    topics: ["backend", "api"],
  },
  {
    id: 3,
    name: "gamma-docs",
    full_name: "test/gamma-docs",
    html_url: "https://github.com/test/gamma-docs",
    description: "Documentation portal",
    fork: true,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
    pushed_at: "2024-03-01T00:00:00Z",
    homepage: null,
    size: 50,
    stargazers_count: 10,
    watchers_count: 10,
    language: "TypeScript",
    forks_count: 2,
    open_issues_count: 0,
    license: null,
    topics: [],
  },
  {
    id: 4,
    name: "delta-plain",
    full_name: "test/delta-plain",
    html_url: "https://github.com/test/delta-plain",
    description: "Plain notes without language",
    fork: false,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z",
    pushed_at: "2024-08-01T00:00:00Z",
    homepage: null,
    size: 10,
    stargazers_count: 0,
    watchers_count: 0,
    language: null,
    forks_count: 0,
    open_issues_count: 0,
    license: null,
    topics: [],
  },
];

test("computeLanguageBreakdown - calculates counts and percentages accurately", () => {
  const breakdown = computeLanguageBreakdown(sampleRepos);

  // 3 repos have language: 2 TypeScript, 1 Python (delta-plain is null)
  assert.equal(breakdown.length, 2);

  const ts = breakdown.find((b) => b.language === "TypeScript");
  const py = breakdown.find((b) => b.language === "Python");

  assert.ok(ts);
  assert.ok(py);
  assert.equal(ts.count, 2);
  assert.equal(py.count, 1);
  assert.equal(ts.percentage, 66.7);
  assert.equal(py.percentage, 33.3);
});

test("filterAndSortRepositories - filters by search term in name, description, and topics", () => {
  // Search in name
  const byName = filterAndSortRepositories(sampleRepos, { search: "alpha" });
  assert.equal(byName.length, 1);
  assert.equal(byName[0].name, "alpha-repo");

  // Search in description (case-insensitive)
  const byDesc = filterAndSortRepositories(sampleRepos, { search: "microservice" });
  assert.equal(byDesc.length, 1);
  assert.equal(byDesc[0].name, "beta-service");

  // Search in topics
  const byTopic = filterAndSortRepositories(sampleRepos, { search: "react" });
  assert.equal(byTopic.length, 1);
  assert.equal(byTopic[0].name, "alpha-repo");

  // No matches
  const noMatch = filterAndSortRepositories(sampleRepos, { search: "nonexistent-query-xyz" });
  assert.equal(noMatch.length, 0);
});

test("filterAndSortRepositories - filters by language", () => {
  const tsOnly = filterAndSortRepositories(sampleRepos, { language: "TypeScript" });
  assert.equal(tsOnly.length, 2);
  assert.ok(tsOnly.every((r) => r.language === "TypeScript"));

  const pyOnly = filterAndSortRepositories(sampleRepos, { language: "Python" });
  assert.equal(pyOnly.length, 1);
  assert.equal(pyOnly[0].name, "beta-service");

  const all = filterAndSortRepositories(sampleRepos, { language: "ALL" });
  assert.equal(all.length, sampleRepos.length);
});

test("filterAndSortRepositories - sorts by stars, updated, and name", () => {
  // Sort by stars descending
  const byStars = filterAndSortRepositories(sampleRepos, { sortBy: "stars" });
  assert.equal(byStars[0].name, "beta-service"); // 120 stars
  assert.equal(byStars[1].name, "alpha-repo");   // 45 stars
  assert.equal(byStars[2].name, "gamma-docs");   // 10 stars
  assert.equal(byStars[3].name, "delta-plain");  // 0 stars

  // Sort by updated descending
  const byUpdated = filterAndSortRepositories(sampleRepos, { sortBy: "updated" });
  assert.equal(byUpdated[0].name, "beta-service"); // 2024-09-01
  assert.equal(byUpdated[1].name, "delta-plain");  // 2024-08-01
  assert.equal(byUpdated[2].name, "alpha-repo");   // 2024-06-01
  assert.equal(byUpdated[3].name, "gamma-docs");   // 2024-03-01

  // Sort by name ascending
  const byName = filterAndSortRepositories(sampleRepos, { sortBy: "name" });
  assert.equal(byName[0].name, "alpha-repo");
  assert.equal(byName[1].name, "beta-service");
  assert.equal(byName[2].name, "delta-plain");
  assert.equal(byName[3].name, "gamma-docs");
});

test("extractRateLimit - parses headers correctly", () => {
  const headers = new Headers({
    "x-ratelimit-limit": "5000",
    "x-ratelimit-remaining": "4890",
    "x-ratelimit-reset": "1730000000",
  });

  const rate = extractRateLimit(headers);
  assert.equal(rate.limit, 5000);
  assert.equal(rate.remaining, 4890);
  assert.equal(rate.reset, 1730000000);
  assert.ok(rate.resetDate);
});
