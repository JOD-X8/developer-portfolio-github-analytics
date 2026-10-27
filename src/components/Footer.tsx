import React from "react";
import Link from "next/link";
import { ArrowUpRight, Shield } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-[#262B27] bg-[#0B0D0C] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Brand & Mission */}
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#262B27] bg-[#171A18] text-[#B7FF3C] text-xs font-mono font-bold">
                JX
              </div>
              <span className="font-mono text-sm font-bold text-[#E8ECE8]">
                JOD-X8
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#9BA39B]">
              Personal developer portfolio and public GitHub analytics explorer. 
              Designed with minimal dark aesthetics, neon-lime accents, and strict data integrity standards.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs font-medium text-[#9BA39B]">
            <Link href="/" className="hover:text-[#B7FF3C] transition-colors">
              Portfolio
            </Link>
            <Link href="/#about" className="hover:text-[#E8ECE8] transition-colors">
              About
            </Link>
            <Link href="/#skills" className="hover:text-[#E8ECE8] transition-colors">
              Skills
            </Link>
            <Link href="/#projects" className="hover:text-[#E8ECE8] transition-colors">
              Projects
            </Link>
            <Link href="/explorer" className="hover:text-[#B7FF3C] transition-colors">
              GitHub Explorer
            </Link>
            <Link href="/analytics" className="hover:text-[#B7FF3C] transition-colors">
              Analytics
            </Link>
            <a
              href="https://github.com/JOD-X8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#E8ECE8] hover:text-[#B7FF3C] transition-colors"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>GitHub</span>
              <ArrowUpRight className="h-3 w-3 text-[#9BA39B]" />
            </a>
          </div>
        </div>

        {/* Bottom Credits & Status */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#262B27] pt-6 text-[11px] text-[#9BA39B]">
          <div className="flex items-center gap-2">
            <span>© {currentYear} JOD-X8. All rights reserved.</span>
            <span>•</span>
            <span className="font-mono text-[#B7FF3C]">Developer Portfolio & Analytics</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[#9BA39B]">
              <Shield className="h-3.5 w-3.5 text-[#B7FF3C]" />
              <span>WCAG AA Contrast Verified</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
