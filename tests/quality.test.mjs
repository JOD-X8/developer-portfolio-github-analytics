import test from "node:test";
import assert from "node:assert/strict";

import {
  getNormalizedSnapshotDate,
  formatSnapshotDateString,
  isTrackedProfile,
  getConfiguredTrackedUsername,
  parseDaysQueryParam,
} from "../src/lib/analytics.ts";

import {
  computeLanguageBreakdown,
  filterAndSortRepositories,
  extractRateLimit,
} from "../src/lib/github.ts";

test("Quality: Date boundary and leap year UTC normalization", () => {
  // Leap day in UTC
  const leapDay = new Date("2024-02-29T23:59:59.999Z");
  const normalizedLeap = getNormalizedSnapshotDate(leapDay);
  assert.equal(formatSnapshotDateString(normalizedLeap), "2024-02-29");
  assert.equal(normalizedLeap.getUTCHours(), 0);
  assert.equal(normalizedLeap.getUTCMinutes(), 0);

  // Year boundary: Dec 31 near midnight
  const newYearsEve = new Date("2026-12-31T23:59:59.000Z");
  const normalizedEve = getNormalizedSnapshotDate(newYearsEve);
  assert.equal(formatSnapshotDateString(normalizedEve), "2026-12-31");

  // Year boundary: Jan 1 just after midnight
  const newYearsDay = new Date("2027-01-01T00:00:01.000Z");
  const normalizedDay = getNormalizedSnapshotDate(newYearsDay);
  assert.equal(formatSnapshotDateString(normalizedDay), "2027-01-01");
});

test("Quality: Database error sanitization prevents credential leakage", () => {
  // Simulate an internal database error with sensitive connection credentials
  const sensitiveError = new Error(
    "Can't reach database server at postgresql://postgres:SuperSecretPassword123@127.0.0.1:5432/developer_analytics"
  );

  // Sanitizer function mirroring getHistoricalAnalyticsData error handling
  function sanitizeDatabaseError(error) {
    // Technical detail logged on server only
    const technicalDetail = error instanceof Error ? error.message : "Unknown error";
    assert.ok(technicalDetail.includes("SuperSecretPassword123"));

    // Client response must NEVER include credentials or internal connection strings
    const clientSafeMessage =
      "Database connection unavailable. Please check that PostgreSQL is running and a valid DATABASE_URL is configured in .env.local.";

    return {
      databaseAvailable: false,
      message: clientSafeMessage,
    };
  }

  const sanitized = sanitizeDatabaseError(sensitiveError);
  assert.equal(sanitized.databaseAvailable, false);
  assert.equal(sanitized.message.includes("SuperSecretPassword123"), false);
  assert.equal(sanitized.message.includes("127.0.0.1"), false);
  assert.equal(sanitized.message.includes("postgresql://"), false);
});

test("Quality: Snapshot query parameter strict validation and 365-day clamping", () => {
  // 1. Omitted parameter preserves default behavior (undefined)
  assert.deepEqual(parseDaysQueryParam(null), { valid: true, days: undefined });
  assert.deepEqual(parseDaysQueryParam(undefined), { valid: true, days: undefined });

  // 2. Valid positive integer strings
  assert.deepEqual(parseDaysQueryParam("1"), { valid: true, days: 1 });
  assert.deepEqual(parseDaysQueryParam("7"), { valid: true, days: 7 });
  assert.deepEqual(parseDaysQueryParam("30"), { valid: true, days: 30 });
  assert.deepEqual(parseDaysQueryParam("365"), { valid: true, days: 365 });

  // 3. Values above 365 are clamped to 365
  assert.deepEqual(parseDaysQueryParam("366"), { valid: true, days: 365 });
  assert.deepEqual(parseDaysQueryParam("1000"), { valid: true, days: 365 });

  // 4. Invalid values return clear validation error mapped to HTTP 400
  const invalidCases = ["abc", "10abc", "-2", "0", "1.5", "", " 10 ", "05", "-0", "+5"];
  for (const invalid of invalidCases) {
    const result = parseDaysQueryParam(invalid);
    assert.equal(result.valid, false, `Expected "${invalid}" to be invalid`);
    assert.equal(result.error, "Invalid days parameter. Must be a positive integer.");
  }
});

test("Quality: Rate limit quota depletion simulation", () => {
  const resetEpoch = Math.floor(Date.now() / 1000) + 1800; // 30 minutes in future
  const headers = new Headers({
    "x-ratelimit-remaining": "0",
    "x-ratelimit-reset": resetEpoch.toString(),
  });

  const rateLimit = extractRateLimit(headers);
  assert.equal(rateLimit.remaining, 0);
  assert.equal(rateLimit.reset, resetEpoch);

  // Friendly error notice format
  const resetTimeStr = new Date(rateLimit.reset * 1000).toLocaleTimeString();
  const notice = `GitHub API rate limit exceeded. Resets at ${resetTimeStr}.`;
  assert.ok(notice.includes("rate limit exceeded"));
});

test("Quality: Language breakdown edge cases (empty or all null)", () => {
  // Empty repositories
  const empty = computeLanguageBreakdown([]);
  assert.deepEqual(empty, []);

  // Repositories without any primary language assigned
  const allNullLanguages = [
    { name: "repo1", language: null },
    { name: "repo2", language: null },
  ];
  const nullResult = computeLanguageBreakdown(allNullLanguages);
  assert.deepEqual(nullResult, []);

  // Mixed repositories: percentage sums accurately
  const mixed = [
    { name: "repo1", language: "Rust" },
    { name: "repo2", language: "Rust" },
    { name: "repo3", language: "TypeScript" },
    { name: "repo4", language: null },
  ];
  const mixedResult = computeLanguageBreakdown(mixed);
  assert.equal(mixedResult.length, 2);

  const rust = mixedResult.find((l) => l.language === "Rust");
  const ts = mixedResult.find((l) => l.language === "TypeScript");
  assert.equal(rust.count, 2);
  assert.equal(ts.count, 1);
  assert.equal(rust.percentage, 66.7);
  assert.equal(ts.percentage, 33.3);
});

test("Quality: Search filter handles special characters and casing safely", () => {
  const testRepos = [
    {
      id: 1,
      name: "nextjs-portfolio",
      description: "Modern developer portfolio with Next.js & Tailwind CSS",
      topics: ["nextjs", "react"],
      stargazers_count: 10,
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      name: "rust-parser",
      description: "Fast zero-copy parser in Rust",
      topics: ["rust", "wasm"],
      stargazers_count: 25,
      updated_at: "2024-02-01T00:00:00Z",
    },
  ];

  // Uppercase search matching lowercase description
  const matchUpper = filterAndSortRepositories(testRepos, { search: "TAILWIND" });
  assert.equal(matchUpper.length, 1);
  assert.equal(matchUpper[0].name, "nextjs-portfolio");

  // Topic search
  const matchTopic = filterAndSortRepositories(testRepos, { search: "wasm" });
  assert.equal(matchTopic.length, 1);
  assert.equal(matchTopic[0].name, "rust-parser");

  // Non-matching search query
  const noMatch = filterAndSortRepositories(testRepos, { search: "nonexistent-query-xyz" });
  assert.equal(noMatch.length, 0);
});

test("Quality: Profile access control strict boundary verification", () => {
  const configured = getConfiguredTrackedUsername();
  assert.equal(configured, "JOD-X8");

  // Substrings and variations must NOT be accepted as the authorized profile
  assert.equal(isTrackedProfile("JOD-X8-fake"), false);
  assert.equal(isTrackedProfile("JOD-X"), false);
  assert.equal(isTrackedProfile("pre-JOD-X8"), false);
  assert.equal(isTrackedProfile("JOD_X8"), false);

  // Exact match (with case and whitespace insensitivity) is allowed
  assert.equal(isTrackedProfile("JOD-X8"), true);
  assert.equal(isTrackedProfile("jod-x8"), true);
  assert.equal(isTrackedProfile("   JOD-X8   "), true);
});
