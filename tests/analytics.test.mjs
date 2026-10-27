import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeUsername,
  getNormalizedSnapshotDate,
  formatSnapshotDateString,
  getConfiguredTrackedUsername,
  isTrackedProfile,
  recordStatsSnapshot,
} from "../src/lib/analytics.ts";

test("normalizeUsername - converts to lowercase and trims whitespace", () => {
  assert.equal(normalizeUsername("JOD-X8"), "jod-x8");
  assert.equal(normalizeUsername("  JOD-X8  "), "jod-x8");
  assert.equal(normalizeUsername("OctoCat"), "octocat");
  assert.equal(normalizeUsername(""), "");
  assert.equal(normalizeUsername(null), "");
  assert.equal(normalizeUsername(undefined), "");
});

test("getNormalizedSnapshotDate - truncates time to midnight UTC (YYYY-MM-DD)", () => {
  const morning = new Date("2026-10-27T08:30:15.123Z");
  const evening = new Date("2026-10-27T22:45:59.999Z");

  const normalizedMorning = getNormalizedSnapshotDate(morning);
  const normalizedEvening = getNormalizedSnapshotDate(evening);

  assert.equal(normalizedMorning.getTime(), normalizedEvening.getTime());
  assert.equal(normalizedMorning.toISOString(), "2026-10-27T00:00:00.000Z");
  assert.equal(normalizedEvening.toISOString(), "2026-10-27T00:00:00.000Z");

  // Invalid date error check
  assert.throws(() => getNormalizedSnapshotDate(new Date("invalid-date")), {
    message: /Invalid date provided/,
  });
});

test("formatSnapshotDateString - formats correctly as YYYY-MM-DD", () => {
  const date = new Date("2026-10-27T15:20:00Z");
  assert.equal(formatSnapshotDateString(date), "2026-10-27");
});

test("isTrackedProfile - enforces access control to configured profile", () => {
  const configured = getConfiguredTrackedUsername();
  assert.equal(configured, "JOD-X8");

  // Case-insensitive match
  assert.equal(isTrackedProfile("JOD-X8"), true);
  assert.equal(isTrackedProfile("jod-x8"), true);
  assert.equal(isTrackedProfile("  JOD-X8  "), true);

  // Unauthorized profiles rejected
  assert.equal(isTrackedProfile("malicious-user"), false);
  assert.equal(isTrackedProfile("torvalds"), false);
  assert.equal(isTrackedProfile(""), false);
  assert.equal(isTrackedProfile(null), false);
});

test("recordStatsSnapshot - rejects unauthorized profiles with HTTP 403", async () => {
  const dummyProfile = {
    login: "unauthorized-user",
    name: "Unauthorized",
    avatar_url: "https://example.com/avatar.png",
    html_url: "https://github.com/unauthorized-user",
    bio: null,
    location: null,
    company: null,
    blog: null,
    public_repos: 5,
    public_gists: 0,
    followers: 1,
    following: 0,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  const dummySummary = {
    publicRepos: 5,
    totalStars: 10,
    totalForks: 2,
    followers: 1,
    following: 0,
    languages: [],
  };

  const result = await recordStatsSnapshot({
    username: "unauthorized-user",
    profile: dummyProfile,
    summary: dummySummary,
  });

  assert.equal(result.success, false);
  assert.equal(result.statusCode, 403);
  assert.equal(result.error, "UNAUTHORIZED_TRACKED_PROFILE");
});

test("recordStatsSnapshot - rejects invalid username format with HTTP 400", async () => {
  const dummyProfile = {
    login: "invalid--username",
    name: "Invalid",
    avatar_url: "https://example.com/avatar.png",
    html_url: "https://github.com/invalid--username",
    bio: null,
    location: null,
    company: null,
    blog: null,
    public_repos: 0,
    public_gists: 0,
    followers: 0,
    following: 0,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  const dummySummary = {
    publicRepos: 0,
    totalStars: 0,
    totalForks: 0,
    followers: 0,
    following: 0,
    languages: [],
  };

  const result = await recordStatsSnapshot({
    username: "invalid--username",
    profile: dummyProfile,
    summary: dummySummary,
  });

  assert.equal(result.success, false);
  assert.equal(result.statusCode, 400);
});

test("daily snapshot deduplication logic - same date updates, different dates create distinct records", () => {
  // Simulate the database unique constraint key: `${profileId}_${snapshotDate}`
  const mockDatabaseTable = new Map();

  function mockUpsertSnapshot(profileId, date, stats) {
    const normalizedDateStr = formatSnapshotDateString(date);
    const key = `${profileId}_${normalizedDateStr}`;

    const existing = mockDatabaseTable.get(key);
    if (existing) {
      // Update existing record for the same calendar date
      const updated = {
        ...existing,
        ...stats,
        capturedAt: new Date().toISOString(),
        updated: true,
      };
      mockDatabaseTable.set(key, updated);
      return { action: "updated", record: updated };
    } else {
      // Create new record
      const created = {
        id: `snap_${mockDatabaseTable.size + 1}`,
        profileId,
        snapshotDate: normalizedDateStr,
        capturedAt: new Date().toISOString(),
        ...stats,
        updated: false,
      };
      mockDatabaseTable.set(key, created);
      return { action: "created", record: created };
    }
  }

  const profileId = "profile_123";

  // First snapshot on Oct 26
  const res1 = mockUpsertSnapshot(profileId, new Date("2026-10-26T10:00:00Z"), { totalStars: 5, totalForks: 1 });
  assert.equal(res1.action, "created");
  assert.equal(mockDatabaseTable.size, 1);

  // Second snapshot on DIFFERENT date (Oct 27) -> Creates separate record
  const res2 = mockUpsertSnapshot(profileId, new Date("2026-10-27T08:00:00Z"), { totalStars: 10, totalForks: 2 });
  assert.equal(res2.action, "created");
  assert.equal(mockDatabaseTable.size, 2);

  // Third snapshot on SAME date (Oct 27, later in the day) -> Idempotently updates without duplicating!
  const res3 = mockUpsertSnapshot(profileId, new Date("2026-10-27T18:30:00Z"), { totalStars: 12, totalForks: 3 });
  assert.equal(res3.action, "updated");
  assert.equal(mockDatabaseTable.size, 2, "Table size must remain 2 (no duplicate snapshot created on the same day)");

  // Verify the updated stats on Oct 27
  const oct27Record = mockDatabaseTable.get(`${profileId}_2026-10-27`);
  assert.equal(oct27Record.totalStars, 12);
  assert.equal(oct27Record.totalForks, 3);
});
