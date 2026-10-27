/**
 * Historical Analytics Business Logic & Prisma Integration
 *
 * Enforces:
 * - Username normalization
 * - Daily UTC calendar date normalization (YYYY-MM-DD)
 * - Safe snapshot upserting to prevent duplicates
 * - Access control: only the configured profile (GITHUB_TRACKED_USERNAME) can accrue snapshots
 * - Verifiable history: never backfills or fabricates past dates
 */

import { prisma } from "./prisma.ts";
import { validateGitHubUsername } from "./github.ts";
import type { GitHubProfile, GitHubStatsSummary } from "./github.ts";
import type { Prisma } from "@prisma/client";

/**
 * Normalizes a GitHub username for consistent comparison and storage.
 * All usernames are trimmed and lowercased.
 */
export function normalizeUsername(username: string): string {
  if (!username || typeof username !== "string") return "";
  return username.trim().toLowerCase();
}

/**
 * Retrieves the configured single GitHub username authorized for snapshot tracking.
 * Defaults to "JOD-X8" per project specifications.
 */
export function getConfiguredTrackedUsername(): string {
  return (process.env.GITHUB_TRACKED_USERNAME || "JOD-X8").trim();
}

/**
 * Validates whether a given username matches the authorized tracked profile.
 * Prevents arbitrary usernames from populating database records.
 */
export function isTrackedProfile(username: string): boolean {
  if (!username) return false;
  return normalizeUsername(username) === normalizeUsername(getConfiguredTrackedUsername());
}

/**
 * Normalizes any timestamp or Date object to midnight UTC of that calendar day.
 * Ensures strict daily deduplication at the database layer (YYYY-MM-DD).
 */
export function getNormalizedSnapshotDate(date: Date = new Date()): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error("Invalid date provided for snapshot normalization.");
  }
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}

/**
 * Formats a Date to ISO calendar date string: YYYY-MM-DD (UTC).
 */
export function formatSnapshotDateString(date: Date): string {
  const normalized = getNormalizedSnapshotDate(date);
  return normalized.toISOString().slice(0, 10);
}

export interface RecordSnapshotParams {
  username: string;
  profile: GitHubProfile;
  summary: GitHubStatsSummary;
  targetDate?: Date;
}

export interface SnapshotResult {
  success: boolean;
  message: string;
  snapshot?: {
    id: string;
    profileId: string;
    snapshotDate: string;
    capturedAt: string;
    publicRepoCount: number;
    followers: number;
    following: number;
    totalStars: number;
    totalForks: number;
  };
  error?: string;
  statusCode?: number;
}

/**
 * Records or updates a daily snapshot for the authorized profile.
 * Idempotently upserts matching the compound key (profileId, snapshotDate).
 */
export async function recordStatsSnapshot({
  username,
  profile,
  summary,
  targetDate,
}: RecordSnapshotParams): Promise<SnapshotResult> {
  // 1. Validate username format
  const validation = validateGitHubUsername(username);
  if (!validation.valid) {
    return {
      success: false,
      message: validation.error || "Invalid username format.",
      error: validation.error,
      statusCode: 400,
    };
  }

  // 2. Security Check: Restrict to configured tracked profile
  if (!isTrackedProfile(username)) {
    const configured = getConfiguredTrackedUsername();
    return {
      success: false,
      message: `Unauthorized. Snapshot collection is restricted strictly to configured profile "${configured}".`,
      error: "UNAUTHORIZED_TRACKED_PROFILE",
      statusCode: 403,
    };
  }

  // 3. Normalize username and snapshot date (UTC calendar date)
  const normalizedUser = normalizeUsername(username);
  const normalizedDate = getNormalizedSnapshotDate(targetDate || new Date());

  try {
    // 4. Find or create the TrackedProfile entity
    const canonicalName = profile.login || username;
    const profileUrl = profile.html_url || `https://github.com/${canonicalName}`;

    const trackedProfile = await prisma.trackedProfile.upsert({
      where: { username: normalizedUser },
      update: {
        canonicalName,
        profileUrl,
        lastSnapshotAt: new Date(),
      },
      create: {
        username: normalizedUser,
        canonicalName,
        profileUrl,
        lastSnapshotAt: new Date(),
      },
    });

    // 5. Idempotent Upsert for Daily StatsSnapshot:
    // Matches database unique constraint on (profileId, snapshotDate)
    const languageJson = (summary.languages || []) as unknown as Prisma.InputJsonValue;

    const snapshot = await prisma.statsSnapshot.upsert({
      where: {
        profileId_snapshotDate: {
          profileId: trackedProfile.id,
          snapshotDate: normalizedDate,
        },
      },
      update: {
        capturedAt: new Date(),
        publicRepoCount: summary.publicRepos ?? profile.public_repos ?? 0,
        followers: profile.followers ?? 0,
        following: profile.following ?? 0,
        totalStars: summary.totalStars ?? 0,
        totalForks: summary.totalForks ?? 0,
        languageBreakdown: languageJson,
      },
      create: {
        profileId: trackedProfile.id,
        snapshotDate: normalizedDate,
        capturedAt: new Date(),
        publicRepoCount: summary.publicRepos ?? profile.public_repos ?? 0,
        followers: profile.followers ?? 0,
        following: profile.following ?? 0,
        totalStars: summary.totalStars ?? 0,
        totalForks: summary.totalForks ?? 0,
        languageBreakdown: languageJson,
      },
    });

    return {
      success: true,
      message: `Snapshot successfully recorded for @${canonicalName} on ${formatSnapshotDateString(normalizedDate)}.`,
      snapshot: {
        id: snapshot.id,
        profileId: snapshot.profileId,
        snapshotDate: formatSnapshotDateString(snapshot.snapshotDate),
        capturedAt: snapshot.capturedAt.toISOString(),
        publicRepoCount: snapshot.publicRepoCount,
        followers: snapshot.followers,
        following: snapshot.following,
        totalStars: snapshot.totalStars,
        totalForks: snapshot.totalForks,
      },
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Database operation failed.";
    return {
      success: false,
      message: "Failed to persist snapshot to database.",
      error: errMessage,
      statusCode: 500,
    };
  }
}

export interface HistoricalAnalyticsResponse {
  configuredUsername: string;
  isConfigured: boolean;
  trackedProfile: {
    id: string;
    username: string;
    canonicalName: string;
    profileUrl: string;
    createdAt: string;
    lastSnapshotAt: string | null;
  } | null;
  snapshots: Array<{
    id: string;
    snapshotDate: string;
    capturedAt: string;
    publicRepoCount: number;
    followers: number;
    following: number;
    totalStars: number;
    totalForks: number;
    languageBreakdown: unknown;
  }>;
  totalSnapshots: number;
  databaseAvailable: boolean;
  message?: string;
}

/**
 * Fetches recorded snapshots for the tracked profile.
 * Gracefully handles database unavailability or empty records.
 */
export async function getHistoricalAnalyticsData(days?: number): Promise<HistoricalAnalyticsResponse> {
  const configured = getConfiguredTrackedUsername();
  const normalized = normalizeUsername(configured);

  try {
    const profile = await prisma.trackedProfile.findUnique({
      where: { username: normalized },
      include: {
        snapshots: {
          orderBy: { snapshotDate: "asc" },
          take: days ? days : undefined,
        },
      },
    });

    if (!profile) {
      return {
        configuredUsername: configured,
        isConfigured: true,
        trackedProfile: null,
        snapshots: [],
        totalSnapshots: 0,
        databaseAvailable: true,
        message: "No snapshots have been collected yet. Collection begins when triggered.",
      };
    }

    const formattedSnapshots = profile.snapshots.map((s) => ({
      id: s.id,
      snapshotDate: formatSnapshotDateString(s.snapshotDate),
      capturedAt: s.capturedAt.toISOString(),
      publicRepoCount: s.publicRepoCount,
      followers: s.followers,
      following: s.following,
      totalStars: s.totalStars,
      totalForks: s.totalForks,
      languageBreakdown: s.languageBreakdown,
    }));

    return {
      configuredUsername: configured,
      isConfigured: true,
      trackedProfile: {
        id: profile.id,
        username: profile.username,
        canonicalName: profile.canonicalName || configured,
        profileUrl: profile.profileUrl,
        createdAt: profile.createdAt.toISOString(),
        lastSnapshotAt: profile.lastSnapshotAt ? profile.lastSnapshotAt.toISOString() : null,
      },
      snapshots: formattedSnapshots,
      totalSnapshots: formattedSnapshots.length,
      databaseAvailable: true,
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Database connection unavailable";
    return {
      configuredUsername: configured,
      isConfigured: true,
      trackedProfile: null,
      snapshots: [],
      totalSnapshots: 0,
      databaseAvailable: false,
      message: `Database connection unavailable: ${errMessage}. Please configure a valid DATABASE_URL in .env.local and run prisma migrate.`,
    };
  }
}
