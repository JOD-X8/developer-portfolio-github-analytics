import { NextRequest, NextResponse } from "next/server";
import {
  getConfiguredTrackedUsername,
  isTrackedProfile,
  recordStatsSnapshot,
} from "@/lib/analytics";
import { getGitHubHeaders, computeLanguageBreakdown, GitHubProfile, GitHubRepo } from "@/lib/github";

export async function POST(request: NextRequest) {
  try {
    let requestedUsername = "";
    try {
      const body = await request.json();
      requestedUsername = body.username || "";
    } catch {
      // Body may be empty if called without json payload
    }

    const trackedUsername = getConfiguredTrackedUsername();
    const targetUsername = requestedUsername ? requestedUsername.trim() : trackedUsername;

    // 1. Authorization check: Snapshot collection restricted to the configured profile
    if (!isTrackedProfile(targetUsername)) {
      return NextResponse.json(
        {
          error: `Snapshot collection is restricted to configured profile "@${trackedUsername}". Arbitrary profile collection is disallowed.`,
          configuredUsername: trackedUsername,
        },
        { status: 403 }
      );
    }

    // 2. Fetch live data from GitHub REST API
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(targetUsername)}`, {
        headers: getGitHubHeaders(),
      }),
      fetch(`https://api.github.com/users/${encodeURIComponent(targetUsername)}/repos?per_page=100&sort=updated`, {
        headers: getGitHubHeaders(),
      }),
    ]);

    if (!profileRes.ok) {
      const errData = await profileRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.message || `Failed to fetch GitHub profile (HTTP ${profileRes.status})` },
        { status: profileRes.status }
      );
    }

    if (!reposRes.ok) {
      const errData = await reposRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.message || `Failed to fetch GitHub repositories (HTTP ${reposRes.status})` },
        { status: reposRes.status }
      );
    }

    const profile = (await profileRes.json()) as GitHubProfile;
    const repos = (await reposRes.json()) as GitHubRepo[];

    // 3. Compute metrics
    let totalStars = 0;
    let totalForks = 0;

    for (const repo of repos) {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
    }

    const languages = computeLanguageBreakdown(repos);

    // 4. Record snapshot with idempotent upsert
    const result = await recordStatsSnapshot({
      username: targetUsername,
      profile,
      summary: {
        publicRepos: repos.length,
        totalStars,
        totalForks,
        followers: profile.followers,
        following: profile.following,
        languages,
      },
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || result.message },
        { status: result.statusCode || 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("[API Error] Failed to record snapshot:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while capturing the daily snapshot." },
      { status: 500 }
    );
  }
}
