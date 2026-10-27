import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JOD-X8 | Developer Portfolio & GitHub Analytics",
  description:
    "Personal developer portfolio and public GitHub analytics explorer for JOD-X8. Built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.",
  keywords: [
    "JOD-X8",
    "Developer Portfolio",
    "GitHub Analytics",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "PostgreSQL",
  ],
  authors: [{ name: "JOD-X8", url: "https://github.com/JOD-X8" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#0B0D0C] text-[#E8ECE8] antialiased selection:bg-[#B7FF3C] selection:text-[#0B0D0C]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[#B7FF3C] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-[#0B0D0C] focus:shadow-lg focus:ring-2 focus:ring-[#0B0D0C] focus:outline-none"
        >
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main id="main-content" className="flex-1 focus:outline-none">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
