"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, BarChart3, Compass, User } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#262B27] bg-[#0B0D0C]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-colors"
          aria-label="Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#262B27] bg-[#171A18] text-[#B7FF3C] transition-all group-hover:border-[#B7FF3C]/50 group-hover:glow-lime-sm">
            <span className="font-mono text-sm font-bold">JX</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-base font-semibold tracking-tight text-[#E8ECE8] group-hover:text-[#B7FF3C] transition-colors">
              JOD-X8
            </span>
            <span className="text-[11px] font-medium text-[#9BA39B]">
              Developer & Analytics
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex md:items-center md:gap-7"
          aria-label="Primary Navigation"
        >
          <Link
            href="/"
            className="text-sm font-medium text-[#E8ECE8] hover:text-[#B7FF3C] transition-colors"
          >
            Portfolio
          </Link>
          <Link
            href="/#about"
            className="text-sm font-medium text-[#9BA39B] hover:text-[#E8ECE8] transition-colors"
          >
            About
          </Link>
          <Link
            href="/#skills"
            className="text-sm font-medium text-[#9BA39B] hover:text-[#E8ECE8] transition-colors"
          >
            Skills
          </Link>
          <Link
            href="/#projects"
            className="text-sm font-medium text-[#9BA39B] hover:text-[#E8ECE8] transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/explorer"
            className="flex items-center gap-1.5 text-sm font-medium text-[#9BA39B] hover:text-[#B7FF3C] transition-colors"
          >
            <Compass className="h-4 w-4" />
            <span>GitHub Explorer</span>
          </Link>
          <Link
            href="/analytics"
            className="flex items-center gap-1.5 text-sm font-medium text-[#9BA39B] hover:text-[#B7FF3C] transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://github.com/JOD-X8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-[#262B27] bg-[#171A18] px-3.5 py-2 text-xs font-semibold text-[#E8ECE8] transition-all hover:border-[#B7FF3C]/60 hover:text-[#B7FF3C] hover:glow-lime-sm"
          >
                <GithubIcon className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className="rounded-lg border border-[#262B27] bg-[#171A18] p-2 text-[#9BA39B] hover:text-[#E8ECE8] hover:border-[#B7FF3C]/40"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-b border-[#262B27] bg-[#171A18] px-4 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#E8ECE8] hover:bg-[#1E2320] hover:text-[#B7FF3C]"
            >
              <User className="h-4 w-4" />
              <span>Portfolio</span>
            </Link>
            <Link
              href="/#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-[#9BA39B] hover:bg-[#1E2320] hover:text-[#E8ECE8]"
            >
              About
            </Link>
            <Link
              href="/#skills"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-[#9BA39B] hover:bg-[#1E2320] hover:text-[#E8ECE8]"
            >
              Skills
            </Link>
            <Link
              href="/#projects"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-[#9BA39B] hover:bg-[#1E2320] hover:text-[#E8ECE8]"
            >
              Projects
            </Link>
            <Link
              href="/explorer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#9BA39B] hover:bg-[#1E2320] hover:text-[#B7FF3C]"
            >
              <Compass className="h-4 w-4" />
              <span>GitHub Explorer</span>
            </Link>
            <Link
              href="/analytics"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#9BA39B] hover:bg-[#1E2320] hover:text-[#B7FF3C]"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
            <div className="pt-2">
              <a
                href="https://github.com/JOD-X8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#262B27] bg-[#0B0D0C] py-2.5 text-xs font-semibold text-[#E8ECE8] hover:border-[#B7FF3C]/50 hover:text-[#B7FF3C]"
              >
                    <GithubIcon className="h-4 w-4" />
                <span>View GitHub Profile</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
