import { NextRequest, NextResponse } from "next/server";
import {
  validateGitHubUsername,
  extractRateLimit,
  getGitHubHeaders,
  GitHubProfile,
} from "@/lib/github";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;

    // 1. Validate username format
    const validation = validateGitHubUsername(username);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "Invalid GitHub username format." },
        { status: 400 }
      );
    }

    const sanitizedUsername = encodeURIComponent(username.trim());
    const apiUrl = `https://api.github.com/users/${sanitizedUsername}`;

    // 2. Fetch from GitHub REST API
    const response = await fetch(apiUrl, {
      headers: getGitHubHeaders(),
      next: { revalidate: 60 }, // Cache on server for 60 seconds to conserve rate limits
    });

    const rateLimit = extractRateLimit(response.headers);

    // 3. Handle rate limit exceeded
    if (response.status === 403 || response.status === 429) {
      const errorMsg = rateLimit.remaining === 0
        ? `GitHub API rate limit exceeded. Resets at ${new Date(rateLimit.reset * 1000).toLocaleTimeString()}.`
        : "GitHub API access forbidden.";

      return NextResponse.json(
        {
          error: errorMsg,
          rateLimit,
        },
        {
          status: 429,
          headers: {
            "x-ratelimit-remaining": rateLimit.remaining.toString(),
            "x-ratelimit-reset": rateLimit.reset.toString(),
          },
        }
      );
    }

    // 4. Handle 404 Not Found
    if (response.status === 404) {
      return NextResponse.json(
        {
          error: `GitHub user "${username}" was not found.`,
          rateLimit,
        },
        { status: 404 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `GitHub API responded with status ${response.status}`,
          rateLimit,
        },
        { status: response.status }
      );
    }

    const data = (await response.json()) as GitHubProfile;

    return NextResponse.json(
      {
        profile: data,
        rateLimit,
      },
      {
        status: 200,
        headers: {
          "x-ratelimit-remaining": rateLimit.remaining.toString(),
          "x-ratelimit-reset": rateLimit.reset.toString(),
        },
      }
    );
  } catch (error: unknown) {
    console.error("[GitHub API Error] Failed to fetch profile:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching the GitHub profile." },
      { status: 500 }
    );
  }
}
