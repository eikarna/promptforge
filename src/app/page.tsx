import Link from "next/link";
import { Zap, Layers, Shield, Sparkles, ArrowRight, Bot, History } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <Zap className="w-7 h-7 text-[var(--color-accent-cyan)]" />
          <span className="font-[var(--font-display)] text-xl font-bold gradient-text">
            PromptForge
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-sm">
            Sign In
          </Link>
          <Link href="/register" className="btn-primary text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-32">
        <div className="animate-fade-in-up opacity-0" style={{ animationFillMode: "forwards" }}>
          <div className="badge badge-cyan mb-6 mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Prompt Engineering
          </div>
        </div>

        <h1
          className="font-[var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl leading-tight animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
        >
          Transform Raw Ideas Into{" "}
          <span className="gradient-text">God-Tier Prompts</span>
        </h1>

        <p
          className="mt-6 text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          Bridge the gap between casual prompting and expert prompt engineering.
          Leverage CO-STAR, RISEN, and Hybrid frameworks to craft prompts that
          deliver exceptional AI outputs.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          <Link
            href="/register"
            className="btn-primary text-base flex items-center gap-2 px-8 py-4"
          >
            Start Enriching <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="btn-ghost text-base px-8 py-4"
          >
            Sign In
          </Link>
        </div>

        {/* Floating preview card */}
        <div
          className="mt-16 md:mt-24 w-full max-w-3xl glass-strong rounded-2xl p-6 text-left animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-[var(--color-danger)] opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[var(--color-warning)] opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[var(--color-success)] opacity-80" />
            <span className="text-xs text-[var(--color-text-muted)] ml-2 font-mono">
              prompt-enricher
            </span>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-[var(--color-text-muted)]">
              <span className="text-[var(--color-accent-cyan)]">Raw:</span>{" "}
              &quot;write me a marketing email&quot;
            </div>
            <div className="h-px bg-[var(--color-glass-border)]" />
            <div className="text-sm text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-accent-emerald)]">
                Enriched (CO-STAR):
              </span>{" "}
              <span className="text-[var(--color-text-primary)]">
                &quot;You are a senior email marketing strategist with 12+ years of experience
                in SaaS B2B campaigns. Craft a conversion-optimized email sequence
                targeting CTOs at mid-market companies ($10-50M ARR) who are evaluating
                AI-powered solutions...&quot;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-center mb-4">
            Why <span className="gradient-text">PromptForge</span>?
          </h2>
          <p className="text-center text-[var(--color-text-secondary)] mb-16 max-w-xl mx-auto">
            Professional prompt engineering frameworks, powered by state-of-the-art AI models.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Layers className="w-6 h-6" />,
                title: "Framework-Driven",
                desc: "Choose from CO-STAR, RISEN, or Hybrid frameworks — each optimized for different use cases and output quality.",
                badge: "CO-STAR • RISEN • Hybrid",
                color: "cyan",
              },
              {
                icon: <Bot className="w-6 h-6" />,
                title: "Multi-Model Support",
                desc: "Connect your OpenRouter API key to access NVIDIA Nemotron, Claude, Gemini, and dozens more cutting-edge models.",
                badge: "OpenRouter • NVIDIA NIM",
                color: "violet",
              },
              {
                icon: <History className="w-6 h-6" />,
                title: "Persistent History",
                desc: "Every enriched prompt is saved to your account. Search, filter, and reuse your best prompts across projects.",
                badge: "Cloud Synced",
                color: "emerald",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass p-6 md:p-8 group cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-[var(--color-accent-${feature.color})]/10 text-[var(--color-accent-${feature.color})]`}
                  style={{
                    background: `rgba(${feature.color === 'cyan' ? '0,212,255' : feature.color === 'violet' ? '124,58,237' : '52,211,153'}, 0.12)`,
                    color: `var(--color-accent-${feature.color})`,
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-[var(--font-display)] text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                  {feature.desc}
                </p>
                <span className={`badge badge-${feature.color}`}>
                  {feature.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-[var(--color-glass-border)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[var(--color-accent-cyan)]" />
            <span className="font-[var(--font-display)] text-sm font-semibold gradient-text">
              PromptForge
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            Built with Next.js, Tailwind CSS & state-of-the-art AI models
          </p>
        </div>
      </footer>
    </main>
  );
}
