import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "PromptForge — AI Prompt Enrichment Platform",
  description:
    "Transform raw prompts into expertly structured, god-tier AI prompts using CO-STAR, RISEN, and Hybrid frameworks. Professional prompt engineering made effortless.",
  keywords: ["prompt engineering", "AI prompts", "CO-STAR", "RISEN", "LLM", "prompt enrichment"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {/* Animated background mesh */}
        <div className="bg-mesh">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <Providers>
          <div className="relative z-10 min-h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
