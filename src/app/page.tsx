import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { GitHubStatsLive } from "@/components/GitHubStatsLive";
import { HistoricalAnalyticsPreview } from "@/components/HistoricalAnalyticsPreview";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <GitHubStatsLive />
      <HistoricalAnalyticsPreview />
    </div>
  );
}
